import { ELEMENT_NODE, isUndefinedOrNull } from '@type-editor/commons';
import type { DecorationAttrs, NodeType } from '@type-editor/decoration';
import type { DecorationSource, PmDecoration, PmNodeViewDesc } from '@type-editor/editor-types';
import { Fragment, type PmNode, type TagParseRule } from '@type-editor/model';

import { OuterDecoLevel } from './OuterDecoLevel';
import { sameOuterDeco } from './util/same-outer-deco';
import { ViewDesc } from './ViewDesc';
import { ViewDescType } from './ViewDescType';
import { ViewDirtyState } from './ViewDirtyState';


/**
 * Node view descs are the main, most common type of view desc, and
 * correspond to an actual node in the document. Unlike mark descs,
 * they populate their child array themselves.
 */
export class NodeViewDesc extends ViewDesc implements PmNodeViewDesc {

    protected readonly _nodeDOM: Node;
    protected _outerDeco: ReadonlyArray<PmDecoration> | null = null;
    protected _innerDeco: DecorationSource | null = null;

    /**
     * Creates a new NodeViewDesc.
     *
     * @param parent - The parent view description
     * @param node - The ProseMirror node this represents
     * @param outerDeco - Decorations wrapping this node
     * @param innerDeco - Decorations inside this node
     * @param dom - The outer DOM node
     * @param contentDOM - The DOM node that holds content
     * @param nodeDOM - The DOM node representing the actual node
     */
    constructor(parent: ViewDesc | undefined,
                node: PmNode,
                outerDeco: ReadonlyArray<PmDecoration>,
                innerDeco: DecorationSource,
                dom: Node,
                contentDOM: HTMLElement | null,
                nodeDOM: Node) {
        super(parent, [], dom, contentDOM);
        this._node = node;
        this._outerDeco = outerDeco;
        this._innerDeco = innerDeco;
        this._nodeDOM = nodeDOM;
    }

    /**
     * The decorations that wrap this node from the outside.
     * These might add attributes, classes, or wrapper elements around the node.
     */
    get outerDeco(): ReadonlyArray<PmDecoration> | null {
        return this._outerDeco;
    }

    /**
     * The decoration source for decorations inside this node.
     * Provides access to decorations that should be applied to child content.
     */
    get innerDeco(): DecorationSource | null {
        return this._innerDeco;
    }

    /**
     * The DOM node that directly represents this ProseMirror node.
     * May differ from `dom` if outer decorations wrap it.
     */
    get nodeDOM(): Node {
        return this._nodeDOM;
    }

    get size(): number {
        return this.node.nodeSize;
    }

    get border(): number {
        return this.node.isLeaf ? 0 : 1;
    }

    get domAtom(): boolean {
        return this.node.isAtom;
    }

    /**
     * Apply outer decorations to a DOM node.
     *
     * @param dom - The DOM node to decorate
     * @param deco - Array of decorations to apply
     * @param node - The ProseMirror node
     * @returns The decorated DOM node
     */
    public static applyOuterDeco(dom: Node, deco: ReadonlyArray<PmDecoration>, node: PmNode): Node {
        return NodeViewDesc.patchOuterDeco(dom, dom, null, NodeViewDesc.computeOuterDeco(deco, node, dom.nodeType !== ELEMENT_NODE));
    }

    /**
     * Computes outer decoration levels from an array of decorations.
     *
     * Creates a hierarchy of decoration wrappers, where each level can have:
     * - A nodeName (creating a new wrapper element)
     * - Classes, styles, and other attributes
     *
     * The algorithm builds layers from innermost to outermost, combining
     * attributes on the same layer when possible, and creating new layers
     * when nodeName changes or when wrapping is needed.
     *
     * @param outerDeco - The array of outer decorations
     * @param node - The node being decorated
     * @param needsWrap - Whether the node needs a wrapper element (e.g., text nodes)
     * @returns Array of decoration levels or null if none
     */
    private static computeOuterDeco(outerDeco: ReadonlyArray<PmDecoration>,
                                    node: PmNode,
                                    needsWrap: boolean): Array<OuterDecoLevel> | null {
        if (outerDeco.length === 0) {
            return [new OuterDecoLevel()];
        }

        const result: Array<OuterDecoLevel> = [new OuterDecoLevel()];

        for (const decoration of outerDeco) {
            const attrs: DecorationAttrs = (decoration.type as NodeType).attrs;
            if (!attrs) {
                continue;
            }

            this.processDecorationAttributes(attrs, node, needsWrap, result);
        }

        return result;
    }

