/**
 * @module domchange
 *
 * This module handles DOM mutation detection and conversion to ProseMirror transactions.
 * It provides the core functionality for reading changes from the DOM and applying them
 * to the editor state, including handling various browser-specific quirks and edge cases.
 *
 * Key responsibilities:
 * - Parse DOM changes and convert them to ProseMirror document changes
 * - Handle browser-specific quirks (Chrome, Safari, IE11, Android, iOS)
 * - Detect and optimize mark changes (bold, italic, etc.)
 * - Manage selection reconstruction after DOM mutations
 * - Handle composition events and IME input
 *
 * @remarks All referencing and parsing is done with the start-of-operation selection
 * and document, since that's the one that the DOM represents. If any changes came
 * in the meantime, the modification is mapped over those before it is applied.
 */

import {browser, ENTER_KEY_CODE} from '@type-editor/commons';
import type {PmEditorView, PmSelection, PmTransaction} from '@type-editor/editor-types';
import type {Mark, Node, ResolvedPos, Slice} from '@type-editor/model';
import {selectionToDOM} from '@type-editor/selection-util';

import {isAndroidEnterSuggestionQuirk} from './browser-hacks/is-android-enter-suggestion-quirk';
import {isIE11NonBreakingSpaceBug} from './browser-hacks/is-ie11-non-breaking-space-bug';
import {shouldHandleMobileEnterKey} from './browser-hacks/should-handle-mobile-enter-key';
import {shouldSuppressSelectionDuringComposition} from './browser-hacks/should-suppress-selection-during-composition';
import {findDiff} from './parse-change/find-diff';
import {getPreferredDiffPosition} from './parse-change/get-preferred-diff-position';
import {handleSelectionOnlyChange} from './parse-change/handle-selection-only-change';
import {isMarkChange} from './parse-change/is-mark-change';
import {looksLikeBackspaceKey} from './parse-change/looks-like-backspace-key';
import {looksLikeEnterKey} from './parse-change/looks-like-enter-key';
import {needsSelectionOverwriteAdjustment} from './parse-change/needs-selection-overwrite-adjustment';
import {parseBetween} from './parse-change/parse-between';
import {resolveSelection} from './parse-change/resolve-selection';
import {shouldAdjustChangeEndToSelection} from './parse-change/should-adjust-change-end-to-selection';
import {shouldAdjustChangeStartToSelection} from './parse-change/should-adjust-change-start-to-selection';
import {shouldCreateTypeOverChange} from './parse-change/should-create-type-over-change';
import type {DocumentChange} from './types/dom-change/DocumentChange';
import type {MarkChangeInfo} from './types/dom-change/MarkChangeInfo';
import type {ParseBetweenResult} from './types/dom-change/ParseBetweenResult';
import {keyEvent} from './util/key-event';


/**
 * Reads and processes changes from the DOM, converting them into ProseMirror transactions.
 *
 * This is the main entry point for handling DOM mutations and converting them into
 * document updates. It orchestrates the entire DOM change detection and processing
 * pipeline, including:
 *
 * **Core Process:**
 * 1. Handles selection-only changes (when from < 0)
 * 2. Adjusts change range to block boundaries
 * 3. Parses the changed DOM range into a ProseMirror document
 * 4. Compares parsed content with current document to find differences
 * 5. Applies various browser-specific adjustments
 * 6. Creates and dispatches appropriate transactions
 *
 * **Special Handling:**
 * - Mobile Enter key detection (iOS/Android)
 * - Type-over selection behavior
 * - Mark-only changes (bold, italic, etc.)
 * - Backspace/Enter key event delegation
 * - Browser-specific quirks (Chrome, Safari, IE11, Android)
 * - IME composition tracking
 *
 * **Transaction Types:**
 * - Selection updates (for selection-only changes)
 * - Content replacements (for insertions/deletions)
 * - Mark additions/removals (optimized path for styling changes)
 * - Text insertions (with handleTextInput plugin support)
 *
 * The function ensures that all changes maintain document validity and properly
 * handle edge cases across different browsers and input methods.
 *
 * @param view - The editor view containing the DOM, document state, and plugin system.
 *               All changes are relative to view.state.doc at the time of the call.
 * @param from - Start position of the change in the document. Negative values (typically -1)
 *               indicate selection-only changes with no content modification.
 * @param to - End position of the change in the document. Forms the range [from, to]
 *             that was potentially modified in the DOM.
 * @param typeOver - Whether this change is part of typing over an active selection.
 *                   When true, special handling ensures the entire selection is replaced
 *                   even if the diff only detects part of the change.
 * @param addedNodes - Readonly array of DOM nodes that were added during the mutation.
 *                     Used for detecting block-level Enter key presses on mobile devices.
 *
 * @see {@link parseBetween} for DOM parsing
 * @see {@link findDiff} for change detection
 * @see {@link handleSelectionOnlyChange} for selection updates
 *
 * @example
 * ```typescript
 * // Called by the DOM observer when mutations are detected
 * view.domObserver.flush();  // This internally calls readDOMChange
 * ```
 */
