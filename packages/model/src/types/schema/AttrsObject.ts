/**
 * A mutable object holding the attributes of a node or mark. Unlike `Attrs`,
 * this type allows modification of attribute values.
 */
export type AttrsObject = Record<string, string | number | boolean | null | undefined>;