    /**
     * Processes all attributes from a decoration and applies them to decoration levels.
     *
     * @param attrs - The decoration attributes
     * @param node - The node being decorated
     * @param needsWrap - Whether the node needs wrapping
     * @param result - The result array of decoration levels
     */
    private static processDecorationAttributes(attrs: DecorationAttrs,
                                               node: PmNode,
                                               needsWrap: boolean,
                                               result: Array<OuterDecoLevel>): void {
        // nodeName creates a new wrapper layer
        if (attrs.nodeName) {
            result.push(new OuterDecoLevel(attrs.nodeName));
        }

        // Process each attribute
        for (const [name, value] of Object.entries(attrs)) {
            if (isUndefinedOrNull(value)) {
                continue;
            }

            this.applyAttribute(name, value, node, needsWrap, result);
        }
    }

    /**
     * Applies a single attribute to the appropriate decoration level.
     *
     * @param name - The attribute name
     * @param value - The attribute value
     * @param node - The node being decorated
     * @param needsWrap - Whether the node needs wrapping
     * @param result - The result array of decoration levels
     */
    private static applyAttribute(name: string,
                                  value: string,
                                  node: PmNode,
                                  needsWrap: boolean,
                                  result: Array<OuterDecoLevel>): void {
        // Ensure we have a wrapper level for attributes if needed
        if (needsWrap && result.length === 1) {
            const wrapperTag = node.isInline ? 'span' : 'div';
            result.push(new OuterDecoLevel(wrapperTag));
        }

        const currentLevel: OuterDecoLevel = result[result.length - 1];

        switch (name) {
            case 'class':
                currentLevel.class = this.appendValue(currentLevel.class, value, ' ');
                break;
            case 'style':
                currentLevel.style = this.appendValue(currentLevel.style, value, ';');
                break;
            case 'nodeName':
                // Already handled above
                break;
            default:
                currentLevel.setAttribute(name, value);
        }
    }

    /**
     * Appends a value to an existing string with a separator.
     *
     * @param existing - The existing value (may be undefined)
     * @param newValue - The new value to append
     * @param separator - The separator to use
     * @returns The combined value
     */
    private static appendValue(existing: string | undefined, newValue: string, separator: string): string {
        return existing ? `${existing}${separator}${newValue}` : newValue;
    }

    /**
     * Patch outer decoration layers on a DOM node.
     *
     * @param outerDOM - The current outer DOM node
     * @param nodeDOM - The inner node DOM
     * @param prevComputed - Previously computed decoration levels
     * @param curComputed - Currently computed decoration levels
     * @returns The updated outer DOM node
     */
    private static patchOuterDeco(outerDOM: Node,
                                  nodeDOM: Node,
                                  prevComputed?: ReadonlyArray<OuterDecoLevel>,
                                  curComputed?: ReadonlyArray<OuterDecoLevel>): Node {
        // Shortcut for trivial case
        if ((isUndefinedOrNull(prevComputed) && isUndefinedOrNull(curComputed)) || isUndefinedOrNull(curComputed)) {
            return nodeDOM;
        }

        let curDOM: Node = nodeDOM;
        for (let i = 0; i < curComputed.length; i++) {
            const deco: OuterDecoLevel = curComputed[i];
            const prev: OuterDecoLevel | null = prevComputed ? prevComputed[i] : null;
            if (i) {
                let parent: Node | null;

                if (prev?.nodeName === deco.nodeName
                    && curDOM !== outerDOM
                    && (parent = curDOM.parentNode)
                    && parent.nodeName.toLowerCase() === deco.nodeName) {
                    curDOM = parent;
                } else {
                    parent = document.createElement(deco.nodeName);
                    parent.pmIsDeco = true;
                    parent.appendChild(curDOM);
                    curDOM = parent;
                }
            }
            NodeViewDesc.patchAttributes(curDOM as HTMLElement, prev, deco);
        }
        return curDOM;
    }

