import type {Mappable, MapResult, StepJSON} from '@type-editor/editor-types';
import {Fragment, type Mark, type PmNode, type Schema, Slice} from '@type-editor/model';

import {MarkStepFactory} from './MarkStepFactory';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * A step that adds a mark to a specific node (not its content, but the node itself).
 *
 * This step is used to apply marks to block-level nodes or other non-inline nodes.
 * Unlike AddMarkStep which affects inline content within a range, this step
 * targets a single node at a specific position and adds a mark to that node.
 *
 * @example
 * ```typescript
 * // Add a mark to the node at position 10
 * const step = new AddNodeMarkStep(10, schema.marks.highlight.create());
 * ```
 */
export class AddNodeMarkStep extends Step {

    private readonly pos: number;
    private readonly mark: Mark;

    /**
     * Create a node mark step.
     *
     * @param pos - The position of the target node in the document.
     * @param mark - The mark to add to the node.
     */
    constructor(pos: number, mark: Mark) {
        super();
        this.pos = pos;
        this.mark = mark;
    }

    /**
     * Deserialize an AddNodeMarkStep from its JSON representation.
     *
     * Validates that the JSON contains a valid non-negative position and a mark
     * specification before creating the step.
     *
     * @param schema - The schema to use for deserializing the mark.
     * @param json - The JSON representation of the step, must include pos and mark properties.
     * @returns A new AddNodeMarkStep instance constructed from the JSON data.
     * @throws {RangeError} When the JSON is invalid, position is negative, or mark is missing.
     */
    public static fromJSON(schema: Schema, json: StepJSON) {
        if (typeof json.pos !== 'number') {
            throw new RangeError('Invalid input for AddNodeMarkStep.fromJSON');
        }
        if (json.pos < 0) {
            throw new RangeError('Position in AddNodeMarkStep.fromJSON must be non-negative');
        }
        if (!json.mark) {
            throw new RangeError('Mark is required in AddNodeMarkStep.fromJSON');
        }
        return new AddNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
    }

    /**
     * Apply this step to a document, adding the mark to the node at the stored position.
     *
     * Creates a new version of the target node with the mark added to its mark set,
     * then replaces the original node with the marked version using a slice-based replacement.
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
        const updated: PmNode = node.type.create(node.attrs, null, this.mark.addToSet(node.marks));
        const fragment: Fragment = Fragment.from(updated);
        const slice: Slice = new Slice(fragment, 0, node.isLeaf ? 0 : 1);
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, slice);
    }

    /**
     * Create an inverted version of this step for undo operations.
     *
     * The inversion logic handles three cases:
     * - If adding the mark replaced an existing mark (e.g., mark exclusion), returns a step to add back the replaced mark
     * - If the mark was already present (no-op), returns this same step (which is also a no-op)
     * - Otherwise, returns a RemoveNodeMarkStep to remove the added mark
     *
     * This ensures proper undo behavior that restores the exact previous state.
     *
     * @param doc - The document before the step was applied.
     * @returns A step that undoes this step by either re-adding a replaced mark, being a no-op, or removing the added mark.
     * @throws {RangeError} When there is no node at the stored position.
     */
    invert(doc: PmNode): Step {
        const node: PmNode | null = doc.nodeAt(this.pos);
        if (!node) {
            throw new RangeError(`No node at position ${this.pos} for AddNodeMarkStep.invert`);
        }

        const newSet: ReadonlyArray<Mark> = this.mark.addToSet(node.marks);
        // If a mark was replaced (same length means one was removed and one was added)
        if (newSet.length === node.marks.length) {
            for (const item of node.marks) {
                if (!item.isInSet(newSet)) {
                    // A mark was replaced, invert by adding it back
                    return new AddNodeMarkStep(this.pos, item);
                }
            }
            // Mark already existed (no-op case), invert is also a no-op
            // Return this same step which won't change anything when applied
            return this;
        }

        // Normal case: mark was added, invert by removing it
        return MarkStepFactory.createRemoveNodeMarkStep(this.pos, this.mark);
    }

    /**
     * Map this step through a mappable object, adjusting the position.
     *
     * Used in collaborative editing to adjust the step position when other changes
     * have been made to the document. Returns null if the target node was deleted.
     *
     * @param mapping - The mappable to apply (typically a StepMap or Mapping).
     * @returns A new AddNodeMarkStep with the mapped position, or null if the position was deleted.
     */
    map(mapping: Mappable): Step | null {
        const position: MapResult = mapping.mapResult(this.pos, 1);
        return position.deletedAfter ? null : new AddNodeMarkStep(position.pos, this.mark);
    }

    /**
     * Serialize this step to JSON for storage or transmission.
     *
     * The resulting JSON object can be deserialized using {@link AddNodeMarkStep.fromJSON}.
     *
     * @returns The JSON representation of this step including stepType, pos, and mark properties.
     */
    toJSON(): StepJSON {
        return {
            stepType: 'addNodeMark',
            pos: this.pos,
            mark: this.mark.toJSON()
        };
    }
}

Step.registerStep('addNodeMark', AddNodeMarkStep);
