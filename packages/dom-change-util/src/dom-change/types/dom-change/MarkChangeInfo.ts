import type {Mark} from '@type-editor/model';

/**
 * Represents a mark change operation (adding or removing a mark).
 *
 * This interface is used to optimize mark changes by detecting when
 * a change is simply adding or removing a single mark type (like bold
 * or italic) rather than changing the actual text content.
 *
 * @interface MarkChangeInfo
 * @example
 * ```typescript
 * // User presses Ctrl+B to make text bold
 * const markChange: MarkChangeInfo = {
 *   mark: schema.marks.strong.create(),
 *   type: 'add'
 * };
 * ```
 */
export interface MarkChangeInfo {
    /**
     * The mark that was added to or removed from the content.
     * This is a ProseMirror Mark instance.
     */
    mark: Mark;

    /**
     * Type of mark change operation.
     * - 'add': The mark was added to the content
     * - 'remove': The mark was removed from the content
     */
    type: 'add' | 'remove';
}