    /**
     * Patches attributes on a DOM element based on decoration levels.
     *
     * Efficiently updates only the attributes that have changed between
     * the previous and current decoration levels.
     *
     * @param dom - The DOM element to patch
     * @param previousDecoLevel - The previous decoration level
     * @param currentDecoLevel - The current decoration level
     */
    private static patchAttributes(dom: HTMLElement,
                                   previousDecoLevel: OuterDecoLevel,
                                   currentDecoLevel: OuterDecoLevel): void {
        this.patchCustomAttributes(dom, previousDecoLevel, currentDecoLevel);
        this.patchClasses(dom, previousDecoLevel, currentDecoLevel);
        this.patchStyles(dom, previousDecoLevel, currentDecoLevel);
    }

    /**
     * Patches custom HTML attributes (excluding class, style, nodeName).
     *
     * @param dom - The DOM element
     * @param prev - Previous decoration level
     * @param cur - Current decoration level
     */
    private static patchCustomAttributes(dom: HTMLElement,
                                         prev: OuterDecoLevel,
                                         cur: OuterDecoLevel): void {
        const SPECIAL_ATTRS = new Set(['class', 'style', 'nodeName']);

        // Remove attributes that are no longer present
        prev?.attributes.forEach((_value: string, name: string): void => {
            if (!SPECIAL_ATTRS.has(name) && !cur?.attributes.has(name)) {
                dom.removeAttribute(name);
            }
        });

        // Add or update attributes
        cur?.attributes.forEach((value: string, name: string): void => {
            if (!SPECIAL_ATTRS.has(name) && value !== prev?.attributes.get(name)) {
                dom.setAttribute(name, value);
            }
        });
    }

    /**
     * Patches CSS classes on a DOM element.
     *
     * @param dom - The DOM element
     * @param prev - Previous decoration level
     * @param cur - Current decoration level
     */
    private static patchClasses(dom: HTMLElement,
                                prev: OuterDecoLevel,
                                cur: OuterDecoLevel): void {
        if (prev?.class === cur?.class) {
            return;
        }

        const prevClasses: Set<string> = this.parseClassList(prev?.class);
        const curClasses: Set<string> = this.parseClassList(cur?.class);

        // Remove old classes
        for (const className of prevClasses) {
            if (!curClasses.has(className)) {
                dom.classList.remove(className);
            }
        }

        // Add new classes
        for (const className of curClasses) {
            if (!prevClasses.has(className)) {
                dom.classList.add(className);
            }
        }

        // Clean up empty class attribute
        if (dom.classList.length === 0) {
            dom.removeAttribute('class');
        }
    }

    /**
     * Parses a space-separated class string into a Set.
     *
     * @param classString - The class string to parse
     * @returns Set of class names
     */
    private static parseClassList(classString: string | undefined): Set<string> {
        if (!classString) {
            return new Set();
        }
        return new Set(classString.split(' ').filter(Boolean));
    }

    /**
     * Patches inline styles on a DOM element.
     *
     * @param dom - The DOM element
     * @param prev - Previous decoration level
     * @param cur - Current decoration level
     */
    private static patchStyles(dom: HTMLElement,
                               prev: OuterDecoLevel,
                               cur: OuterDecoLevel): void {
        if (prev?.style === cur?.style) {
            return;
        }

        if (prev?.style) {
            this.removeStyleProperties(dom, prev.style);
        }

        if (cur?.style) {
            dom.style.cssText += cur.style;
        }
    }

