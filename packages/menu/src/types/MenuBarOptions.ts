import type {MenuElement} from './MenuElement';

/**
 * Configuration options for the menu bar plugin.
 */
export interface MenuBarOptions {

    /**
     * Provides the content of the menu, as a nested array to be
     * passed to `renderGrouped`.
     */
    content: ReadonlyArray<ReadonlyArray<MenuElement>>;

    /**
     * Determines whether the menu floats, i.e. whether it sticks to
     * the top of the viewport when the editor is partially scrolled
     * out of view.
     *
     * @default false
     */
    floating?: boolean;

    /**
     * Determines whether to show labels for menu items (if applicable, e.g. in DropdownMenu).
     */
    showLabel?: boolean;

    /**
     * Backward compatibility flag to enable legacy menu rendering.
     */
    isLegacy?: boolean;
}
