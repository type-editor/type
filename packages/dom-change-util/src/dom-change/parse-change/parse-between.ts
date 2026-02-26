import {ELEMENT_NODE, isUndefinedOrNull} from '@type-editor/commons';
import type {DOMSelectionRange, PmEditorView, PmViewDesc} from '@type-editor/editor-types';
import type {Node, ResolvedPos} from '@type-editor/model';
import {DOMParser, type TagParseRule} from '@type-editor/model';
import {selectionCollapsed} from '@type-editor/selection-util';

import {adjustForChromeBackspaceBug} from '../browser-hacks/adjust-for-chrome-backspace-bug';
import {handleBRNodeRule} from '../browser-hacks/handle-br-node-rule';
import type {DOMPositionInfo} from '../types/dom-change/DOMPositionInfo';
import type {ParseBetweenResult} from '../types/dom-change/ParseBetweenResult';

/**
 * Parses a range of DOM content into a ProseMirror document fragment.
 *
 * This function is the core of DOM change detection. It takes a range of positions
 * in the document, finds the corresponding DOM nodes, parses them into a ProseMirror
 * document, and attempts to reconstruct the selection state. It also applies various
 * browser-specific workarounds during the parsing process.
 *
 * The parsing process:
 * 1. Determines the DOM range to parse
 * 2. Builds position tracking for selection reconstruction
 * 3. Applies browser-specific adjustments (e.g., Chrome backspace bug)
 * 4. Parses the DOM into a ProseMirror document
 * 5. Reconstructs selection from tracked positions
 *
 * @param view - The editor view containing the document and DOM
 * @param from_ - Start position in the ProseMirror document (absolute position)
 * @param to_ - End position in the ProseMirror document (absolute position)
 * @returns Parsed document information including the parsed content, selection state,
 *          and the actual from/to positions used (which may differ from input)
 *
 * @see {@link adjustForChromeBackspaceBug} for browser-specific adjustments
 */
export function parseBetween(view: PmEditorView, from_: number, to_: number): ParseBetweenResult {
    const parseRange = view.docView.parseRange(from_, to_);
    const parent: DOMNode = parseRange.node;
    const fromOffset: number = parseRange.fromOffset;
    let toOffset: number = parseRange.toOffset;
    const from: number = parseRange.from;
    const to: number = parseRange.to;

    // Build position tracking for selection reconstruction
    const find: Array<DOMPositionInfo> = buildFindPositions(view);

    // Work around Chrome backspace bug (issues #799, #831)
    toOffset = adjustForChromeBackspaceBug(view, parent, fromOffset, toOffset);

    // Parse the DOM content into ProseMirror document
    const startDoc: Node = view.state.doc;
    const parser: DOMParser = view.someProp('domParser') || DOMParser.fromSchema(view.state.schema);
    const $from: ResolvedPos = startDoc.resolve(from);

    const doc: Node = parser.parse(parent, {
        topNode: $from.parent,
        topMatch: $from.parent.contentMatchAt($from.index()),
        topOpen: true,
        from: fromOffset,
        to: toOffset,
        preserveWhitespace: $from.parent.type.whitespace === 'pre' ? 'full' : true,
        findPositions: find,
        ruleFromNode,
        context: $from
    });

    // Reconstruct selection from parsed positions
    const selection = reconstructSelection(find, from);

    return { doc, sel: selection, from, to };
}

/**
 * Builds an array of DOM positions to track during parsing for selection reconstruction.
 *
 * This function extracts the current DOM selection and creates position tracking
 * information that will be used by the parser. The parser will fill in the `pos`
 * field of each DOMPositionInfo object with the corresponding ProseMirror position.
 * This allows us to reconstruct the selection after parsing is complete.
 *
 * The function returns undefined if:
 * - There is no anchor node in the selection
 * - The anchor node is not contained within the editor DOM
 * - The anchor node's parent is not contained within the editor DOM
 *
 * For collapsed selections (cursor), only one position is tracked. For range
 * selections, both anchor and focus positions are tracked.
 *
 * @param view - The editor view containing the DOM and selection state
 * @returns Array of position info with anchor (and optionally focus) if selection
 *          is within the editor, undefined if selection is outside the editor
 *
 * @see {@link DOMPositionInfo} for the structure of tracked positions
 */
