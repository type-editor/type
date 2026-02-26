import type {AttrValue, Mappable, MapResult} from '@type-editor/editor-types';
import {type AttrsObject, Fragment, type PmNode, type Schema, Slice} from '@type-editor/model';

import {StepMap} from '../change-map/StepMap';
import type {AttrStepJson} from '../types/json/AttrStepJson';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * An attribute step represents an update to a specific attribute
 * of a node at a given position in the document.
 *
 * This step type is used to modify node attributes without changing the
 * node's content or structure. When applied, it creates a new version of
 * the node with the updated attribute value.
 *
 * @example
 * ```typescript
 * // Create a step that sets the 'align' attribute to 'center' on the node at position 5
 * const step = new AttrStep(5, 'align', 'center');
 * ```
 */
export class AttrStep extends Step {

    /** The position of the target node in the document. */
    private readonly pos: number;
    /** The name of the attribute to modify. */
    private readonly attr: string;
    /** The new value to set for the attribute. */
    private readonly value: AttrValue;

    /**
     * Construct an attribute step.
     *
     * @param pos - The position of the target node in the document.
     * @param attr - The name of the attribute to set.
     * @param value - The attribute's new value (string, number, boolean, null, or undefined).
     */
    constructor(pos: number, attr: string, value: AttrValue) {
        super();
        this.pos = pos;
        this.attr = attr;
        this.value = value;
    }

    /**
     * Deserialize an attribute step from its JSON representation.
     *
     * This method validates that the JSON contains valid position and attribute
     * name values. The position must be a non-negative number, and the attribute
     * name must be a non-empty string.
     *
     * @param _schema - The schema (not used but required by the Step interface).
     * @param json - The JSON representation of the step containing pos, attr, and value properties.
     * @returns A new AttrStep instance constructed from the JSON data.
     * @throws {RangeError} When the JSON is invalid, position is negative, or attribute name is empty.
     */
    static fromJSON(_schema: Schema, json: AttrStepJson): AttrStep {
        if (typeof json.pos !== 'number' || typeof json.attr !== 'string') {
            throw new RangeError('Invalid input for AttrStep.fromJSON');
        }
        if (json.pos < 0) {
            throw new RangeError('Position in AttrStep.fromJSON must be non-negative');
        }
        if (json.attr.length === 0) {
            throw new RangeError('Attribute name in AttrStep.fromJSON cannot be empty');
        }
        return new AttrStep(json.pos, json.attr, json.value);
    }

    /**
     * Apply this step to a document, modifying the attribute of the node at the stored position.
     *
     * Creates a new version of the target node with the updated attribute value while
     * preserving all other attributes, content, and marks. The node is replaced in the
     * document using a slice-based replacement.
     *
     * @param doc - The document to apply the step to.
     * @returns A StepResult indicating success (with the modified document) or failure (with error message).
     */
    apply(doc: PmNode): StepResult {
        const node: PmNode = doc.nodeAt(this.pos);
        if (!node) {
            return StepResult.fail('No node at attribute step\'s position');
        }

        const attrs: AttrsObject = Object.create(null) as AttrsObject;
        for (const name in node.attrs) {
            attrs[name] = node.attrs[name];
        }

        attrs[this.attr] = this.value;
        const updated: PmNode = node.type.create(attrs, null, node.marks);

        const slice: Slice = new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1);
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, slice);
    }

    /**
     * Get the step map for this step.
     *
     * Attribute changes don't affect document positions or structure,
     * so this returns an empty map indicating no position mapping is needed.
     *
     * @returns An empty StepMap indicating no position changes occurred.
     */
    getMap(): StepMap {
        return StepMap.empty;
    }

    /**
     * Create an inverted version of this step that undoes the attribute change.
     *
     * This is used for undo operations. The inverted step will restore the attribute
     * to its value before this step was applied.
     *
     * @param doc - The document before the step was applied.
     * @returns An AttrStep that restores the original attribute value.
     * @throws {RangeError} When there is no node at the stored position.
     */
    invert(doc: PmNode): AttrStep {
        const node: PmNode | null = doc.nodeAt(this.pos);
        if (!node) {
            throw new RangeError(`No node at position ${this.pos} for AttrStep.invert`);
        }
        return new AttrStep(this.pos, this.attr, node.attrs[this.attr]);
    }

    /**
     * Map this step through a mappable object (such as another step or step map).
     *
     * This is used in collaborative editing to adjust step positions when other changes
     * have been made to the document. If the target node has been deleted, returns null.
     *
     * @param mapping - The mappable to apply (typically a StepMap or Mapping).
     * @returns A new AttrStep with the mapped position, or null if the position was deleted.
     */
    map(mapping: Mappable): AttrStep {
        const pos: MapResult = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new AttrStep(pos.pos, this.attr, this.value);
    }

    /**
     * Serialize this step to JSON for storage or transmission.
     *
     * The resulting JSON object can be deserialized using {@link AttrStep.fromJSON}.
     *
     * @returns The JSON representation of this step including stepType, pos, attr, and value.
     */
    toJSON(): AttrStepJson {
        return {
            stepType: 'attr',
            pos: this.pos,
            attr: this.attr,
            value: this.value
        };
    }
}

Step.registerStep('attr', AttrStep);
