import type {Mappable, MapResult, StepJSON} from '@type-editor/editor-types';
import {Fragment, type Mark, type PmNode, type Schema, Slice} from '@type-editor/model';

import {MarkStepFactory} from './MarkStepFactory';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * A step that removes a mark from a specific node (not its content, but the node itself).
 *
 * This step is used to remove marks from block-level nodes or other non-inline nodes.
 * Unlike RemoveMarkStep which affects inline content within a range, this step
 * targets a single node at a specific position and removes a mark from that node.
 *
 * @example
 * ```typescript
 * // Remove a mark from the node at position 10
 * const step = new RemoveNodeMarkStep(10, schema.marks.highlight.create());
 * ```
 */
export class RemoveNodeMarkStep extends Step {

    private readonly pos: number;
    private readonly mark: Mark;

    /**
     * Create a mark-removing step.
     *
     * @param pos - The position of the target node in the document.
     * @param mark - The mark to remove from the node.
     */
    constructor(pos: number, mark: Mark) {
        super();
        this.pos = pos;
        this.mark = mark;
    }

    /**
     * Deserialize a RemoveNodeMarkStep from its JSON representation.
     *
     * Validates that the JSON contains a valid non-negative position and a mark
     * specification before creating the step.
     *
     * @param schema - The schema to use for deserializing the mark.
     * @param json - The JSON representation of the step, must include pos and mark properties.
     * @returns A new RemoveNodeMarkStep instance constructed from the JSON data.
     * @throws {RangeError} When the JSON is invalid, position is negative, or mark is missing.
     */
    public static fromJSON(schema: Schema, json: StepJSON) {
        if (typeof json.pos !== 'number') {
            throw new RangeError('Invalid input for RemoveNodeMarkStep.fromJSON');
        }
        if (json.pos < 0) {
            throw new RangeError('Position in RemoveNodeMarkStep.fromJSON must be non-negative');
        }
        if (!json.mark) {
            throw new RangeError('Mark is required in RemoveNodeMarkStep.fromJSON');
        }
        return new RemoveNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
    }

    /**
     * Apply this step to a document, removing the mark from the node at the stored position.
     *
     * Creates a new version of the target node with the mark removed from its mark set,
     * then replaces the original node with the unmarked version using a slice-based replacement.
     *
     * @param doc - The document to apply the step to.
     * @returns A StepResult indicating success (with the modified document) or failure (with error message).
     */
    apply(doc: PmNode): StepResult {
        let node: PmNode | null;
        try {
            node = doc.nodeAt(this.pos);
        } catch (_e) {
            return StepResult.fail('No node at mark step\'s position');
        }
        if (!node) {
            return StepResult.fail('No node at mark step\'s position');
        }

        const updated: PmNode = node.type.create(node.attrs, null, this.mark.removeFromSet(node.marks));
        const fragment: Fragment = Fragment.from(updated);
        const slice: Slice = new Slice(fragment, 0, node.isLeaf ? 0 : 1);
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, slice);
    }

    /**
     * Create an inverted version of this step that adds the mark back.
     *
     * Used for undo operations to revert the mark removal. If the mark wasn't present
     * on the node in the original document, the inversion is still to add it back
     * (since applying this step would be a no-op, inverting it should also be a no-op
     * when applied, which happens when adding a mark that creates no change).
     *
     * @param doc - The document before the step was applied.
     * @returns An AddNodeMarkStep that undoes this step.
     * @throws {RangeError} When there is no node at the stored position.
     */
    invert(doc: PmNode): Step {
        const node: PmNode = doc.nodeAt(this.pos);
        if (!node) {
            throw new RangeError(`No node at position ${this.pos} for RemoveNodeMarkStep.invert`);
        }
        // Always return AddNodeMarkStep as the inverse
        // If the mark wasn't present, removing it is a no-op, and adding it back is also effectively a no-op
        return MarkStepFactory.createAddNodeMarkStep(this.pos, this.mark);
    }

    /**
     * Map this step through a mappable object, adjusting the position.
     *
     * Used in collaborative editing to adjust the step position when other changes
     * have been made to the document. Returns null if the target node was deleted.
     *
     * @param mapping - The mappable to apply (typically a StepMap or Mapping).
     * @returns A new RemoveNodeMarkStep with the mapped position, or null if the position was deleted.
     */
    map(mapping: Mappable): Step | null {
        const pos: MapResult = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new RemoveNodeMarkStep(pos.pos, this.mark);
    }

    /**
     * Serialize this step to JSON for storage or transmission.
     *
     * The resulting JSON object can be deserialized using {@link RemoveNodeMarkStep.fromJSON}.
     *
     * @returns The JSON representation of this step including stepType, pos, and mark properties.
     */
    toJSON(): StepJSON {
        return {
            stepType: 'removeNodeMark',
            pos: this.pos,
            mark: this.mark.toJSON()
        };
    }
}

Step.registerStep('removeNodeMark', RemoveNodeMarkStep);
