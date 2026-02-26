/**
 * Context data stored during serialization to preserve wrapper information.
 * Stored as an array alternating between node type name and attributes.
 */
export type SerializationContext = Array<string | Record<string, unknown> | null>;
