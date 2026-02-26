import type {
    DecorationSource,
    MarkViewConstructor,
    NodeView,
    NodeViewConstructor,
    PmDecoration,
    PmEditorView
} from '@type-editor/editor-types';
import {DOMSerializer, type Mark, type PmNode} from '@type-editor/model';

import {CompositionViewDesc} from './CompositionViewDesc';
import {CustomNodeViewDesc} from './CustomNodeViewDesc';
import {MarkViewDesc} from './MarkViewDesc';
import {NodeViewDesc} from './NodeViewDesc';
import {TextViewDesc} from './TextViewDesc';
import {TrailingHackViewDesc} from './TrailingHackViewDesc';
import type {ViewDesc} from './ViewDesc';
import {WidgetViewDesc} from './WidgetViewDesc';


export class ViewDescFactory {

    /**
     * Creates a node view description with optional custom view support.
     *
     * By default, nodes are rendered using the `toDOM` method from their type spec.
     * Custom node views can be provided via the `nodeViews` option to override
     * rendering and behavior.
     *
     * The factory handles three scenarios:
     * 1. Custom node view (returns CustomNodeViewDesc)
     * 2. Text node (returns TextViewDesc)
     * 3. Standard node (returns NodeViewDesc)
     *
     * @param parent - The parent view description
     * @param node - The ProseMirror node to create a view for
     * @param outerDeco - Decorations wrapping this node
     * @param innerDeco - Decorations inside this node
     * @param view - The editor view
     * @param pos - The document position of the node
     * @returns A NodeViewDesc or specialized subclass
     */
    public static createNodeViewDesc(parent: ViewDesc | undefined,
                                     node: PmNode,
                                     outerDeco: ReadonlyArray<PmDecoration>,
                                     innerDeco: DecorationSource,
                                     view: PmEditorView,
                                     pos: number): NodeViewDesc {
        // Container to hold reference to created description (for getPos callback)
        const descContainer: { desc?: ViewDesc } = {};

        const spec = this.getCustomNodeViewSpec(node, view, pos, outerDeco, innerDeco, descContainer);
        const {dom, contentDOM, nodeDOM} = this.createNodeDOM(node, spec, outerDeco);

        const result = this.instantiateNodeViewDesc(
            parent,
            node,
            outerDeco,
            innerDeco,
            dom,
            contentDOM,
            nodeDOM,
            spec
        );

        // Update container with created description
        descContainer.desc = result;

        return result;
    }

    /**
     * Creates a mark view description, using custom mark views if available.
     *
     * @param parent - The parent view description
     * @param mark - The mark to create a view for
     * @param inline - Whether the mark is in inline content
     * @param view - The editor view
     * @returns A new MarkViewDesc instance
     */
    public static createMarkViewDesc(parent: ViewDesc,
                                     mark: Mark,
                                     inline: boolean,
                                     view: PmEditorView): MarkViewDesc {
        const custom: MarkViewConstructor = view.nodeViews[mark.type.name] as MarkViewConstructor;

        let spec: { dom: HTMLElement, contentDOM?: HTMLElement; } | undefined;

        if (custom && typeof custom === 'function') {
            spec = custom(mark, view, inline) as { dom: HTMLElement, contentDOM?: HTMLElement; };
        }

    if (!spec?.dom) {
        spec = DOMSerializer.renderSpec(document, mark.type.spec.toDOM(mark, inline), null) as {
            dom: HTMLElement,
            contentDOM?: HTMLElement;
        };
    }

        return new MarkViewDesc(parent, mark, spec.dom, spec.contentDOM || spec.dom, spec);
    }

    /**
     * Creates a new TrailingHackViewDesc.
     *
     * @param parent - The parent ViewDesc in the tree hierarchy
     * @param children - Array of child ViewDesc instances
     * @param dom - The DOM node this description wraps
     * @param contentDOM - The DOM node that holds the child views. May be null for descs that don't have children.
     */
    public static createTrailingHackViewDesc(parent: ViewDesc | undefined,
                                             children: Array<ViewDesc>,
                                             dom: Node,
                                             contentDOM: HTMLElement | null): TrailingHackViewDesc {
        return new TrailingHackViewDesc(parent, children, dom, contentDOM);

    }

    /**
     * Creates a new WidgetViewDesc.
     *
     * @param parent - The parent view description in the tree hierarchy
     * @param widget - The widget decoration to render
     * @param view - The editor view that owns this widget
     * @param pos - The document position where this widget appears
     */
    public static createWidgetViewDesc(parent: ViewDesc,
                                       widget: PmDecoration,
                                       view: PmEditorView,
                                       pos: number): WidgetViewDesc {
        return new WidgetViewDesc(parent, widget, view, pos);
    }