    /**
     * Removes CSS properties from a DOM element based on a style string.
     *
     * Matches CSS properties like:
     * - color: red
     * - font-family: 'Arial'
     * - background: url(image.png)
     * - transform: translate(10px, 20px)
     *
     * @param dom - The DOM element
     * @param styleString - The style string containing properties to remove
     */
    private static removeStyleProperties(dom: HTMLElement, styleString: string): void {
        const CSS_PROPERTY_PATTERN = /\s*([\w\-\xa1-\uffff]+)\s*:(?:'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g;
        let match: RegExpExecArray | null;

        while ((match = CSS_PROPERTY_PATTERN.exec(styleString)) !== null) {
            const propertyName: string = match[1];
            dom.style.removeProperty(propertyName);
        }
    }

    getType(): ViewDescType {
        return ViewDescType.NODE;
    }

    parseRule(): Omit<TagParseRule, 'tag'> {
        // Experimental kludge to allow opt-in re-parsing of nodes
        if (this.node.type.spec.reparseInView) {
            return null;
        }

        // FIXME the assumption that this can always return the current
        // attrs means that if the user somehow manages to change the
        // attrs in the dom, that won't be picked up. Not entirely sure
        // whether this is a problem
        const rule: Omit<TagParseRule, 'tag'> = {node: this.node.type.name, attrs: this.node.attrs};
        if (this.node.type.whitespace === 'pre') {
            rule.preserveWhitespace = 'full';
        }

        if (!this._contentDOM) {
            rule.getContent = (): Fragment => this.node.content;
        } else if (!this.contentLost) {
            rule.contentElement = this._contentDOM;
        } else {
            // Chrome likes to randomly recreate parent nodes when
            // backspacing things. When that happens, this tries to find the
            // new parent.
            for (let i = this._children.length - 1; i >= 0; i--) {
                const child: ViewDesc = this._children[i];
                if (this._dom.contains(child.dom.parentNode)) {
                    rule.contentElement = child.dom.parentNode as HTMLElement;
                    break;
                }
            }

            if (!rule.contentElement) {
                rule.getContent = (): Fragment => Fragment.empty;
            }
        }
        return rule;
    }

    matchesNode(node: PmNode,
                outerDeco: ReadonlyArray<PmDecoration>,
                innerDeco: DecorationSource): boolean {
        return this._dirty === ViewDirtyState.NOT_DIRTY
            && node.eq(this.node)
            && sameOuterDeco(outerDeco, this._outerDeco)
            && innerDeco.eq(this._innerDeco);
    }

    /**
     * Updates the internal state of this node view with new node and decorations.
     *
     * @param node - The new node
     * @param outerDeco - New outer decorations
     * @param innerDeco - New inner decorations
     */
    public updateInner(node: PmNode,
                       outerDeco: ReadonlyArray<PmDecoration>,
                       innerDeco: DecorationSource): void {
        this.updateOuterDeco(outerDeco);
        this._node = node;
        this._innerDeco = innerDeco;
    }

    /**
     * Updates the outer decorations on this node, patching the DOM as needed.
     *
     * @param outerDeco - The new array of outer decorations
     */
    public updateOuterDeco(outerDeco: ReadonlyArray<PmDecoration>): void {
        if (sameOuterDeco(outerDeco, this._outerDeco)) {
            return;
        }

        const needsWrap: boolean = this._nodeDOM.nodeType !== ELEMENT_NODE;
        const oldDOM: Node = this._dom;

        this._dom = NodeViewDesc.patchOuterDeco(
            this._dom,
            this._nodeDOM,
            NodeViewDesc.computeOuterDeco(this._outerDeco, this.node, needsWrap),
            NodeViewDesc.computeOuterDeco(outerDeco, this.node, needsWrap));

        if (this._dom !== oldDOM) {
            oldDOM.pmViewDesc = undefined;
            this._dom.pmViewDesc = this;
        }
        this._outerDeco = outerDeco;
    }

    /**
     * Mark this node as being the selected node.
     */
    public selectNode(): void {
        if (this._nodeDOM.nodeType === ELEMENT_NODE) {
            (this._nodeDOM as HTMLElement).classList.add('ProseMirror-selectednode');
            if (this._contentDOM || !this.node.type.spec.draggable) {
                (this._nodeDOM as HTMLElement).draggable = true;
            }
        }
    }

    /**
     * Remove selected node marking from this node.
     */
    public deselectNode(): void {
        if (this._nodeDOM.nodeType === ELEMENT_NODE) {
            (this._nodeDOM as HTMLElement).classList.remove('ProseMirror-selectednode');
            if (this._contentDOM || !this.node.type.spec.draggable) {
                (this._nodeDOM as HTMLElement).removeAttribute('draggable');
            }
        }
    }

}
