
export interface MarkdownSerializeOptions {
    /**
     * Whether to render lists in a tight style. This can be overridden
     * on a node level by specifying a tight attribute on the node.
     * Defaults to false.
     */
    tightLists?: boolean
}

export interface MarkdownSerializerOptions extends MarkdownSerializeOptions {
    /**
     * Extra characters can be added for escaping. This is passed
     * directly to String.replace(), and the matching characters are
     * preceded by a backslash.
     */
    escapeExtraCharacters?: RegExp,
    /**
     * Specify the node name of hard breaks.
     * Defaults to "hard_break"
     */
    hardBreakNodeName?: string,
    /**
     * By default, the serializer raises an error when it finds a
     * node or mark type for which no serializer is defined. Set
     * this to `false` to make it just ignore such elements,
     * rendering only their content.
     */
    strict?: boolean
}
