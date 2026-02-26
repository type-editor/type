import type {PmNode} from '@type-editor/model';

import type {Mappable} from '../../transform';
import type {PmDecoration} from './PmDecoration';

/**
 * An object that can [provide](#view.EditorProps.decorations)
 * decorations. Implemented by [`DecorationSet`](#view.DecorationSet),
 * and passed to [node views](#view.EditorProps.nodeViews).
 *
 * This interface defines the contract for objects that manage decorations
 * in the editor.
 */
export interface DecorationSource {
    /**
     * Map the set of decorations in response to a change in the document.
     * @param mapping - The mapping to apply.
     * @param node - The document node.
     * @returns The mapped decoration source.
     */
    map: (mapping: Mappable, node: PmNode) => DecorationSource;

    /**
     * Get local decorations for the given node.
     * @param node - The node to get decorations for.
     * @returns Array of decorations.
     * @internal
     */
    locals(node: PmNode): ReadonlyArray<PmDecoration>;

    /**
     * Extract a DecorationSource containing decorations for the given child node at the given offset.
     * @param offset - The offset of the child node.
     * @param child - The child node.
     * @returns DecorationSource for the child.
     */
    forChild(offset: number, child: PmNode): DecorationSource;

    /**
     * Check equality with another decoration source.
     * @param other - The other decoration source.
     * @returns True if equal.
     * @internal
     */
    eq(other: DecorationSource): boolean;

    /**
     * Call the given function for each decoration set in the group.
     * @param callbackFunc - Function to call for each decoration set.
     */
    forEachSet(callbackFunc: (set: DecorationSource) => void): void;
}
