import type {Mark, Node} from '@type-editor/model';


/**
 * A token encoder can be passed when creating a `ChangeSet` in order
 * to influence the way the library runs its diffing algorithm. The
 * encoder determines how document tokens (such as nodes and
 * characters) are encoded and compared.
 *
 * Note that both the encoding and the comparison may run a lot, and
 * doing non-trivial work in these functions could impact
 * performance.
 */
export interface TokenEncoder<T> {

    /**
     * Encode a given character, with the given marks applied.
     *
     * @param char - The character code to encode.
     * @param marks - The marks applied to the character.
     * @returns The encoded representation of the character.
     */
    encodeCharacter(char: number, marks: ReadonlyArray<Mark>): T;

    /**
     * Encode the start of a node or, if this is a leaf node, the
     * entire node.
     *
     * @param node - The node to encode.
     * @returns The encoded representation of the node start.
     */
    encodeNodeStart(node: Node): T;

    /**
     * Encode the end token for the given node. It is valid to encode
     * every end token in the same way.
     *
     * @param node - The node to encode the end token for.
     * @returns The encoded representation of the node end.
     */
    encodeNodeEnd(node: Node): T;

    /**
     * Compare the given tokens. Should return true when they count as
     * equal.
     *
     * @param a - The first token to compare.
     * @param b - The second token to compare.
     * @returns True if the tokens are equal, false otherwise.
     */
    compareTokens(a: T, b: T): boolean;
}
