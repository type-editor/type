import type {PmDragging, PmSelection} from '@type-editor/editor-types';
import type {Slice} from '@type-editor/model';


/**
 * Represents an active drag operation, storing information about what
 * is being dragged and whether it's a move or copy operation.
 */
export class Dragging implements PmDragging {
    /** The content slice being dragged */
    private readonly _slice: Slice;

    /** Whether this is a move operation (vs. copy) */
    private readonly _move: boolean;

    /** The node selection being dragged, if dragging a selected node */
    private readonly _nodeSelection?: PmSelection;

    /**
     * Creates a new Dragging instance.
     * @param slice - The content being dragged
     * @param move - Whether this is a move (vs. copy) operation
     * @param nodeSelection - Optional node selection being dragged
     * @throws Error if nodeSelection is provided but is not a NodeSelection
     */
    constructor(slice: Slice, move: boolean, nodeSelection?: PmSelection) {
        if (nodeSelection && !(nodeSelection.isNodeSelection())) {
            throw new Error('nodeSelection must be of type NodeSelection');
        }
        this._slice = slice;
        this._move = move;
        this._nodeSelection = nodeSelection;
    }

    /** The content slice being dragged */
    get slice(): Slice {
        return this._slice;
    }

    /** Whether this is a move operation */
    get move(): boolean {
        return this._move;
    }

    /** The node selection being dragged, if any */
    get nodeSelection(): PmSelection | undefined {
        return this._nodeSelection;
    }
}
