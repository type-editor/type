import type {PmNode} from '@type-editor/model';

import type {Mappable} from '../../transform';
import type {DecorationSpec} from './DecorationSpec';
import type {PmDecoration} from './PmDecoration';

/**
 * Interface representing the different types of decorations that can be applied to the editor.
 * Each decoration type defines how it is mapped, validated, compared, and destroyed.
 */
export interface DecorationType {

    /** The specification object containing configuration for this decoration type. */
    spec: DecorationSpec;

    /**
     * Maps this decoration type through a change in the document.
     * @param mapping - The mapping to apply to the decoration.
     * @param span - The decoration to map.
     * @param offset - The current offset in the document.
     * @param oldOffset - The offset before the change.
     * @returns The mapped decoration, or null if it should be removed.
     */
    map(mapping: Mappable, span: PmDecoration, offset: number, oldOffset: number): PmDecoration | null;

    /**
     * Validates that this decoration is still valid for the given node.
     * @param node - The node to validate against.
     * @param span - The decoration to validate.
     * @returns True if the decoration is valid, false otherwise.
     */
    valid(node: PmNode, span: PmDecoration): boolean;

    /**
     * Checks if this decoration type is equal to another.
     * @param other - The other decoration type to compare with.
     * @returns True if the decoration types are equal, false otherwise.
     */
    eq(other: DecorationType): boolean;

    /**
     * Performs cleanup when the decoration is removed.
     * @param dom - The DOM node associated with the decoration.
     */
    destroy(dom: Node): void;
}
