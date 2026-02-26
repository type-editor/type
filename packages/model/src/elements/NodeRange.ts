import type {Node as PmNode} from './Node';
import type {ResolvedPos} from './ResolvedPos';


/**
 * Represents a flat range of content, i.e. one that starts and
 * ends in the same node.
 */
export class NodeRange {

    /**
     * The starting resolved position of the range.
     * @private
     */
    private readonly fromPos: ResolvedPos;

    /**
     * The ending resolved position of the range.
     * @private
     */
    private readonly toPos: ResolvedPos;

    /**
     * The depth level at which this range operates.
     * @private
     */
    private readonly depthIndex: number;

    /**
     * Construct a node range. `$from` and `$to` should point into the
     * same node until at least the given `depth`, since a node range
     * denotes an adjacent set of nodes in a single parent node.
     *
     * @param $from A resolved position along the start of the content. May have a
     * `depth` greater than this object's `depth` property, since
     * these are the positions that were used to compute the range,
     * not re-resolved positions directly at its boundaries.
     * @param $to A position along the end of the content. See
     * caveat for [`$from`](#model.NodeRange.$from).
     * @param depth The depth of the node that this range points into.
     */
    constructor($from: ResolvedPos, $to: ResolvedPos, depth: number) {
        this.fromPos = $from;
        this.toPos = $to;
        this.depthIndex = depth;
    }

    /**
     * A resolved position at the start of the range.
     */
    get $from(): ResolvedPos {
        return this.fromPos;
    }

    /**
     * A resolved position at the end of the range.
     */
    get $to(): ResolvedPos {
        return this.toPos;
    }

    /**
     * The depth of the node that this range points into.
     */
    get depth(): number {
        return this.depthIndex;
    }

    /**
     * The position at the start of the range.
     *
     * @returns The absolute position at the start of this node range.
     */
    get start(): number {
        return this.fromPos.before(this.depthIndex + 1);
    }

    /**
     * The position at the end of the range.
     *
     * @returns The absolute position at the end of this node range.
     */
    get end(): number {
        return this.toPos.after(this.depthIndex + 1);
    }

    /**
     * The parent node that the range points into.
     *
     * @returns The parent node containing this range at the specified depth.
     */
    get parent(): PmNode {
        return this.fromPos.node(this.depthIndex);
    }

    /**
     * The start index of the range in the parent node.
     *
     * @returns The child index where this range starts within its parent.
     */
    get startIndex(): number {
        return this.fromPos.index(this.depthIndex);
    }

    /**
     * The end index of the range in the parent node.
     *
     * @returns The child index after where this range ends within its parent.
     */
    get endIndex(): number {
        return this.toPos.indexAfter(this.depthIndex);
    }
}
