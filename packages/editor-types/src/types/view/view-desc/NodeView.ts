import type {PmNode} from '@type-editor/model';

import type {DecorationSource} from '../decoration/DecorationSource';
import type {PmDecoration} from '../decoration/PmDecoration';
import type {ViewMutationRecord} from './ViewMutationRecord';

/**
 * By default, document nodes are rendered using the result of the
 * [`toDOM`](#model.NodeSpec.toDOM) method of their spec, and managed
 * entirely by the editor. For some use cases, such as embedded
 * node-specific editing interfaces, you want more control over
 * the behavior of a node's in-editor representation, and need to
 * [define](#view.EditorProps.nodeViews) a custom node view.
 *
 * Objects returned as node views must conform to this interface.
 */
export interface NodeView {

    /**
     * The outer DOM node that represents the document node.
     */
    dom: Node;

    /**
     * The DOM node that should hold the node's content. Only meaningful
     * if the node view also defines a `dom` property and if its node
     * type is not a leaf node type. When this is present, ProseMirror
     * will take care of rendering the node's children into it. When it
     * is not present, the node view itself is responsible for rendering
     * (or deciding not to render) its child nodes.
     */
    contentDOM?: HTMLElement | null;

    /**
     * When given, this will be called when the view is updating
     * itself. It will be given a node, an array of active decorations
     * around the node (which are automatically drawn, and the node
     * view may ignore if it isn't interested in them), and a
     * [decoration source](#view.DecorationSource) that represents any
     * decorations that apply to the content of the node (which again
     * may be ignored). It should return true if it was able to update
     * to that node, and false otherwise. If the node view has a
     * `contentDOM` property (or no `dom` property), updating its child
     * nodes will be handled by ProseMirror.
     */
    update?: (node: PmNode, decorations: ReadonlyArray<PmDecoration>, innerDecorations: DecorationSource) => boolean;

    /**
     * By default, `update` will only be called when a node of the same
     * node type appears in this view's position. When you set this to
     * true, it will be called for any node, making it possible to have
     * a node view that representsmultiple types of nodes. You will
     * need to check the type of the nodes you get in `update` and
     * return `false` for types you cannot handle.
     */
    multiType?: boolean;

    /**
     * Can be used to override the way the node's selected status (as a
     * node selection) is displayed.
     */
    selectNode?: () => void;

    /**
     * When defining a `selectNode` method, you should also provide a
     * `deselectNode` method to remove the effect again.
     */
    deselectNode?: () => void;

    /**
     * This will be called to handle setting the selection inside the
     * node. The `anchor` and `head` positions are relative to the start
     * of the node. By default, a DOM selection will be created between
     * the DOM positions corresponding to those positions, but if you
     * override it you can do something else.
     */
    setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void;

    /**
     * Can be used to prevent the editor view from trying to handle some
     * or all DOM events that bubble up from the node view. Events for
     * which this returns true are not handled by the editor.
     */
    stopEvent?: (event: Event) => boolean;

    /**
     * Called when a [mutation](#view.ViewMutationRecord) happens within the
     * view. Return false if the editor should re-read the selection or re-parse
     * the range around the mutation, true if it can safely be ignored.
     */
    ignoreMutation?: (mutation: ViewMutationRecord) => boolean;

    /**
     * Called when the node view is removed from the editor or the whole
     * editor is destroyed.
     */
    destroy?: () => void;
}
