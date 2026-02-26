import {isFalse, isUndefinedOrNull} from '@type-editor/commons';

import type {Fragment} from '../elements/Fragment';
import type {Mark} from '../elements/Mark';
import type {Node as PmNode} from '../elements/Node';
import type {MarkType} from '../schema/MarkType';
import type {NodeType} from '../schema/NodeType';
import type {Schema} from '../schema/Schema';
import type {DOMAttributes} from '../types/dom-parser/DOMAttributes';
import type {DOMOutputSpec} from '../types/dom-parser/DOMOutputSpec';
import type {DOMOutputSpecArray} from '../types/dom-parser/DOMOutputSpecArray';


/**
 * A DOM serializer knows how to convert ProseMirror nodes and
 * marks of various types to DOM nodes.
 */
export class DOMSerializer {

    private static readonly SUSPICIOUS_ATTRIBUTE_CACHE = new WeakMap<DOMAttributes, ReadonlyArray<ReadonlyArray<unknown>> | null>();

    private readonly nodesVar: Record<string, (node: PmNode) => DOMOutputSpec>;
    private readonly marksVar: Record<string, (mark: Mark, inline: boolean) => DOMOutputSpec>;


    /**
     * Create a serializer. `nodes` should map node names to functions
     * that take a node and return a description of the corresponding
     * DOM. `marks` does the same for mark names, but also gets an
     * argument that tells it whether the mark's content is block or
     * inline content (for typical use, it'll always be inline). A mark
     * serializer may be `null` to indicate that marks of that type
     * should not be serialized.
     *
     * @param nodes The node serialization functions.
     * @param marks The mark serialization functions.
     */
    constructor(nodes: Record<string, (node: PmNode) => DOMOutputSpec>,
                marks: Record<string, (mark: Mark, inline: boolean) => DOMOutputSpec>) {
        this.nodesVar = nodes;
        this.marksVar = marks;
    }

    get nodes(): Record<string, (node: PmNode) => DOMOutputSpec> {
        return this.nodesVar;
    }

    get marks(): Record<string, (mark: Mark, inline: boolean) => DOMOutputSpec> {
        return this.marksVar;
    }

    /**
     * Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
     * the spec has a hole (zero) in it, `contentDOM` will point at the
     * node with the hole.
     * @param doc
     * @param structure
     * @param xmlNS
     */
    public static renderSpec(doc: Document, structure: DOMOutputSpec, xmlNS?: string | null): {
        dom: Node,
        contentDOM?: HTMLElement;
    }

    public static renderSpec(doc: Document,
                             structure: DOMOutputSpec,
                             xmlNS: string | null = null,
                             blockArraysIn?: DOMAttributes): { dom: Node, contentDOM?: HTMLElement; } {
        return DOMSerializer.renderSpecInternal(doc, structure, xmlNS, blockArraysIn);
    }

