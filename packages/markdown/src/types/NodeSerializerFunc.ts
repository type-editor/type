import type {Node} from '@type-editor/model';

import type {MarkdownSerializerState} from '../to-markdown/MarkdownSerializerState';


/**
 * A function type for serializing ProseMirror nodes to Markdown.
 *
 * @param state - The current serializer state
 * @param node - The node to serialize
 * @param parent - The parent node containing this node
 * @param index - The index of this node within its parent
 */
export type NodeSerializerFunc = (state: MarkdownSerializerState, node: Node, parent: Node, index: number) => void;
