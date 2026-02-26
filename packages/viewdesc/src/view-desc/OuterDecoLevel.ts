/**
 * Represents a level of outer decoration wrapping, storing HTML attributes
 * like nodeName, class, style, and other custom attributes as key-value pairs.
 *
 * Decorations can add multiple wrapper layers around nodes. Each layer can:
 * - Specify a nodeName to create a new wrapper element
 * - Add CSS classes
 * - Add inline styles
 * - Add custom HTML attributes
 *
 * For example, a node might be wrapped like:
 * `<div class="highlight"><span style="color: red">content</span></div>`
 * This would use two OuterDecoLevel instances.
 */
export class OuterDecoLevel {

    private readonly _attributes = new Map<string, string>();

    /** The HTML tag name for this decoration level (e.g., 'div', 'span') */
    private _nodeName?: string;

    /** Space-separated CSS class names */
    private _class?: string;

    /** CSS style text (e.g., 'color: red; font-weight: bold') */
    private _style?: string;

    /**
     * Creates a new OuterDecoLevel.
     *
     * @param nodeName - Optional tag name for this decoration level
     */
    constructor(nodeName?: string) {
        if (nodeName) {
            this._nodeName = nodeName;
        }
    }

    get nodeName(): string | undefined {
        return this._nodeName;
    }

    set nodeName(nodeName: string | undefined) {
        this._nodeName = nodeName;
    }

    get class(): string | undefined {
        return this._class;
    }

    set class(className: string | undefined) {
        this._class = className;
    }

    get style(): string | undefined {
        return this._style;
    }

    set style(style: string | undefined) {
        this._style = style;
    }


    /**
     * Gets the read-only map of custom attributes (excluding class, style, nodeName).
     */
    get attributes(): ReadonlyMap<string, string> {
        return this._attributes;
    }

    /**
     * Sets a custom HTML attribute on this decoration level.
     *
     * @param name - The attribute name (e.g., 'data-id', 'title')
     * @param value - The attribute value
     */
    public setAttribute(name: string, value: string): void {
        this._attributes.set(name, value);
    }

}