export function readDOMChange(view: PmEditorView,
                              from: number,
                              to: number,
                              typeOver: boolean,
                              addedNodes: ReadonlyArray<DOMNode>): void {
    const compositionID: number = view.input.compositionPendingChanges || (view.composing ? view.input.compositionID : 0);
    view.input.compositionPendingChanges = 0;

    // Handle selection-only changes (no content change)
    if (from < 0) {
        handleSelectionOnlyChange(view, compositionID);
        return;
    }

    const $before: ResolvedPos = view.state.doc.resolve(from);
    const shared: number = $before.sharedDepth(to);
    const adjustedFrom: number = $before.before(shared + 1);
    const adjustedTo: number = view.state.doc.resolve(to).after(shared + 1);

    const selection: PmSelection = view.state.selection;
    const parse: ParseBetweenResult = parseBetween(view, adjustedFrom, adjustedTo);

    const doc: Node = view.state.doc;
    const compare: Slice = doc.slice(parse.from, parse.to);

    const { preferredPos, preferredSide } = getPreferredDiffPosition(view);
    view.input.lastKeyCode = null;

    let change: DocumentChange = findDiff(compare.content, parse.doc.content, parse.from, preferredPos, preferredSide);
    if (change) {
        view.input.domChangeCount++;
    }

    // Handle mobile Enter key detection
    if (shouldHandleMobileEnterKey(view, addedNodes, change)) {
        view.input.lastIOSEnter = 0;
        return;
    }
    if (!change) {
        if (shouldCreateTypeOverChange(typeOver, selection, view, parse)) {
            change = { start: selection.from, endA: selection.to, endB: selection.to };
        } else {
            if (parse.sel) {
                const selection: PmSelection = resolveSelection(view, view.state.doc, parse.sel);
                if (selection && !selection.eq(view.state.selection)) {
                    const transaction: PmTransaction = view.state.transaction.setSelection(selection);
                    if (compositionID) {
                        transaction.setMeta('composition', compositionID);
                    }
                    view.dispatch(transaction);
                }
            }
            return;
        }
    }

    // Handle the case where overwriting a selection by typing matches
    // the start or end of the selected content, creating a change
    // that's smaller than what was actually overwritten.
    if (needsSelectionOverwriteAdjustment(view, change)) {
        if (shouldAdjustChangeStartToSelection(change, view.state.selection, parse.from)) {
            change.start = view.state.selection.from;
        } else if (shouldAdjustChangeEndToSelection(change, view.state.selection, parse.to)) {
            change.endB += (view.state.selection.to - change.endA);
            change.endA = view.state.selection.to;
        }
    }

    // IE11 will insert a non-breaking space _ahead_ of the space after
    // the cursor space when adding a space before another space. When
    // that happened, adjust the change to cover the space instead.
    if (isIE11NonBreakingSpaceBug(change, parse)) {
        change.start--;
        change.endA--;
        change.endB--;
    }

    const $from: ResolvedPos = parse.doc.resolveNoCache(change.start - parse.from);
    let $to: ResolvedPos = parse.doc.resolveNoCache(change.endB - parse.from);
    const $fromA: ResolvedPos = doc.resolve(change.start);
    const inlineChange: boolean = $from.sameParent($to) && $from.parent.inlineContent && $fromA.end() >= change.endA;

    // If this looks like the effect of pressing Enter, dispatch an Enter key instead
    if (looksLikeEnterKey(view, parse, $from, $to, inlineChange, addedNodes)) {
        view.input.lastIOSEnter = 0;
        // Suppress selection updates to prevent the browser from overwriting
        // the selection position set by the Enter key handler
        view.domObserver.suppressSelectionUpdates();
        return;
    }

    // Same for backspace
    if (looksLikeBackspaceKey(view, doc, change, $from, $to)) {
        if (browser.android && browser.chrome) {
            view.domObserver.suppressSelectionUpdates();
        } // #820
        return;
    }

    // Chrome will occasionally, during composition, delete the
    // entire composition and then immediately insert it again. This is
    // used to detect that situation.
    if (browser.chrome && change.endB === change.start) {
        view.input.lastChromeDelete = Date.now();
    }

    // This tries to detect Android virtual keyboard enter-and-pick-suggestion action.
    // That sometimes (see issue #1059) first fires a DOM mutation, before moving the
    // selection to the newly created block. When that happens, we drop the new paragraph
    // from the initial change, and fire a simulated enter key afterwards.
    if (isAndroidEnterSuggestionQuirk($from, $to, inlineChange, parse, change)) {
        change.endB -= 2;
        $to = parse.doc.resolveNoCache(change.endB - parse.from);

        setTimeout(() => {
            view.someProp('handleKeyDown', function (f) { return f(view, keyEvent(ENTER_KEY_CODE, 'Enter')); });
        }, 20);
    }

    const chFrom: number = change.start;
    const chTo: number = change.endA;


    let markChange: MarkChangeInfo | null;
    if (inlineChange) {
        if ($from.pos === $to.pos) { // Deletion
            // IE11 sometimes weirdly moves the DOM selection around after
            // backspacing out the first element in a textblock
            if (browser.ie && browser.ie_version <= 11 && $from.parentOffset === 0) {
                view.domObserver.suppressSelectionUpdates();
                setTimeout(() => { selectionToDOM(view); }, 20);
            }

            const transaction: PmTransaction = createTransactionForDOMChange(view, parse, change, chFrom, chTo, compositionID, view.state.transaction.delete(chFrom, chTo));
            const marks: ReadonlyArray<Mark> = doc.resolve(change.start).marksAcross(doc.resolve(change.endA));
            if (marks) {
                transaction.ensureMarks(marks);
            }

            view.dispatch(transaction);
        } else if ( // Adding or removing a mark
            change.endA === change.endB
            && (markChange = isMarkChange($from.parent.content.cut($from.parentOffset, $to.parentOffset), $fromA.parent.content.cut($fromA.parentOffset, change.endA - $fromA.start())))) {

            const transaction: PmTransaction = createTransactionForDOMChange(view, parse, change, chFrom, chTo, compositionID, view.state.transaction);
            if (markChange.type === 'add') {
                transaction.addMark(chFrom, chTo, markChange.mark);
            } else {
                transaction.removeMark(chFrom, chTo, markChange.mark);
            }

            view.dispatch(transaction);
        } else if ($from.parent.child($from.index()).isText && $from.index() === $to.index() - ($to.textOffset ? 0 : 1)) {
            // Both positions in the same text node -- simply insert text
            const text: string = $from.parent.textBetween($from.parentOffset, $to.parentOffset);
            const deflt = () => createTransactionForDOMChange(view, parse, change, chFrom, chTo, compositionID, view.state.transaction.insertText(text, chFrom, chTo));
            if (!view.someProp('handleTextInput', f => f(view, chFrom, chTo, text, deflt)))
                {view.dispatch(deflt());}
        } else {
            view.dispatch(createTransactionForDOMChange(view, parse, change, chFrom, chTo, compositionID));
        }
    } else {
        view.dispatch(createTransactionForDOMChange(view, parse, change, chFrom, chTo, compositionID));
    }
}


