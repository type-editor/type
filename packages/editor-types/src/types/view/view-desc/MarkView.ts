import type {ViewMutationRecord} from './ViewMutationRecord';

/**
 * By default, document marks are rendered using the result of the
 * [`toDOM`](#model.MarkSpec.toDOM) method of their spec, and managed entirely
 * by the editor. For some use cases, you want more control over the behavior
 * of a mark's in-editor representation, and need to
 * [define](#view.EditorProps.markViews) a custom mark view.
 *
 * Objects returned as mark views must conform to this interface.
 */
export interface MarkView {
    /**
     * The outer DOM node that represents the document node.
     */
    dom: Node;

    /**
     * The DOM node that should hold the mark's content. When this is not
     * present, the `dom` property is used as the content DOM.
     */
    contentDOM?: HTMLElement | null;

    /**
     * Called when a [mutation](#view.ViewMutationRecord) happens within the
     * view. Return false if the editor should re-read the selection or re-parse
     * the range around the mutation, true if it can safely be ignored.
     */
    ignoreMutation?: (mutation: ViewMutationRecord) => boolean;


    /**
     * Called when the mark view is removed from the editor or the whole
     * editor is destroyed.
     */
    destroy?: () => void;
}
