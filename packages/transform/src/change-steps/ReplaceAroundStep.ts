import {isTrue} from '@type-editor/commons';
import type {Mappable, MapResult} from '@type-editor/editor-types';
import {type PmNode, type Schema, Slice} from '@type-editor/model';

import {StepMap} from '../change-map/StepMap';
import type {ReplaceAroundStepJSON} from '../types/json/ReplaceAroundStepJSON';
import {AbstractReplaceStep} from './AbstractReplaceStep';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * Replace a part of the document with a slice of content, but
 * preserve a range of the replaced content by moving it into the
 * slice.
 */
export class ReplaceAroundStep extends AbstractReplaceStep {

    private readonly from: number;
    private readonly to: number;
    private readonly gapFrom: number;
    private readonly gapTo: number;
    private readonly slice: Slice;
    private readonly insert: number;
    private readonly structure: boolean;


    /**
     * Create a replace-around step with the given range and gap.
     * `insert` should be the point in the slice into which the content
     * of the gap should be moved. `structure` has the same meaning as
     * it has in the [`ReplaceStep`](#transform.ReplaceStep) class.
     *
     * @param from The start position of the replaced range.
     * @param to The end position of the replaced range.
     * @param gapFrom The start of preserved range.
     * @param gapTo The end of preserved range.
     * @param slice The slice to insert.
     * @param insert The position in the slice where the preserved range should be inserted.
     * @param structure When true, the step will fail if the content around the gap is not just a sequence of closing and opening tokens.
     */
    constructor(from: number,
                to: number,
                gapFrom: number,
                gapTo: number,
                slice: Slice,
                insert: number,
                structure = false) {
        super();
        this.from = from;
        this.to = to;
        this.gapFrom = gapFrom;
        this.gapTo = gapTo;
        this.slice = slice;
        this.insert = insert;
        this.structure = structure;
    }

    /**
     * Deserialize a replace-around step from its JSON representation.
     *
     * @param schema The schema to use for deserializing the slice.
     * @param json The JSON representation of the step.
     * @returns A new ReplaceAroundStep instance.
     */
    public static fromJSON(schema: Schema, json: ReplaceAroundStepJSON): ReplaceAroundStep {
        if (typeof json.from !== 'number'
            || typeof json.to !== 'number'
            || typeof json.gapFrom !== 'number'
            || typeof json.gapTo !== 'number'
            || typeof json.insert !== 'number') {
            throw new RangeError('Invalid input for ReplaceAroundStep.fromJSON');
        }

        const slice: Slice = Slice.fromJSON(schema, json.slice);
        return new ReplaceAroundStep(json.from, json.to, json.gapFrom, json.gapTo, slice, json.insert, isTrue(json.structure));
    }

    /**
     * Apply this step to the given document, returning a result object.
     *
     * @param doc The document to apply the step to.
     * @returns The result of applying the step.
     */
    apply(doc: PmNode): StepResult {
        if (this.structure
            && (this.contentBetween(doc, this.from, this.gapFrom)
                || this.contentBetween(doc, this.gapTo, this.to))) {
            return StepResult.fail('Structure gap-replace would overwrite content');
        }

        const gap: Slice = doc.slice(this.gapFrom, this.gapTo);
        if (gap.openStart || gap.openEnd) {
            return StepResult.fail('Gap is not a flat range');
        }

        const inserted: Slice = this.slice.insertAt(this.insert, gap.content);
        if (!inserted) {
            return StepResult.fail('Content does not fit in gap');
        }

        return StepResult.fromReplace(doc, this.from, this.to, inserted);
    }

    /**
     * Get the step map that represents the changes made by this step.
     *
     * @returns A step map describing the position changes.
     */
    getMap(): StepMap {
        return new StepMap([
            this.from,
            this.gapFrom - this.from,
            this.insert,
            this.gapTo,
            this.to - this.gapTo,
            this.slice.size - this.insert
        ]);
    }

    /**
     * Create an inverted version of this step that undoes the replace-around operation.
     *
     * @param doc The document the step was applied to.
     * @returns A new step that undoes this step.
     */
    invert(doc: PmNode): ReplaceAroundStep {
        const gap: number = this.gapTo - this.gapFrom;

        return new ReplaceAroundStep(
            this.from,
            this.from + this.slice.size + gap,
            this.from + this.insert,
            this.from + this.insert + gap,
            doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
            this.gapFrom - this.from,
            this.structure
        );
    }

    /**
     * Map this step through a mappable object, adjusting its positions.
     *
     * @param mapping The mapping to apply.
     * @returns A new mapped step, or null if the step was entirely deleted or became invalid.
     */
    map(mapping: Mappable): ReplaceAroundStep | null {
        const from: MapResult = mapping.mapResult(this.from, 1);
        const to: MapResult = mapping.mapResult(this.to, -1);

        let gapFrom: number;
        if (this.from === this.gapFrom) {
            gapFrom = from.pos;
        } else {
            gapFrom = mapping.map(this.gapFrom, -1);
        }

        let gapTo: number;
        if (this.to === this.gapTo) {
            gapTo = to.pos;
        } else {
            gapTo = mapping.map(this.gapTo, 1);
        }

        if ((from.deletedAcross && to.deletedAcross)
            || gapFrom < from.pos
            || gapTo > to.pos) {
            return null;
        }
        return new ReplaceAroundStep(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
    }

    /**
     * Create a JSON-serializable representation of this step.
     *
     * @returns The JSON representation of this step.
     */
    toJSON(): ReplaceAroundStepJSON {
        const json: ReplaceAroundStepJSON = {
            stepType: 'replaceAround',
            from: this.from,
            to: this.to,
            gapFrom: this.gapFrom,
            gapTo: this.gapTo,
            insert: this.insert
        };

        if (this.slice.size) {
            json.slice = this.slice.toJSON();
        }

        if (this.structure) {
            json.structure = true;
        }
        return json;
    }
}

Step.registerStep('replaceAround', ReplaceAroundStep);
