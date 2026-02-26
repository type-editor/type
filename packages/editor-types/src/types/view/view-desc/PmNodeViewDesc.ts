import type { PmNode } from '@type-editor/model';

import type { DecorationSource } from '../decoration/DecorationSource';
import type { PmDecoration } from '../decoration/PmDecoration';
import type { PmViewDesc } from './PmViewDesc';

export interface PmNodeViewDesc extends PmViewDesc {

    readonly outerDeco: ReadonlyArray<PmDecoration>;
    readonly innerDeco: DecorationSource;

    /**
     * Updates the internal state of this node view with new node and decorations.
     *
     * @param node - The new node
     * @param outerDeco - New outer decorations
     * @param innerDeco - New inner decorations
     */
    updateInner(node: PmNode,
                outerDeco: ReadonlyArray<PmDecoration>,
                innerDeco: DecorationSource): void;

    /**
     * Updates the outer decorations on this node, patching the DOM as needed.
     *
     * @param outerDeco - The new array of outer decorations
     */
    updateOuterDeco(outerDeco: ReadonlyArray<PmDecoration>): void;

    /**
     * Mark this node as being the selected node.
     */
    selectNode(): void;

    /**
     * Remove selected node marking from this node.
     */
    deselectNode(): void;
}
