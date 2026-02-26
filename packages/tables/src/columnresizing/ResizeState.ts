import type {PmTransaction} from '@type-editor/editor-types';

import type {Dragging} from '../types/columnresizing/Dragging';
import {pointsAtCell} from '../utils/points-at-cell';
import {columnResizingPluginKey} from './column-resizing-plugin-key';
import {NO_ACTIVE_HANDLE} from './no-active-handle';


/**
 * Represents the current state of column resizing within the editor.
 * This class is immutable - all state changes return a new instance.
 */
export class ResizeState {



    private readonly _activeHandle: number;
    private readonly _dragging?: Dragging;

    /**
     * Creates a new ResizeState instance.
     *
     * @param activeHandle - The document position of the currently active resize handle,
     *                       or {@link NO_ACTIVE_HANDLE} (-1) if no handle is active.
     * @param dragging - The current drag state, or `null`/`undefined` if not dragging.
     */
    constructor(activeHandle: number, dragging?: Dragging) {
        this._activeHandle = activeHandle;
        this._dragging = dragging;
    }

    /**
     * The document position of the currently active resize handle.
     * Returns -1 if no handle is active.
     */
    get activeHandle(): number {
        return this._activeHandle;
    }

    /**
     * The current drag state, or `undefined` if no drag is in progress.
     */
    get dragging(): Dragging | undefined {
        return this._dragging;
    }

    /**
     * Applies a transaction to produce a new state. Handles three cases:
     * 1. Handle position change (mouse moved near/away from column edge)
     * 2. Dragging state change (started/stopped dragging)
     * 3. Document changes while a handle is active (remap handle position)
     *
     * @param transaction - The transaction to apply.
     * @returns A new ResizeState reflecting the transaction's changes, or `this` if unchanged.
     */
    public apply(transaction: PmTransaction): ResizeState {
        // Check if transaction contains resize-related metadata
        const action = transaction.getMeta(columnResizingPluginKey) as {
            setHandle?: number;
            setDragging?: Dragging | null;
        } | undefined;

        if (action) {
            // Handle position was explicitly set (user moved mouse near a column edge)
            if (action.setHandle !== undefined) {
                return new ResizeState(action.setHandle, null);
            }

            // Dragging state was explicitly changed (user started or stopped dragging)
            if (action.setDragging !== undefined) {
                return new ResizeState(this._activeHandle, action.setDragging);
            }
        }

        // Document changed while we have an active handle - need to update position
        if (this._activeHandle > NO_ACTIVE_HANDLE && transaction.docChanged) {
            // Map the handle position through the transaction's changes
            let handle: number = transaction.mapping.map(this._activeHandle, -1);
            // Verify the mapped position still points at a cell
            if (!pointsAtCell(transaction.doc.resolve(handle))) {
                handle = NO_ACTIVE_HANDLE;
            }

            return new ResizeState(handle, this._dragging);
        }

        return this;
    }
}
