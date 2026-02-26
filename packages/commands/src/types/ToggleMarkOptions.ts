
/**
 * Configuration options for the toggleMark command.
 */
export interface ToggleMarkOptions {
    /**
     * Controls the behavior when the selection has mixed mark presence.
     *
     * - `true` (default): Remove the mark if any part of the selection has it
     * - `false`: Add the mark if any part of the selection is missing it
     *
     * This affects how the toggle behaves with partial selections:
     * - When `true`: If *any* content has the mark, remove it everywhere
     * - When `false`: If *any* content lacks the mark, add it everywhere
     *
     * @default true
     */
    removeWhenPresent?: boolean | undefined;

    /**
     * Whether to apply marks inside inline atomic nodes.
     *
     * When `false`, the command will skip over the content of inline atomic nodes
     * (like mentions, inline math, etc.) that are completely covered by the selection.
     * This prevents marking content that should be treated as an indivisible unit.
     *
     * @default true
     */
    enterInlineAtoms?: boolean | undefined;

    /**
     * Whether to include leading and trailing whitespace when applying marks.
     *
     * When `false` (default), the command automatically excludes leading and trailing
     * whitespace from mark application. This creates cleaner formatting where marks
     * don't extend into surrounding spaces.
     *
     * @default false
     *
     * @example
     * ```typescript
     * // With includeWhitespace: false (default)
     * "hello world" → select "hello " → make bold → "**hello** world"
     *
     * // With includeWhitespace: true
     * "hello world" → select "hello " → make bold → "**hello **world"
     * ```
     */
    includeWhitespace?: boolean | undefined;

    /**
     * When `true`, the mark change will only be applied if the selected text
     * contains only numeric characters (0-9).
     *
     * This is useful for marks like superscript or subscript that should
     * typically only apply to numbers.
     *
     * @default false
     */
    onlyNumbers?: boolean | undefined;

    /**
     * When `true` and the selection is empty (cursor position), the command
     * will attempt to extend the selection to include an adjacent character.
     *
     * The command first checks the character immediately before the cursor.
     * If no character exists before, it checks the character immediately after.
     *
     * This is useful for quickly applying marks to individual characters
     * without manually selecting them.
     *
     * @default false
     */
    extendEmptySelection?: boolean | undefined;
}
