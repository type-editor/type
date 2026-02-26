import type {Mappable, MapResult, StepJSON} from '@type-editor/editor-types';
import {type Fragment, type Mark, type PmNode, type ResolvedPos, type Schema, Slice} from '@type-editor/model';

import {MarkStepFactory} from './MarkStepFactory';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * A step that removes a mark from all inline content between two positions.
 *
 * This step is used to remove formatting marks (like bold, italic, links) from a range
 * of inline content in the document. It only affects inline nodes that have the
 * specified mark applied.
 *
 * @example
 * ```typescript
 * // Remove a bold mark from text between positions 5 and 15
 * const step = new RemoveMarkStep(5, 15, schema.marks.strong.create());
 * ```
 */
export class RemoveMarkStep extends Step {

    private _from: number;
    private _to: number;

    /**
     * Create a mark-removing step.
     *
     * @param from - The start position of the unmarked range (inclusive).
     * @param to - The end position of the unmarked range (exclusive).
     * @param mark - The mark to remove from inline content in the range.
     */
    constructor(from: number, to: number, mark: Mark) {
        super();
        this._to = to;
        this._from = from;
        this._mark = mark;
    }

    get from(): number {
        return this._from;
    }

    set from(from: number) {
        this._from = from;
    }

    get to(): number {
        return this._to;
    }

    set to(to: number) {
        this._to = to;
    }

    private _mark: Mark;

    get mark(): Mark {
        return this._mark;
    }

    set mark(mark: Mark) {
        this._mark = mark;
    }

    /**
     * Deserialize a RemoveMarkStep from its JSON representation.
     *
     * Validates that the JSON contains valid positions (non-negative, from <= to)
     * and a mark specification before creating the step.
     *
     * @param schema - The schema to use for deserializing the mark.
     * @param json - The JSON representation of the step, must include from, to, and mark properties.
     * @returns A new RemoveMarkStep instance constructed from the JSON data.
     * @throws {RangeError} When the JSON is invalid, positions are negative, from > to, or mark is missing.
     */
    public static fromJSON(schema: Schema, json: StepJSON) {
        if (typeof json.from !== 'number' || typeof json.to !== 'number') {
            throw new RangeError('Invalid input for RemoveMarkStep.fromJSON');
        }
        if (json.from < 0 || json.to < 0) {
            throw new RangeError('Positions in RemoveMarkStep.fromJSON must be non-negative');
        }
        if (json.from > json.to) {
            throw new RangeError('Invalid range in RemoveMarkStep.fromJSON: from cannot be greater than to');
        }
        if (!json.mark) {
            throw new RangeError('Mark is required in RemoveMarkStep.fromJSON');
        }
        return new RemoveMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
    }

    /**
     * Apply this step to a document, removing the mark from all inline content in the range.
     *
     * Extracts the content slice from the specified range, removes the mark from all
     * inline nodes within it, and replaces the original slice with the unmarked version.
     *
     * @param doc - The document to apply the step to.
     * @returns A StepResult indicating success (with the modified document) or failure (with error message).
     */
    apply(doc: PmNode): StepResult {
        const oldSlice: Slice = doc.slice(this._from, this._to);
        const $from: ResolvedPos = doc.resolve(this._from);
        const parent: PmNode = $from.node($from.sharedDepth(this._to));

        const fragment: Fragment = this.mapFragment(oldSlice.content, (node: PmNode): PmNode => {
            return node.mark(this._mark.removeFromSet(node.marks));
        }, parent);

        const slice: Slice = new Slice(fragment, oldSlice.openStart, oldSlice.openEnd);
        return StepResult.fromReplace(doc, this._from, this._to, slice);
    }

    /**
     * Create an inverted version of this step that adds the mark back.
     *
     * Used for undo operations to revert the mark removal. The inverted step
     * will restore the document to its state before this step was applied.
     *
     * @returns An AddMarkStep that undoes this step by adding the mark back.
     */
    invert(): Step {
        return MarkStepFactory.createAddMarkStep(this._from, this._to, this._mark);
    }

    /**
     * Map this step through a mappable object, adjusting positions.
     *
     * Used in collaborative editing to adjust step positions when other changes
     * have been made to the document. Returns null if the unmarked range was deleted
     * or became invalid (from >= to).
     *
     * @param mapping - The mappable to apply (typically a StepMap or Mapping).
     * @returns A new RemoveMarkStep with mapped positions, or null if the range was deleted or became invalid.
     */
    map(mapping: Mappable): Step | null {
        const from: MapResult = mapping.mapResult(this._from, 1);
        const to: MapResult = mapping.mapResult(this._to, -1);

        if ((from.deleted && to.deleted) || from.pos >= to.pos) {
            return null;
        }
        return new RemoveMarkStep(from.pos, to.pos, this._mark);
    }

    /**
     * Try to merge this step with another step for optimization.
     *
     * Two RemoveMarkSteps can be merged if they remove the same mark and have
     * overlapping or adjacent ranges. The merged step will cover the union
     * of both ranges.
     *
     * @param other - The step to try merging with.
     * @returns A merged RemoveMarkStep covering the combined range if compatible, or null if the steps cannot be merged.
     */
    merge(other: Step): Step | null {
        if (other instanceof RemoveMarkStep &&
            other.mark.eq(this._mark) &&
            this._from <= other.to && this._to >= other._from) {

            const from: number = Math.min(this._from, other._from);
            const to: number = Math.max(this._to, other.to);
            return new RemoveMarkStep(from, to, this._mark);
        }
        return null;
    }

    /**
     * Serialize this step to JSON for storage or transmission.
     *
     * The resulting JSON object can be deserialized using {@link RemoveMarkStep.fromJSON}.
     *
     * @returns The JSON representation of this step including stepType, mark, from, and to properties.
     */
    toJSON(): StepJSON {
        return {
            stepType: 'removeMark',
            mark: this._mark.toJSON(),
            from: this._from,
            to: this._to
        };
    }
}

Step.registerStep('removeMark', RemoveMarkStep);
