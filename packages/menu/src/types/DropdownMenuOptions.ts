export interface DropdownMenuOptions {

    /**
     * The label to show on the drop-down control.
     */
    label?: string;

    /**
     * Sets the
     * [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title)
     * attribute given to the menu control.
     */
    title?: string;

    /**
     * When given, adds an extra CSS class to the menu control.
     */
    class?: string;

    /**
     * When given, adds an extra set of CSS styles to the menu control.
     */
    css?: string;

    static?: boolean;

    showLabel?: boolean;
}
