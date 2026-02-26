import { PmNode } from '@type-editor/model';

export interface PmMouseDown {

    readonly allowDefault: boolean;
    readonly mightDrag: { node: PmNode; pos: number; addAttr: boolean; setUneditable: boolean };
    delayedSelectionSync: boolean;

    /**
     * Cleans up the mouse down state, removing event listeners and
     * restoring DOM attributes that were modified for dragging.
     */
    done(): void;
}
