import type { DispatchFunction, PmEditorState, PmEditorView } from '@type-editor/editor-types';

import type {IconSpec} from './IconSpec';

/**
 * The configuration object passed to the `MenuItem` constructor.
 */
export interface MenuItemSpec {

    /**
     * The function to execute when the menu item is activated.
     */
    run: (state: PmEditorState, dispatch: DispatchFunction, view: PmEditorView, event: Event) => boolean;


    /**
     * Optional function that is used to determine whether the item is
     * appropriate at the moment. Deselected items will be hidden.
     */
    select?: (state: PmEditorState) => boolean;

    /**
     * Function that is used to determine if the item is enabled. If
     * given and returning false, the item will be given a disabled
     * styling.
     */
    enable?: (state: PmEditorState) => boolean;

    /**
     * A predicate function to determine whether the item is 'active' (for
     * example, the item for toggling the strong mark might be active then
     * the cursor is in strong text).
     */
    active?: (state: PmEditorState) => boolean;

    /**
     * A function that renders the item. You must provide either this,
     * [`icon`](#menu.MenuItemSpec.icon), or [`label`](#MenuItemSpec.label).
     */
    render?: (view: PmEditorView) => HTMLElement | null;

    /**
     * Describes an icon to show for this item.
     */
    icon?: IconSpec;

    /**
     * Makes the item show up as a text label. Mostly useful for items
     * wrapped in a [drop-down](#menu.Dropdown) or similar menu. The object
     * should have a `label` property providing the text to display.
     */
    label?: string;

    /**
     * Defines DOM title (mouseover) text for the item.
     */
    title?: string | ((state: PmEditorState) => string);

    /**
     * Optionally adds a CSS class to the item's DOM representation.
     */
    class?: string;

    /**
     * Optionally adds a string of inline CSS to the item's DOM
     * representation.
     */
    css?: string;
}