    /**
     * Build a serializer using the [`toDOM`](#model.NodeSpec.toDOM)
     * properties in a schema's node and mark specs.
     *
     * @param schema
     */
    public static fromSchema(schema: Schema): DOMSerializer {
        if (isUndefinedOrNull(schema.cached.domSerializer)) {
            schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema));
        }
        return schema.cached.domSerializer as DOMSerializer;
    }

    private static renderSpecInternal(doc: Document,
                                      structure: DOMOutputSpec,
                                      xmlNS: string | null,
                                      blockArraysIn?: DOMAttributes): { dom: Node, contentDOM?: HTMLElement; } {
        // Handle string - create text node
        if (typeof structure === 'string') {
            return {dom: doc.createTextNode(structure)};
        }

        // Handle DOM node - return as-is
        if (typeof structure === 'object' && 'nodeType' in structure && !isUndefinedOrNull(structure.nodeType)) {
            return {dom: structure};
        }

        // Handle {dom, contentDOM} object
        if (typeof structure === 'object' && 'dom' in structure && structure.dom && 'nodeType' in structure.dom) {
            return structure as { dom: Node; contentDOM?: HTMLElement };
        }

        // Must be an array specification at this point
        if (!Array.isArray(structure)) {
            throw new RangeError('Invalid structure passed to renderSpec');
        }

        // Cast to DOMOutputSpecArray after validating it's an array
        const specArray = structure as DOMOutputSpecArray;

        const firstElement = specArray[0];
        if (typeof firstElement !== 'string') {
            throw new RangeError('Invalid array passed to renderSpec: first element must be a tag name string');
        }
        const tagName: string = firstElement;

        // Validate against XSS attacks
        if (blockArraysIn) {
            const suspicious = DOMSerializer.suspiciousAttributes(blockArraysIn);
            if (suspicious?.includes(specArray)) {
                throw new RangeError('Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.');
            }
        }

        // Parse namespace from tag name if present
        let actualXmlNS = xmlNS;
        let actualTagName = tagName;
        const spaceIndex = tagName.indexOf(' ');
        if (spaceIndex > 0) {
            actualXmlNS = tagName.slice(0, spaceIndex);
            actualTagName = tagName.slice(spaceIndex + 1);
        }

        // Create the DOM element
        const dom = (actualXmlNS
            ? doc.createElementNS(actualXmlNS, actualTagName)
            : doc.createElement(actualTagName)) as HTMLElement;

        let contentDOM: HTMLElement | undefined;
        let childrenStartIndex = 1;

        // Check if second element is attributes object
        if (specArray.length > 1) {
            const maybeSecondElement = specArray[1];
            if (
                maybeSecondElement &&
                typeof maybeSecondElement === 'object' &&
                !('nodeType' in maybeSecondElement) &&
                !Array.isArray(maybeSecondElement)
            ) {
                // Apply attributes
                const attrs: DOMAttributes = maybeSecondElement as DOMAttributes;
                childrenStartIndex = 2;

                for (const name in attrs) {
                    const value: string | number | boolean = attrs[name];
                    if (isUndefinedOrNull(value)) {
                        continue;
                    }

                    const attrSpaceIndex: number = name.indexOf(' ');
                    if (attrSpaceIndex > 0) {
                        // Namespaced attribute
                        const attrNS: string = name.slice(0, attrSpaceIndex);
                        const attrName: string = name.slice(attrSpaceIndex + 1);
                        dom.setAttributeNS(attrNS, attrName, String(value));
                    } else if (name === 'style' && 'style' in dom && dom.style) {
                        // Style attribute
                        if (typeof value === 'string') {
                            dom.style.cssText = value;
                        }
                    } else {
                        // Regular attribute
                        dom.setAttribute(name, String(value));
                    }
                }
            }
        }

        // Process children
        for (let i = childrenStartIndex; i < specArray.length; i++) {
            const maybeChild = specArray[i];

            if (maybeChild === 0) {
                // Found a content hole
                if (i < specArray.length - 1 || i > childrenStartIndex) {
                    throw new RangeError(
                        `Content hole (0) must be the only child of its parent node. Found at position ${i} with ${specArray.length - childrenStartIndex - 1} total children.`
                    );
                }
                return {dom, contentDOM: dom};
            }

            // Recursively render child
            const {dom: innerDom, contentDOM: innerContent} = DOMSerializer.renderSpecInternal(
                doc,
                maybeChild as DOMOutputSpec,
                actualXmlNS,
                blockArraysIn
            );

            dom.appendChild(innerDom);

            if (innerContent) {
                if (contentDOM) {
                    throw new RangeError('Multiple content holes are not allowed in a DOM spec');
                }
                contentDOM = innerContent;
            }
        }

        return {dom, contentDOM};
    }

    private static suspiciousAttributes(attrs: DOMAttributes): ReadonlyArray<ReadonlyArray<unknown>> | null {
        let value: ReadonlyArray<ReadonlyArray<unknown>> | null | undefined = DOMSerializer.SUSPICIOUS_ATTRIBUTE_CACHE.get(attrs);
        if (value === undefined) {
            value = DOMSerializer.suspiciousAttributesInner(attrs);
            DOMSerializer.SUSPICIOUS_ATTRIBUTE_CACHE.set(attrs, value);
        }
        return value;
    }

    private static suspiciousAttributesInner(attrs: DOMAttributes): ReadonlyArray<ReadonlyArray<unknown>> | null {
        const result: Array<ReadonlyArray<unknown>> = [];
        DOMSerializer.scan(attrs, result);
        return result.length > 0 ? result : null;
    }

    private static scan(value: unknown, result: Array<ReadonlyArray<unknown>>): void {
        if (typeof value !== 'object' || isUndefinedOrNull(value)) {
            return;
        }

        if (Array.isArray(value)) {
            if (typeof value[0] === 'string') {
                result.push(value);
            } else {
                for (const item of value) {
                    DOMSerializer.scan(item, result);
                }
            }
        } else {
            for (const prop in value) {
                DOMSerializer.scan((value as Record<string, unknown>)[prop], result);
            }
        }
    }

    /**
     * Gather the serializers in a schema's node specs into an object.
     * This can be useful as a base to build a custom serializer from.
     *
     * @param schema
     * @private
     */
    private static nodesFromSchema(schema: Schema): Record<string, (node: PmNode) => DOMOutputSpec> {
        const result = DOMSerializer.gatherToDOM(schema.nodes);
        if (!result.text) {
            result.text = (node: PmNode) => {
                const text = node.text;
                return text ?? '';
            };
        }
        return result as Record<string, (node: PmNode) => DOMOutputSpec>;
    }

    /**
     * Gather the serializers in a schema's mark specs into an object.
     *
     * @param schema
     * @private
     */
    private static marksFromSchema(schema: Schema): Record<string, (mark: Mark, inline: boolean) => DOMOutputSpec> {
        return DOMSerializer.gatherToDOM(schema.marks) as Record<string, (mark: Mark, inline: boolean) => DOMOutputSpec>;
    }

    private static gatherToDOM(obj: Record<string, NodeType | MarkType>): Record<string, ((node: PmNode) => DOMOutputSpec) | ((mark: Mark, inline: boolean) => DOMOutputSpec)> {
        const result: Record<string, ((node: PmNode) => DOMOutputSpec) | ((mark: Mark, inline: boolean) => DOMOutputSpec)> = {};
        for (const name in obj) {
            const toDOM = obj[name].spec.toDOM;
            if (toDOM) {
                result[name] = toDOM as ((node: PmNode) => DOMOutputSpec) | ((mark: Mark, inline: boolean) => DOMOutputSpec);
            }
        }
        return result;
    }

    /**
     * Serialize the content of this selfPos to a DOM selfPos. When
     * not in the browser, the `document` option, containing a DOM
     * document, should be passed so that the serializer can create
     * nodes.
     *
     * @param fragment
     * @param options
     * @param target
     */
    public serializeFragment(fragment: Fragment,
                             options: { document?: Document; } = {}, target?: HTMLElement | DocumentFragment): HTMLElement | DocumentFragment {
        if (!target) {
            target = this.doc(options).createDocumentFragment();
        }

        let top: HTMLElement | DocumentFragment = target;
        const active: Array<[Mark, HTMLElement | DocumentFragment]> = [];
        fragment.forEach((node: PmNode): void => {
            if (active.length || node.marks.length) {
                let keep = 0;
                let rendered = 0;

                while (keep < active.length && rendered < node.marks.length) {
                    const next: Mark = node.marks[rendered];
                    if (!this.marks[next.type.name]) {
                        rendered++;
                        continue;
                    }

                    if (!next.eq(active[keep][0]) || isFalse(next.type.spec.spanning)) {
                        break;
                    }
                    keep++;
                    rendered++;
                }

                while (keep < active.length) {
                    const popped = active.pop();
                    if (popped) {
                        top = popped[1];
                    }
                }

                while (rendered < node.marks.length) {
                    const add: Mark = node.marks[rendered++];
                    const markDOM: { dom: Node; contentDOM?: HTMLElement } = this.serializeMark(add, node.isInline, options);
                    if (markDOM) {
                        active.push([add, top]);
                        top.appendChild(markDOM.dom);
                        top = markDOM.contentDOM || markDOM.dom as HTMLElement;
                    }
                }
            }
            top.appendChild(this.serializeNodeInner(node, options));
        });

        return target;
    }

    /**
     * Serialize this node to a DOM node. This can be useful when you
     * need to serialize a part of a document, as opposed to the whole
     * document. To serialize a whole document, use
     * [`serializeFragment`](#model.DOMSerializer.serializeFragment) on
     * its [content](#model.Node.content).
     *
     * @param node
     * @param options
     */
    public serializeNode(node: PmNode, options: { document?: Document; } = {}): Node {
        let dom: Node = this.serializeNodeInner(node, options);
        for (let i = node.marks.length - 1; i >= 0; i--) {
            const wrap: { dom: Node; contentDOM?: HTMLElement } = this.serializeMark(node.marks[i], node.isInline, options);
            if (wrap) {
                if (wrap.contentDOM) {
                    wrap.contentDOM.appendChild(dom);
                } else if (wrap.dom) {
                    wrap.dom.appendChild(dom);
                }
                dom = wrap.dom;
            }
        }
        return dom;
    }

    private serializeNodeInner(node: PmNode, options: { document?: Document; }): Node {
        const nodeSerializer = this.nodesVar[node.type.name];
        if (!nodeSerializer) {
            throw new RangeError(`No serializer found for node type '${node.type.name}'`);
        }

        const {
            dom,
            contentDOM
        } = DOMSerializer.renderSpecInternal(this.doc(options), nodeSerializer(node), null, node.attrs);

        if (contentDOM) {
            if (node.isLeaf) {
                throw new RangeError('Content hole not allowed in a leaf node spec');
            }
            this.serializeFragment(node.content, options, contentDOM);
        }
        return dom;
    }

    private serializeMark(mark: Mark,
                          inline: boolean,
                          options: { document?: Document; } = {}): { dom: Node; contentDOM?: HTMLElement } | null {
        const toDOM = this.marks[mark.type.name];
        if (!toDOM) {
            return null;
        }
        return DOMSerializer.renderSpecInternal(this.doc(options), toDOM(mark, inline), null, mark.attrs);
    }

    private doc(options: { document?: Document; }): Document {
        return options.document || window.document;
    }
}
