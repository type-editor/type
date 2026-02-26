import type {Node} from '@type-editor/model';

import type {MarkdownSerializerOptions} from '../types/MarkdownSerializerOptions';
import type {MarkSerializerSpec} from '../types/MarkSerializerSpec';
import type {NodeSerializerFunc} from '../types/NodeSerializerFunc';
import {MarkdownSerializerState} from './MarkdownSerializerState';

/**
 * A specification for serializing a ProseMirror document as
 * Markdown/CommonMark text.
 */
export class MarkdownSerializer {

    readonly _nodes: Record<string, NodeSerializerFunc>;
    private readonly _marks: Record<string, MarkSerializerSpec>;
    private readonly _options: MarkdownSerializerOptions;


    /**
     * Construct a serializer with the given configuration. The `nodes`
     * object should map node names in a given schema to functions that
     * take a serializer state and such a node, and serialize the node.
     *
     * @param nodes - A record mapping node type names to their serializer functions
     * @param marks - A record mapping mark type names to their serializer specifications
     * @param options - Optional configuration for the serializer behavior
     */
    constructor(
        nodes: Record<string, NodeSerializerFunc>,
        marks: Record<string, MarkSerializerSpec>,
        options?: MarkdownSerializerOptions) {
        this._nodes = nodes;
        this._marks = marks;
        this._options = options ?? {};
    }

    get nodes(): Record<string, NodeSerializerFunc> {
        return this._nodes;
    }

    get marks(): Record<string, MarkSerializerSpec> {
        return this._marks;
    }

    get options(): MarkdownSerializerOptions {
        return this._options;
    }

    /**
     * Serialize the content of the given node to
     * [CommonMark](http://commonmark.org/).
     *
     * @param content - The ProseMirror node to serialize to Markdown
     * @param tightLists - Whether to render lists in tight style (no blank lines between items)
     * @returns The serialized Markdown string
     */
    public serialize(content: Node, tightLists = false): string {
        const options: MarkdownSerializerOptions = {...this._options, tightLists};
        const state = new MarkdownSerializerState(this._nodes, this._marks, options);
        state.renderContent(content);
        return state.out;
    }
}
