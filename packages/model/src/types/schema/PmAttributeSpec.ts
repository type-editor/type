/**
 * Used to [define](#model.NodeSpec.attrs) attributes on nodes or
 * marks.
 */
export interface PmAttributeSpec {

    /**
     * The default value for this attribute, to use when no explicit
     * value is provided. Attributes that have no default must be
     * provided whenever a node or mark of a type that has them is
     * created.
     */
    default?: string | number | boolean | null | undefined;

    /**
     * A function or type name used to validate values of this
     * attribute. This will be used when deserializing the attribute
     * from JSON, and when running [`Node.check`](#model.Node.check).
     * When a function, it should raise an exception if the value isn't
     * of the expected type or shape. When a string, it should be a
     * `|`-separated string of primitive types (`'number'`, `'string'`,
     * `'boolean'`, `'null'`, and `'undefined'`), and the library will
     * raise an error when the value is not one of those types.
     */
    validate?: string | ((value: string | number | boolean | null | undefined) => void);

    /**
     * When true, this attribute will be excluded from markup comparison
     * in `hasMarkup`. This is useful for auto-generated attributes (like IDs)
     * that should not affect whether a node is considered to have the same
     * markup as another node.
     *
     * @default false
     */
    excludeFromMarkupComparison?: boolean;
}