/**
 * Creates a transaction for applying a DOM change to the document.
 *
 * This helper function constructs a ProseMirror transaction that replaces content
 * in the document based on parsed DOM changes. It handles:
 * - Creating a replacement transaction with the parsed content slice
 * - Resolving and setting the selection from the parsed DOM state
 * - Handling browser-specific composition quirks
 * - Adding composition metadata for IME tracking
 * - Ensuring the transaction scrolls the changed content into view
 *
 * The function can either create a new replacement transaction or augment an
 * existing base transaction (useful when the caller has already started building
 * a transaction with specific operations like delete or insertText).
 *
 * **Selection Handling:**
 * The function attempts to restore the selection from the parsed DOM state, but
 * suppresses this in certain cases where browsers misreport selection during
 * composition (Chrome) or fail to advance the cursor properly (Edge).
 *
 * **Composition Support:**
 * If a compositionID is provided, it's attached as metadata to ensure the editor
 * can properly track and handle IME composition sessions across multiple changes.
 *
 * @param view - The editor view containing the document state and plugin system
 * @param parse - Result from parsing the changed DOM range, including the parsed
 *                document slice and any detected selection
 * @param change - Description of what changed in the document (start, endA, endB positions)
 * @param chFrom - Start position of the change in the original document
 * @param chTo - End position of the change in the original document
 * @param compositionID - Optional IME composition session identifier for tracking
 *                        composition events across multiple changes
 * @param base - Optional base transaction to augment. If provided, this transaction
 *               is used instead of creating a new replacement transaction. The slice
 *               is still applied via replace(), and selection/composition metadata
 *               are added as normal.
 *
 * @returns A transaction ready to be dispatched, with scrollIntoView enabled
 *
 * @see {@link resolveSelection} for selection reconstruction
 * @see {@link shouldSuppressSelectionDuringComposition} for browser quirk detection
 */
function createTransactionForDOMChange(view: PmEditorView,
                                       parse: ParseBetweenResult,
                                       change: DocumentChange,
                                       chFrom: number,
                                       chTo: number,
                                       compositionID: number,
                                       base?: PmTransaction): PmTransaction {
    const slice: Slice = parse.doc.slice(change.start - parse.from, change.endB - parse.from);
    const transaction: PmTransaction = base || view.state.transaction.replace(chFrom, chTo, slice);

    if (parse.sel) {
        const selection: PmSelection = resolveSelection(view, transaction.doc, parse.sel);

        // Chrome will sometimes, during composition, report the selection in the wrong place.
        // Edge just doesn't move the cursor forward when typing in empty blocks.
        if (selection && !shouldSuppressSelectionDuringComposition(view, selection, change, chFrom, chTo, transaction)) {
            transaction.setSelection(selection);
        }
    }

    if (compositionID) {
        transaction.setMeta('composition', compositionID);
    }
    return transaction.scrollIntoView();
}
