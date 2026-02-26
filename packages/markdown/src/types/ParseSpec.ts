import type {Attrs} from '@type-editor/model';
import type Token from 'markdown-it/lib/token.mjs';


/**
 * Object type used to specify how Markdown tokens should be parsed.
 */
export interface ParseSpec {

    /**
     * This token maps to a single node, whose type can be looked up
     * in the schema under the given name. Exactly one of `node`,
     * `block`, or `mark` must be set.
     */
    node?: string

    /**
     * This token (unless `noCloseToken` is true) comes in `_open`
     * and `_close` variants (which are appended to the base token
     * name provides a the object property), and wraps a block of
     * content. The block should be wrapped in a node of the type
     * named to by the property's value. If the token does not have
     * `_open` or `_close`, use the `noCloseToken` option.
     */
    block?: string

    /**
     * This token (again, unless `noCloseToken` is true) also comes
     * in `_open` and `_close` variants, but should add a mark
     * (named by the value) to its content, rather than wrapping it
     * in a node.
     */
    mark?: string

    /**
     * Attributes for the node or mark. When `getAttrs` is provided,
     * it takes precedence.
     */
    attrs?: Attrs | null

    /**
     * A function used to compute the attributes for the node or mark
     * that takes a [markdown-it
     * token](https://markdown-it.github.io/markdown-it/#Token) and
     * returns an attribute object.
     *
     * @param token
     * @param tokenStream
     * @param index
     */
    getAttrs?: (token: Token, tokenStream: Array<Token>, index: number) => Attrs | null

    /**
     * Indicates that the [markdown-it
     * token](https://markdown-it.github.io/markdown-it/#Token) has
     * no `_open` or `_close` for the nodes. This defaults to `true`
     * for `code_inline`, `code_block` and `fence`.
     */
    noCloseToken?: boolean

    /**
     * When true, ignore content for the matched token.
     */
    ignore?: boolean
}
