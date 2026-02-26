import type { PmEditorState, PmEditorView } from '@type-editor/editor-types';

import type { ParentMenuElement } from './ParentMenuElement';

/**
 * The types defined in this module aren't the only thing you can
 * display in your menu. Anything that conforms to this interface can
 * be put into a menu structure.
 */
export interface MenuElement {

    /**
     * Render the element for display in the menu. Must return a DOM
     * element and a function that can be used to update the element to
     * a new state. The `update` function must return false if the
     * update hid the entire element.
     *
     * @param view - The editor view instance
     * @param showLabel - Whether to show the label (if applicable, e.g. in DropdownMenu)
     * @param isLegacy - Backward compatibility mode
     * @param parentMenuElement - The parent menu element to notify of updates of child elements (especially in dropdown menus)
     * @returns An object containing the DOM element and an update function
     */
    render(view: PmEditorView, showLabel?: boolean, isLegacy?: boolean, parentMenuElement?: ParentMenuElement): { dom: HTMLElement, update: (state: PmEditorState) => boolean; };
}
