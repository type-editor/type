import type {DOMSelectionRange, PmSelectionState} from '@type-editor/editor-types';


/**
 * Represents the state of a DOM selection, tracking anchor and focus positions.
 * This is used to detect selection changes efficiently.
 */
export class SelectionState implements PmSelectionState {

    private _focusOffset = 0;
    private _anchorOffset = 0;
    private _anchorNode: Node | null = null;
    private _focusNode: Node | null = null;

    get anchorNode(): Node | null {
        return this._anchorNode;
    }

    get anchorOffset(): number {
        return this._anchorOffset;
    }

    get focusNode(): Node | null {
        return this._focusNode;
    }

    /**
     * Updates the selection state with new values.
     * @param sel - The DOM selection range to copy from
     */
    set(sel: DOMSelectionRange): void {
        this._anchorNode = sel.anchorNode;
        this._anchorOffset = sel.anchorOffset;
        this._focusNode = sel.focusNode;
        this._focusOffset = sel.focusOffset;
    }

    /**
     * Clears the selection state by resetting all nodes to null.
     */
    public clear(): void {
        this._anchorNode = null;
        this._focusNode = null;
        this._anchorOffset = 0;
        this._focusOffset = 0;
    }

    /**
     * Checks if the given selection range equals this selection state.
     * @param sel - The selection range to compare
     * @returns true if both selections are identical
     */
    public eq(sel: DOMSelectionRange): boolean {
        return sel.anchorNode === this._anchorNode
            && sel.anchorOffset === this._anchorOffset
            && sel.focusNode === this._focusNode
            && sel.focusOffset === this._focusOffset;
    }
}
