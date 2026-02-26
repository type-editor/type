import {
    type ExtendedSelectionResult,
    findExtendedMarkSelection,
    isCodeBlock,
    toggleMark,
} from '@type-editor/commands';
import type { PmEditorView } from '@type-editor/dropcursor';
import type { DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import type { Attrs, Mark, MarkType, NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { documentIsNotEmpty } from './util/document-is-not-empty';
import { EditDialog } from './util/EditDialog';
import { isSelectionLengthInRange } from './util/is-len-in-range';

/**
 * Represents the attributes of a link mark in the editor.
 */
interface CurrentLink {
    /** The URL or href of the link */
    href: string;
    /** The target attribute (e.g., '_blank' for opening in a new window) */
    target?: string;
    /** An optional identifier for the link */
    id?: string;
    /** An optional title for the link, typically the selected text */
    title?: string;
}

/**
 * HTML element IDs used in the link dialog form.
 */
const DIALOG_IDS = {
    FORM: 'pm-link-form',
    LINK_INPUT: 'pm-insert-link-input',
    INSERT_BUTTON: 'pm-insert-link-btn',
    NEW_WINDOW_CHECKBOX: 'pm-setting-newwindow-btn',
    REMOVE_BUTTON: 'pm-remove-link-btn',
    OPEN_BUTTON: 'pm-open-link-btn',
} as const;


/**
 * Creates a menu item for adding, editing, or removing links in the editor.
 *
 * This function returns a MenuItem that opens a dialog allowing users to:
 * - Add a new link to selected text
 * - Edit an existing link's URL or target
 * - Remove an existing link
 * - Open an existing link in a new window
 *
 * @param title - The display title for the menu item (default: 'Link')
 * @param linkMarkType - The mark type used for links (default: schema.marks.link)
 * @param codeBlockNodeType - used to identify code blocks where link editing is disabled (default: schema.nodes.code_block)
 * @returns A configured MenuItem for link operations
 *
 * @example
 * ```typescript
 * const linkMenuItem = linkItem('Insert Link', schema.marks.link);
 * ```
 */
export function linkItem(title = 'Link',
                         linkMarkType: MarkType = schema.marks.link,
                         codeBlockNodeType: NodeType = schema.nodes.code_block): MenuItem {
    return new MenuItem({
        title,
        label: title,
        run: (state: PmEditorState, dispatch: DispatchFunction, editorView: PmEditorView): boolean => {

            const dialog = new EditDialog();
            const currentLink = retrieveSelectedLink(state, linkMarkType);

            createLinkDialogForm(dialog, editorView, currentLink);

            attachFormSubmitHandler(dialog, currentLink, linkMarkType, state, dispatch, editorView);

            if (currentLink) {
                attachOpenLinkHandler(dialog, currentLink);
                attachRemoveLinkHandler(dialog, linkMarkType, state, dispatch, editorView);
            }

            return true;
        },

        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && isSelectionLengthInRange(state, 500, 0) && !isCodeBlock(state, codeBlockNodeType) && (!!findLinkMark(state, linkMarkType) || !state.selection.empty),
        active: (state: PmEditorState): boolean => !!findLinkMark(state, linkMarkType),
        icon: icons.link,
    });
}


/* -------------------- Insert / update link -------------------- */

/**
 * Applies the link update by creating and dispatching a transaction.
 *
 * This function handles both creating new links and updating existing ones.
 * For cursor positions within existing links, it extends the selection to
 * cover the entire link before applying the update.
 *
 * @param state - The current editor state
 * @param dispatch - The dispatch function to apply transactions
 * @param linkMarkType - The mark type for links
 * @param attrs - The new link attributes
 * @param currentLink - The existing link if updating, or null if creating new
 */
function insertOrUpdateLink(state: PmEditorState,
                            dispatch: DispatchFunction,
                            linkMarkType: MarkType,
                            attrs: Attrs,
                            currentLink: CurrentLink | null): void {
    const transaction = state.transaction;
    let { from, to } = state.selection;

    // For empty selections within a link, extend to the full link range
    if (state.selection.empty && currentLink) {
        const extendedSelection: ExtendedSelectionResult = findExtendedMarkSelection(
            state.doc,
            state.selection.$cursor,
            linkMarkType,
            false
        );

        if (extendedSelection.found) {
            from = extendedSelection.from;
            to = extendedSelection.to;
        }
    }

    // Remove existing link mark before adding the new one
    if (currentLink) {
        transaction.removeMark(from, to, linkMarkType);
    }

    // Add the new link mark
    transaction.addMark(from, to, linkMarkType.create(attrs));

    dispatch(transaction);
}


/* -------------------- Create link dialog -------------------- */

/**
 * Creates and displays the link dialog form.
 *
 * Generates an HTML form with input fields for the link URL and options for
 * opening in a new window. For existing links, also includes buttons to
 * remove or open the link.
 *
 * @param dialog - The dialog instance
 * @param editorView - The editor view instance
 * @param currentLink - The existing link attributes if editing, or null if creating new
 */
function createLinkDialogForm(dialog: EditDialog,
                              editorView: PmEditorView,
                              currentLink: CurrentLink | null): void {
    const href = currentLink?.href ?? '';
    const isTargetBlank = currentLink?.target === '_blank';
    const targetChecked = isTargetBlank ? 'checked' : '';

    dialog.add(`<form id="${DIALOG_IDS.FORM}">`);

    // Link input row
    dialog.addRow(`
        <label for="${DIALOG_IDS.LINK_INPUT}" class="hidden">Paste or type link url here:</label>
        <input 
            id="${DIALOG_IDS.LINK_INPUT}" 
            type="text" 
            name="pm-link" 
            value="${escapeHtml(href)}" 
            placeholder="Paste or type link url here." 
            style="width: 300px;" 
        />
        <button id="${DIALOG_IDS.INSERT_BUTTON}" title="Insert Link" class="pm-menu-btn">OK</button>
    `);

    // Checkbox for target '_blank' and additional buttons for existing links
    if (!currentLink) {
        // New link: only show checkbox
        dialog.addRow(`
            <label for="${DIALOG_IDS.NEW_WINDOW_CHECKBOX}">
                Open in new window
                <input 
                    id="${DIALOG_IDS.NEW_WINDOW_CHECKBOX}" 
                    type="checkbox" 
                    ${targetChecked} 
                    title="Set open Link in new window"
                />
            </label>
        `);
    } else {
        // Existing link: show checkbox, remove, and open buttons
        dialog.addRow(`
            <label for="${DIALOG_IDS.NEW_WINDOW_CHECKBOX}">
                Open in new window
                <input 
                    id="${DIALOG_IDS.NEW_WINDOW_CHECKBOX}" 
                    type="checkbox" 
                    ${targetChecked} 
                    title="Set open Link in new window" 
                    class="spacer"
                />
            </label>
            <button 
                id="${DIALOG_IDS.REMOVE_BUTTON}" 
                title="Remove Link" 
                class="pm-menu-btn btn-spacer"
            >Remove</button>
            <button 
                id="${DIALOG_IDS.OPEN_BUTTON}" 
                title="Open Link" 
                class="pm-menu-btn"
            >Open</button>
        `);
    }

    dialog.add('</form>');

    dialog.open(editorView, 500, 200);

    // Focus the input field after opening
    const linkInput = document.getElementById(DIALOG_IDS.LINK_INPUT);
    linkInput?.focus();
}


/* -------------------- Link dialog event listener -------------------- */

/**
 * Attaches the form submission handler to the link dialog.
 *
 * This function handles the form submission when the user inserts or updates a link.
 * It checks if the link URL or target attribute has changed, and if so, creates
 * a transaction to update the link mark in the editor.
 *
 * @param dialog - The dialog instance
 * @param currentLink - The existing link attributes if editing, or null if creating new
 * @param linkMarkType - The mark type for links
 * @param state - The current editor state
 * @param dispatch - The dispatch function to apply transactions
 * @param editorView - The editor view instance
 */
function attachFormSubmitHandler(dialog: EditDialog,
                                 currentLink: CurrentLink | null,
                                 linkMarkType: MarkType,
                                 state: PmEditorState,
                                 dispatch: DispatchFunction,
                                 editorView: PmEditorView): void {
    dialog.addListener(DIALOG_IDS.FORM, 'submit', (event: Event): void => {
        event.preventDefault();

        const linkInput = document.getElementById(DIALOG_IDS.LINK_INPUT) as HTMLInputElement;
        const newWindowCheckbox = document.getElementById(DIALOG_IDS.NEW_WINDOW_CHECKBOX) as HTMLInputElement;

        if (!linkInput) {
            return;
        }

        const newHref = linkInput.value;
        const newTarget = newWindowCheckbox?.checked ? '_blank' : null;

        // Only proceed if the link has changed
        if (!hasLinkChanged(currentLink, newHref, newTarget)) {
            dialog.close(editorView);
            return;
        }

        const linkAttrs = createLinkAttributes(state, newHref, newTarget);
        insertOrUpdateLink(state, dispatch, linkMarkType, linkAttrs, currentLink);

        dialog.close(editorView);
    });
}

/**
 * Checks if the link URL or target attribute has changed.
 *
 * @param currentLink - The existing link attributes or null
 * @param newHref - The new href value
 * @param newTarget - The new target value
 * @returns True if the link has changed, false otherwise
 */
function hasLinkChanged(currentLink: CurrentLink | null,
                        newHref: string,
                        newTarget: string | null
): boolean {
    if (!currentLink) {
        return true; // New link
    }

    const hrefChanged = currentLink.href !== newHref;
    const targetChanged = (currentLink.target || null) !== newTarget;

    return hrefChanged || targetChanged;
}

/**
 * Creates the attributes object for a link mark.
 *
 * @param state - The current editor state
 * @param href - The link URL
 * @param target - The target attribute value
 * @returns The attributes object for the link mark
 */
function createLinkAttributes(state: PmEditorState,
                              href: string,
                              target: string | null): Attrs {
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to, ' ');

    return {
        href,
        title: selectedText,
        target,
    };
}

/**
 * Attaches the click handler for the "Open Link" button.
 *
 * Opens the link URL in a new browser window/tab when clicked.
 *
 * @param dialog - The dialog instance
 * @param currentLink - The current link attributes containing the href to open
 */
function attachOpenLinkHandler(dialog: EditDialog, currentLink: CurrentLink): void {
    dialog.addListener(DIALOG_IDS.OPEN_BUTTON, 'click', (event: Event): void => {
        event.preventDefault();
        window.open(currentLink.href, '_blank');
    });
}

/**
 * Attaches the click handler for the "Remove Link" button.
 *
 * Removes the link mark from the current selection by toggling the mark off.
 * Closes the dialog after removing the link.
 *
 * @param dialog - The dialog instance
 * @param linkMarkType - The mark type for links
 * @param state - The current editor state
 * @param dispatch - The dispatch function to apply transactions
 * @param editorView - The editor view instance
 */
function attachRemoveLinkHandler(dialog: EditDialog,
                                 linkMarkType: MarkType,
                                 state: PmEditorState,
                                 dispatch: DispatchFunction,
                                 editorView: PmEditorView): void {
    dialog.addListener(DIALOG_IDS.REMOVE_BUTTON, 'click', (event: Event): void => {
        event.preventDefault();
        toggleMark(linkMarkType)(state, dispatch);
        dialog.close(editorView);
    });
}


/* -------------------- Identify existing link -------------------- */

/**
 * Retrieves the link mark attributes from the current selection or cursor position.
 *
 * This function searches for an active link mark either at the cursor position
 * (for empty selections) or within the selected range. It returns the link's
 * attributes if found.
 *
 * @param state - The current editor state
 * @param linkMarkType - The mark type to search for
 * @returns The link attributes if found, or null if no link is active
 */
function retrieveSelectedLink(state: PmEditorState,
                              linkMarkType: MarkType): CurrentLink | null {
    const linkMark: Mark = findLinkMark(state, linkMarkType);

    if (!linkMark?.attrs?.href) {
        return null;
    }

    return {
        href: String(linkMark.attrs.href),
        target: linkMark.attrs.target ? String(linkMark.attrs.target) : undefined,
        title: linkMark.attrs.title ? String(linkMark.attrs.title) : undefined,
        id: linkMark.attrs.id ? String(linkMark.attrs.id) : undefined,
    };
}

/**
 * Finds the link mark in the current selection or at the cursor position.
 *
 * @param state - The current editor state
 * @param linkMarkType - The mark type to search for
 * @returns The link mark if found, or undefined
 */
function findLinkMark(state: PmEditorState, linkMarkType: MarkType): Mark | undefined {
    const { $from, $to, empty } = state.selection;

    if (empty) {
        // For empty selections, check stored marks or marks at cursor position
        return linkMarkType.isInSet(state.storedMarks || $from.marks());
    }

    // For range selections, check if the range has the mark
    // Use the document's rangeHasMark to check, then find the actual mark
    if (state.doc.rangeHasMark($from.pos, $to.pos, linkMarkType)) {
        // Find the actual mark by checking nodes in the range
        let foundMark: Mark | undefined;
        state.doc.nodesBetween($from.pos, $to.pos, (node) => {
            if (!foundMark && node.isInline) {
                foundMark = linkMarkType.isInSet(node.marks);
            }
            return !foundMark;
        });
        return foundMark;
    }

    return undefined;
}

/**
 * Escapes HTML special characters in a string to prevent XSS attacks.
 *
 * @param text - The text to escape
 * @returns The escaped text safe for HTML insertion
 */
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
