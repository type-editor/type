/**
 * Options object passed when creating node decorations.
 *
 * Node decorations apply to an entire node in the document and must
 * span exactly the boundaries of that node (from the position before
 * the node to the position after it).
 *
 * Unlike inline and widget decorations, node decorations currently don't
 * have any built-in configuration options beyond arbitrary custom properties
 * that you can store in the spec for your own use.
 *
 * @example
 * ```typescript
 * const nodeDecoration = Decoration.node(10, 30,
 *   { class: "selected-paragraph" },
 *   { customData: "my-value" } // Custom spec properties
 * );
 *
 * // Access custom properties
 * const customData = nodeDecoration.spec.customData;
 * ```
 */

/**
 * Specs allow arbitrary additional properties for storing custom data.
 * These properties are preserved when decorations are mapped through
 * document changes and can be accessed via the decoration's `spec` property.
 */
export type NodeDecorationOptions = Record<string, unknown>;

