import type {Mappable, MapResult, StepJSON} from '@type-editor/editor-types';
import {type Fragment, type Mark, type PmNode, type ResolvedPos, type Schema, Slice} from '@type-editor/model';

import {MarkStepFactory} from './MarkStepFactory';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * A step that adds a mark to all inline content between two positions.
 *
 * This step is used to apply formatting marks (like bold, italic, links) to a range
 * of inline content in the document. It only affects inline nodes (text and inline
 * elements) and respects the schema's mark type restrictions.
 *
 * @example
 * ```typescript
 * // Add a bold mark to text between positions 5 and 15
 * const step = new AddMarkStep(5, 15, schema.marks.strong.create());
 * ```
 */
export class AddMarkStep extends Step {

    private readonly from: number;
    private readonly mark: Mark;

    /**
     * Create a mark step.
     *
     * @param from - The start position of the marked range (inclusive).
     * @param to - The end position of the marked range (exclusive).
     * @param mark - The mark to add to inline content in the range.
     */
    constructor(from: number, to: number, mark: Mark) {
        super();
        this._to = to;
        this.from = from;
        this.mark = mark;
    }

    private _to: number;

    get to(): number {
        return this._to;
    }

    set to(to: number) {
        this._to = to;
    }

    /**
     * Deserialize an AddMarkStep from its JSON representation.
     *
     * Validates that the JSON contains valid positions (non-negative, from <= to)
     * and a mark specification before creating the step.
     *
     * @param schema - The schema to use for deserializing the mark.
     * @param json - The JSON representation of the step, must include from, to, and mark properties.
     * @returns A new AddMarkStep instance constructed from the JSON data.
     * @throws {RangeError} When the JSON is invalid, positions are negative, from > to, or mark is missing.
     */
    public static fromJSON(schema: Schema, json: StepJSON) {
        if (typeof json.from !== 'number' || typeof json.to !== 'number') {
            throw new RangeError('Invalid input for AddMarkStep.fromJSON');
        }
        if (json.from < 0 || json.to < 0) {
            throw new RangeError('Positions in AddMarkStep.fromJSON must be non-negative');
        }
        if (json.from > json.to) {
            throw new RangeError('Invalid range in AddMarkStep.fromJSON: from cannot be greater than to');
        }
        if (!json.mark) {
            throw new RangeError('Mark is required in AddMarkStep.fromJSON');
        }

        return new AddMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
    }

    /**
     * Apply this step to a document, adding the mark to all inline content in the range.
     *
     * Extracts the content slice from the specified range, applies the mark to all
     * inline atoms within it (respecting parent node mark type restrictions), and
     * replaces the original slice with the marked version.
     *
     * @param doc - The document to apply the step to.
     * @returns A StepResult indicating success (with the modified document) or failure (with error message).
     */
    apply(doc: PmNode): StepResult {
        const oldSlice: Slice = doc.slice(this.from, this._to);
        const $from: ResolvedPos = doc.resolve(this.from);
        const parent: PmNode = $from.node($from.sharedDepth(this._to));

        const fragment: Fragment = this.mapFragment(oldSlice.content, (node: PmNode, parentNode: PmNode): PmNode => {
            // Only apply marks to inline atoms (text nodes and inline atomic elements)
            // Non-atom inline nodes (like inline containers) should not receive marks
            if (!node.isAtom || !parentNode.type.allowsMarkType(this.mark.type)) {
                return node;
            }
            // Don't add the mark if it already exists
            if (this.mark.isInSet(node.marks)) {
                return node;
            }
            return node.mark(this.mark.addToSet(node.marks));
        }, parent);

        const slice: Slice = new Slice(fragment, oldSlice.openStart, oldSlice.openEnd);
        return StepResult.fromReplace(doc, this.from, this._to, slice);
    }

    /**
     * Create an inverted version of this step that removes the mark.
     *
     * Used for undo operations to revert the mark addition. The inverted step
     * will restore the document to its state before this step was applied.
     *
     * @returns A RemoveMarkStep that undoes this step by removing the added mark.
     */
    invert(): Step {
        return MarkStepFactory.createRemoveMarkStep(this.from, this._to, this.mark);
    }

    /**
     * Map this step through a mappable object, adjusting positions.
     *
     * Used in collaborative editing to adjust step positions when other changes
     * have been made to the document. Returns null if the marked range was deleted
     * or became invalid (from >= to).
     *
     * @param mapping - The mappable to apply (typically a StepMap or Mapping).
     * @returns A new AddMarkStep with mapped positions, or null if the range was deleted or became invalid.
     */
    map(mapping: Mappable): Step | null {
        const from: MapResult = mapping.mapResult(this.from, 1);
        const to: MapResult = mapping.mapResult(this._to, -1);

        if ((from.deleted && to.deleted) || from.pos >= to.pos) {
            return null;
        }
        return new AddMarkStep(from.pos, to.pos, this.mark);
    }

    /**
     * Try to merge this step with another step for optimization.
     *
     * Two AddMarkSteps can be merged if they apply the same mark and have
     * overlapping or adjacent ranges. The merged step will cover the union
     * of both ranges.
     *
     * @param other - The step to try merging with.
     * @returns A merged AddMarkStep covering the combined range if compatible, or null if the steps cannot be merged.
     */
    merge(other: Step): Step | null {
        if (other instanceof AddMarkStep
            && other.mark.eq(this.mark)
            && this.from <= other.to
            && this._to >= other.from) {

            const from: number = Math.min(this.from, other.from);
            const to: number = Math.max(this._to, other.to);
            return new AddMarkStep(from, to, this.mark);
        }
        return null;
    }

    /**
     * Serialize this step to JSON for storage or transmission.
     *
     * The resulting JSON object can be deserialized using {@link AddMarkStep.fromJSON}.
     *
     * @returns The JSON representation of this step including stepType, mark, from, and to properties.
     */
    toJSON(): StepJSON {
        return {
            stepType: 'addMark',
            mark: this.mark.toJSON(),
            from: this.from,
            to: this._to
        };
    }
}

Step.registerStep('addMark', AddMarkStep);
