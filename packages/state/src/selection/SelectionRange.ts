import type {PmSelectionRange} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

/**
 * Represents a selected range in a document.
 * A range has a start position ($from) and an end position ($to).
 * Most selections consist of a single range, but some selection types
 * may use multiple ranges to represent discontinuous selections.
 */
export class SelectionRange implements PmSelectionRange {

    /**
     * The resolved starting position of the range.
     * @private
     */
    private readonly from: ResolvedPos;

    /**
     * The resolved ending position of the range.
     * @private
     */
    private readonly to: ResolvedPos;

    /**
     * Create a range.
     *
     * @param $from The lower bound of the range (resolved position)
     * @param $to The upper bound of the range (resolved position)
     */
    constructor($from: ResolvedPos, $to: ResolvedPos) {
        this.from = $from;
        this.to = $to;
    }

    /**
     * The resolved lower bound of the range.
     *
     * @returns The starting position
     */
    get $from(): ResolvedPos {
        return this.from;
    }

    /**
     * The resolved upper bound of the range.
     *
     * @returns The ending position
     */
    get $to(): ResolvedPos {
        return this.to;
    }
}
