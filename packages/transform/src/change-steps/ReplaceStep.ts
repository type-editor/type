import {isTrue} from '@type-editor/commons';
import type {Mappable, MapResult} from '@type-editor/editor-types';
import {type Fragment, type PmNode, type Schema, Slice} from '@type-editor/model';

import {StepMap} from '../change-map/StepMap';
import type {ReplaceStepJSON} from '../types/json/ReplaceStepJSON';
import {AbstractReplaceStep} from './AbstractReplaceStep';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * Replace a part of the document with a slice of new content.
 */
export class ReplaceStep extends AbstractReplaceStep {

    private readonly _from: number;
    private readonly _to: number;
    private readonly _slice: Slice;
    private readonly structure: boolean;

    /**
     * The given `slice` should fit the 'gap' between `from` and
     * `to`—the depths must line up, and the surrounding nodes must be
     * able to be joined with the open sides of the slice. When
     * `structure` is true, the step will fail if the content between
     * from and to is not just a sequence of closing and then opening
     * tokens (this is to guard against rebased replace steps
     * overwriting something they weren't supposed to).
     *
     * @param from The start position of the replaced range.
     * @param to The end position of the replaced range.
     * @param slice The slice to insert.
     * @param structure When true, the step will fail if the content between from and to is not just a sequence of closing and opening tokens.
     */
    constructor(from: number,
                to: number,
                slice: Slice,
                structure = false) {
        super();
        this._from = from;
        this._to = to;
        this._slice = slice;
        this.structure = structure;
    }

    /**
     * The start position of the replaced range.
     */
    get from(): number {
        return this._from;
    }

    /**
     * The end position of the replaced range.
     */
    get to(): number {
        return this._to;
    }

    /**
     * The slice to insert.
     */
    get slice(): Slice {
        return this._slice;
    }

    /**
     * Deserialize a replace step from its JSON representation.
     *
     * @param schema The schema to use for deserializing the slice.
     * @param json The JSON representation of the step.
     * @returns A new ReplaceStep instance.
     */
    public static fromJSON(schema: Schema, json: ReplaceStepJSON): ReplaceStep {
        if (typeof json.from !== 'number' || typeof json.to !== 'number') {
            throw new RangeError('Invalid input for ReplaceStep.fromJSON');
        }
        return new ReplaceStep(
            json.from,
            json.to,
            Slice.fromJSON(schema, json.slice),
            isTrue(json.structure)
        );
    }

    /**
     * Apply this step to the given document, returning a result object.
     *
     * @param doc The document to apply the step to.
     * @returns The result of applying the step.
     */
    apply(doc: PmNode): StepResult {
        if (this.structure && this.contentBetween(doc, this._from, this._to)) {
            return StepResult.fail('Structure replace would overwrite content');
        }

        return StepResult.fromReplace(doc, this._from, this._to, this._slice);
    }

    /**
     * Get the step map that represents the changes made by this step.
     *
     * @returns A step map describing the position changes.
     */
    getMap(): StepMap {
        return new StepMap([this._from, this._to - this._from, this._slice.size]);
    }

    /**
     * Create an inverted version of this step that undoes the replacement.
     *
     * @param doc The document the step was applied to.
     * @returns A new step that undoes this step.
     */
    invert(doc: PmNode): ReplaceStep {
        return new ReplaceStep(this._from, this._from + this._slice.size, doc.slice(this._from, this._to));
    }

    /**
     * Map this step through a mappable object, adjusting its positions.
     *
     * @param mapping The mapping to apply.
     * @returns A new mapped step, or null if the step was entirely deleted.
     */
    map(mapping: Mappable): ReplaceStep | null {
        const from: MapResult = mapping.mapResult(this._from, 1);
        const to: MapResult = mapping.mapResult(this._to, -1);

        if (from.deletedAcross && to.deletedAcross) {
            return null;
        }

        return new ReplaceStep(from.pos, Math.max(from.pos, to.pos), this._slice, this.structure);
    }

    /**
     * Try to merge this step with another step. Returns the merged step if possible.
     *
     * @param other The step to merge with.
     * @returns A merged step if the steps can be merged, or null otherwise.
     */
    merge(other: Step): ReplaceStep | null {
        if (!(other instanceof ReplaceStep) || other.structure || this.structure) {
            return null;
        }

        if (this._from + this._slice.size === other._from && !this._slice.openEnd && !other.slice.openStart) {
            let slice: Slice;
            if (this._slice.size + other.slice.size === 0) {
                slice = Slice.empty;
            } else {
                const content: Fragment = this._slice.content.append(other.slice.content);
                slice = new Slice(content, this._slice.openStart, other.slice.openEnd);
            }

            const to: number = this._to + (other._to - other._from);
            return new ReplaceStep(this._from, to, slice, this.structure);
        } else if (other._to === this._from && !this._slice.openStart && !other.slice.openEnd) {
            let slice: Slice;
            if (this._slice.size + other.slice.size === 0) {
                slice = Slice.empty;
            } else {
                const content: Fragment = other.slice.content.append(this._slice.content);
                slice = new Slice(content, other.slice.openStart, this._slice.openEnd);
            }

            return new ReplaceStep(other._from, this._to, slice, this.structure);
        } else {
            return null;
        }
    }

    /**
     * Create a JSON-serializable representation of this step.
     *
     * @returns The JSON representation of this step.
     */
    toJSON(): ReplaceStepJSON {
        const json: ReplaceStepJSON = {
            stepType: 'replace',
            from: this._from,
            to: this._to
        };

        if (this._slice.size) {
            json.slice = this._slice.toJSON();
        }

        if (this.structure) {
            json.structure = true;
        }
        return json;
    }
}

Step.registerStep('replace', ReplaceStep);
