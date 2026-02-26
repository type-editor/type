
/**
 * Abstract base class for view descriptions.
 * Provides minimal interface that all view descriptions must implement.
 */
export abstract class AbstractViewDesc {

    /**
     * Gets the side value which determines positioning behavior of the view.
     * - Negative values: positioned before content
     * - Zero: neutral positioning
     * - Positive values: positioned after content
     */
    abstract get side(): number;

    /**
     * The DOM node that directly represents this ProseMirror node.
     * May differ from `dom` if outer decorations wrap it.
     *
     * @returns The node DOM element, or null if this view doesn't have a direct node representation
     */
    get nodeDOM(): Node | null {
        return null;
    }
}