    /**
     * Creates a new CompositionViewDesc.
     *
     * @param parent - The parent view description in the tree hierarchy
     * @param dom - The outer DOM node containing the composition
     * @param textDOM - The text node containing the composed (uncommitted) text
     * @param text - The current composed text content
     */
    public static createCompositionViewDesc(parent: ViewDesc,
                                            dom: Node,
                                            textDOM: Text,
                                            text: string): CompositionViewDesc {
        return new CompositionViewDesc(parent, dom, textDOM, text);
    }

    /**
     * Gets custom node view spec if available.
     *
     * @param node - The node
     * @param view - The editor view
     * @param pos - Document position
     * @param outerDeco - Outer decorations
     * @param innerDeco - Inner decorations
     * @param descContainer - Container for description object reference (for getPos callback)
     * @returns Custom node view spec or undefined
     */
    private static getCustomNodeViewSpec(node: PmNode,
                                         view: PmEditorView,
                                         pos: number,
                                         outerDeco: ReadonlyArray<PmDecoration>,
                                         innerDeco: DecorationSource,
                                         descContainer: { desc?: ViewDesc }): NodeView | undefined {
        const custom = view.nodeViews[node.type.name] as NodeViewConstructor;
        if (!custom) {
            return undefined;
        }

        const getPos = (): number => {
            if (!descContainer.desc) {
                return pos;
            }
            return descContainer.desc.parent?.posBeforeChild(descContainer.desc) ?? pos;
        };

        return custom(node, view, getPos, outerDeco, innerDeco);
    }

    /**
     * Creates DOM nodes for a ProseMirror node.
     *
     * @param node - The ProseMirror node
     * @param spec - Custom node view spec (if any)
     * @param outerDeco - Outer decorations
     * @returns Object with dom, contentDOM, and nodeDOM
     */
    private static createNodeDOM(node: PmNode,
                                 spec: NodeView | undefined,
                                 outerDeco: ReadonlyArray<PmDecoration>): {
        dom: Node,
        contentDOM: HTMLElement | null,
        nodeDOM: Node
    } {
        let dom: Node;
        let contentDOM: HTMLElement | null = null;

        if (spec?.dom) {
            dom = spec.dom;
            contentDOM = spec.contentDOM ?? null;
        } else if (node.isText) {
            dom = this.createTextDOM(node);
        } else {
            ({dom, contentDOM} = this.createElementDOM(node));
        }

        this.applyNodeAttributes(dom, node, contentDOM);

        const nodeDOM: Node = dom;
        dom = NodeViewDesc.applyOuterDeco(dom, outerDeco, node);

        return {dom, contentDOM, nodeDOM};
    }

    /**
     * Creates a text DOM node.
     *
     * @param node - The text node
     * @returns Text DOM node
     * @throws RangeError if custom DOM is not a text node
     */
    private static createTextDOM(node: PmNode): Text {
        return document.createTextNode(node.text);
    }

    /**
     * Creates an element DOM node from the node's toDOM spec.
     *
     * @param node - The node
     * @returns Object with dom and optional contentDOM
     */
    private static createElementDOM(node: PmNode): { dom: Node, contentDOM?: HTMLElement } {
        const rendered = DOMSerializer.renderSpec(
            document,
            node.type.spec.toDOM(node),
            null
        );
        return rendered as { dom: Node, contentDOM?: HTMLElement };
    }

    /**
     * Applies standard attributes to a node's DOM (contenteditable, draggable).
     *
     * @param dom - The DOM node
     * @param node - The ProseMirror node
     * @param contentDOM - The content DOM (if any)
     */
    private static applyNodeAttributes(dom: Node,
                                       node: PmNode,
                                       contentDOM: HTMLElement | null): void {
        if (contentDOM || node.isText || dom.nodeName === 'BR') {
            return;
        }

        const element = dom as HTMLElement;

        // Chrome gets confused by <br contenteditable=false>
        if (!element.hasAttribute('contenteditable')) {
            element.contentEditable = 'false';
        }

        if (node.type.spec.draggable) {
            element.draggable = true;
        }
    }

    /**
     * Instantiates the appropriate NodeViewDesc subclass.
     *
     * @param parent - Parent view desc
     * @param node - The node
     * @param outerDeco - Outer decorations
     * @param innerDeco - Inner decorations
     * @param dom - DOM node
     * @param contentDOM - Content DOM
     * @param nodeDOM - Node DOM
     * @param spec - Custom spec
     * @returns NodeViewDesc instance
     */
    private static instantiateNodeViewDesc(parent: ViewDesc | undefined,
                                           node: PmNode,
                                           outerDeco: ReadonlyArray<PmDecoration>,
                                           innerDeco: DecorationSource,
                                           dom: Node,
                                           contentDOM: HTMLElement | null,
                                           nodeDOM: Node,
                                           spec: NodeView | undefined): NodeViewDesc {
        if (spec) {
            return new CustomNodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, spec);
        }

        if (node.isText) {
            return new TextViewDesc(parent, node, outerDeco, innerDeco, dom, nodeDOM);
        }

        return new NodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM);
    }
}
