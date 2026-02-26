import type {Mappable} from '../../transform';
import type {DecorationSpec} from './DecorationSpec';
import type {DecorationType} from './DecorationType';


/**
 * Decoration objects can be provided to the view through the
 * [`decorations` prop](#view.EditorProps.decorations). They come in
 * several variants—see the static members of this class for details.
 *
 * Decorations allow you to add styling, attributes, or widgets to the
 * editor view without modifying the underlying document. They are used
 * for features like syntax highlighting, collaborative cursors, search
 * results, and inline UI elements.
 */
export interface PmDecoration {

    readonly from: number;
    readonly to: number;
    readonly type: DecorationType;
    readonly spec: DecorationSpec;
    readonly inline: boolean;
    readonly widget: boolean;

    /**
     * Create a copy of this decoration with new positions.
     *
     * @param from - The new start position
     * @param to - The new end position
     * @returns A new decoration with the same type but different positions
     */
    copy(from: number, to: number): PmDecoration;

    /**
     * Check if this decoration is equal to another decoration.
     *
     * @param other - The decoration to compare with
     * @param offset - Optional offset to apply to this decoration's positions
     * @returns True if the decorations are equal
     */
    eq(other: PmDecoration, offset?: number): boolean;

    /**
     * Map this decoration through a document change.
     *
     * @param mapping - The mapping representing document changes
     * @param offset - The current document offset
     * @param oldOffset - The offset in the old document
     * @returns The mapped decoration or null if it was deleted
     */
    map(mapping: Mappable, offset: number, oldOffset: number): PmDecoration;
}
