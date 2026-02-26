/**
 * Options for inline decorations that control how the decoration behaves
 * when the document is edited at its boundaries.
 *
 * @example
 * ```typescript
 * // Non-inclusive decoration (default)
 * // Typing at boundaries won't include new text
 * const decoration1 = Decoration.inline(0, 5, {class: "highlight"});
 *
 * // Fully inclusive decoration
 * // Typing at either boundary will include new text
 * const decoration2 = Decoration.inline(0, 5,
 *   {class: "highlight"},
 *   {inclusiveStart: true, inclusiveEnd: true}
 * );
 *
 * // Start-inclusive only
 * // Typing at the start includes new text, at the end does not
 * const decoration3 = Decoration.inline(0, 5,
 *   {class: "highlight"},
 *   {inclusiveStart: true}
 * );
 * ```
 */
export interface InlineDecorationOptions {

    /**
     * Determines how the left side of the decoration is
     * [mapped](#transform.Position_Mapping) when content is
     * inserted directly at that position. By default, the decoration
     * won't include the new content, but you can set this to `true`
     * to make it inclusive.
     *
     * When `false` (default): Text inserted at the start position will
     * appear before the decoration.
     * When `true`: Text inserted at the start position will be included
     * in the decoration.
     *
     * @default false
     */
    inclusiveStart?: boolean;

    /**
     * Determines how the right side of the decoration is mapped.
     * See {@link inclusiveStart}.
     *
     * When `false` (default): Text inserted at the end position will
     * appear after the decoration.
     * When `true`: Text inserted at the end position will be included
     * in the decoration.
     *
     * @default false
     */
    inclusiveEnd?: boolean;

    /**
     * Specs allow arbitrary additional properties for storing custom data.
     * These properties are preserved when decorations are mapped through
     * document changes and can be accessed via the decoration's `spec` property.
     */
    [key: string]: unknown;
}
