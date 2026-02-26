import type {Attrs, NodeType} from '@type-editor/model';

/**
 * Information about where and how to split a block.
 */
export interface SplitInfo {
    types: Array<null | { type: NodeType; attrs?: Attrs | null }>;
    depth: number;
    defaultNodeType: NodeType | null;
    atEnd: boolean;
    atStart: boolean;
}