function buildFindPositions(view: PmEditorView): Array<DOMPositionInfo> | undefined {
    const domSel: DOMSelectionRange = view.domSelectionRange();
    const anchor: DOMNode = domSel.anchorNode;

    if (!anchor) {
        return undefined;
    }

    const containerNode = anchor.nodeType === ELEMENT_NODE ? anchor : anchor.parentNode;
    if (!containerNode || !view.dom.contains(containerNode)) {
        return undefined;
    }

    const positions: Array<DOMPositionInfo> = [{
        node: anchor,
        offset: domSel.anchorOffset
    }];

    if (!selectionCollapsed(domSel)) {
        positions.push({
            node: domSel.focusNode,
            offset: domSel.focusOffset
        });
    }

    return positions;
}

/**
 * Reconstructs selection information from parsed DOM positions.
 *
 * After parsing, the parser fills in the `pos` field of the DOMPositionInfo objects
 * with the corresponding ProseMirror positions. This function takes those positions
 * and creates a selection object suitable for use with ProseMirror.
 *
 * The function handles both collapsed selections (cursor at a single position) and
 * range selections (anchor and focus at different positions).
 *
 * Returns null if:
 * - The find array is undefined (no positions were tracked)
 * - The first position's pos field is undefined or null (parsing didn't find it)
 *
 * For collapsed selections, both anchor and head will be the same position.
 * For range selections, anchor comes from find[0] and head from find[1].
 *
 * @param find - Array of position info from parsing, with pos fields filled in by parser.
 *               Typically contains 1 element for collapsed selections or 2 for ranges.
 * @param fromOffset - Base offset to add to the parsed positions to get absolute document positions.
 *                     This is the starting position of the parsed range in the full document.
 * @returns Selection object with absolute anchor and head positions, or null if selection
 *          could not be reconstructed (e.g., if it was outside the parsed range)
 */
function reconstructSelection(find: Array<DOMPositionInfo> | undefined,
                              fromOffset: number): { anchor: number; head: number } | null {
    if (isUndefinedOrNull(find?.[0].pos)) {
        return null;
    }

    const anchor: number = find[0].pos;
    const head: number = find[1]?.pos ?? anchor;

    return {
        anchor: anchor + fromOffset,
        head: head + fromOffset
    };
}

/**
 * Generates a parse rule for a given DOM node, handling browser-specific quirks.
 *
 * This function is called during DOM parsing to determine how each DOM node
 * should be handled. It checks for several special cases:
 *
 * 1. **Nodes with view descriptors:** These are nodes that ProseMirror already knows
 *    about and can use the existing parse rule from the view descriptor.
 *
 * 2. **BR elements:** These need special handling for Safari quirks (see handleBRNodeRule).
 *
 * 3. **Mark placeholder images:** These are ignored as they're not part of the actual content.
 *
 * If none of these special cases apply, returns null to use default parsing.
 *
 * @param dom - The DOM node to generate a parse rule for. Can be any DOM node type.
 * @returns A parse rule (without tag specification) that tells the parser how to
 *          handle this node, or null if default parsing should be used.
 *          The rule can include properties like 'ignore' or 'skip'.
 *
 * @see {@link handleBRNodeRule} for BR element handling
 * @see {@link PmViewDesc.parseRule} for view descriptor rules
 */
function ruleFromNode(dom: DOMNode): Omit<TagParseRule, 'tag'> | null {
    const viewDesc: PmViewDesc = dom.pmViewDesc;

    if (viewDesc) {
        return viewDesc.parseRule();
    }

    if (dom.nodeName === 'BR' && dom.parentNode) {
        return handleBRNodeRule(dom);
    }

    if (dom.nodeName === 'IMG' && (dom as HTMLElement).getAttribute('mark-placeholder')) {
        return { ignore: true };
    }

    return null;
}
