import type {DOMSelectionRange} from './dom/DOMSelectionRange';


export interface PmSelectionState {
    readonly anchorNode: Node;
    readonly anchorOffset: number;
    readonly focusNode: Node;

    /**
     * Updates the selection state with new values.
     * @param sel - The DOM selection range to copy from
     */
    set(sel: DOMSelectionRange): void;

    /**
     * Clears the selection state by resetting all nodes to null.
     */
    clear(): void;

    /**
     * Checks if the given selection range equals this selection state.
     * @param sel - The selection range to compare
     * @returns true if both selections are identical
     */
    eq(sel: DOMSelectionRange): boolean;
}
