import type {Node, NodeType} from '@type-editor/model';

import type {TokenEncoder} from './types/TokenEncoder';


/**
 * The default token encoder for diff operations.
 * - Node start tokens are encoded as strings containing the node name
 * - Characters are encoded as their character code
 * - Node end tokens are encoded as negative type IDs
 */
export const DefaultEncoder: TokenEncoder<number | string> = {
    encodeCharacter: (char: number): number => char,
    encodeNodeStart: (node: Node): string => node.type.name,
    encodeNodeEnd: (node: Node): number => -getTypeID(node.type),
    compareTokens: (a: number | string, b: number | string): boolean => a === b
};

/**
 * Get a unique numeric ID for a node type.
 * Uses a cached mapping to avoid recomputing IDs for the same type.
 *
 * @param type - The node type to get an ID for.
 * @returns A unique numeric identifier for the node type.
 */
function getTypeID(type: NodeType): number {
    // Initialize or retrieve the cache from the schema
    let idCache: Record<string, number> = type.schema.cached.changeSetIDs as Record<string, number> | undefined;

    if (!idCache) {
        // Build the entire ID cache at once to avoid repeated Object.keys() calls
        idCache = {} as Record<string, number>;
        const nodeNames: Array<string> = Object.keys(type.schema.nodes);
        for (let i = 0; i < nodeNames.length; i++) {
            idCache[nodeNames[i]] = i + 1;
        }
        type.schema.cached.changeSetIDs = idCache;
    }

    return idCache[type.name];
}
