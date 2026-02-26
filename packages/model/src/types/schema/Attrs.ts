/**
 * An object holding the attributes of a node. This is a readonly version
 * that ensures attributes cannot be modified after creation.
 */
// export type Attrs = Readonly<Record<string, string | number | boolean | null | undefined>>;
export type Attrs = Readonly<Record<string, any | null | undefined>>;
