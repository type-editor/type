import type {Mappable, PmStep, StepJSON} from '@type-editor/editor-types';
import {Fragment, type PmNode, type Schema} from '@type-editor/model';

import {StepMap} from '../change-map/StepMap';
import type {StepResult} from './StepResult';


export interface StepImplementation {
    fromJSON(schema: Schema, json: StepJSON): Step;
}

/**
 * A step object represents an atomic change. It generally applies
 * only to the document it was created for, since the positions
 * stored in it will only make sense for that document.
 *
 * New steps are defined by creating classes that extend `Step`,
 * overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
 * methods, and registering your class with a unique
 * JSON-serialization identifier using
 * [`Step.jsonID`](#transform.Step^jsonID).
 */
export abstract class Step implements PmStep {

    private static readonly STEP_IMPLEMENTATIONS = new Map<string, StepImplementation>();

    /**
     * Deserialize a step from its JSON representation. Will call
     * through to the step class' own implementation of this method.
     *
     * @param schema - The schema to use for deserialization.
     * @param json - The JSON representation of the step.
     * @returns The deserialized step.
     * @throws {RangeError} If the JSON is invalid or the step type is not registered.
     */
    public static fromJSON(schema: Schema, json: StepJSON): Step {
        if (!schema) {
            throw new RangeError('Schema is required for Step.fromJSON');
        }
        if (!json?.stepType || json.stepType === '') {
            throw new RangeError('Invalid input for Step.fromJSON: stepType is required');
        }
        const stepImplementation: StepImplementation | undefined = Step.STEP_IMPLEMENTATIONS.get(json.stepType);
        if (!stepImplementation) {
            throw new RangeError(`No step type ${json.stepType} defined`);
        }

        return stepImplementation.fromJSON(schema, json);
    }

    /**
     * To be able to serialize steps to JSON, each step needs a string
     * ID to attach to its JSON representation. Use this method to
     * register an ID for your step classes. Try to pick something
     * that's unlikely to clash with steps from other modules.
     *
     * @param jsonId
     * @param stepClass - The step class with a fromJSON static method.
     * @throws {RangeError} If the ID is already registered.
     */
    public static registerStep(jsonId: string, stepClass: StepImplementation): void {
        if (Step.STEP_IMPLEMENTATIONS.has(jsonId)) {
            throw new RangeError('Duplicate use of step JSON ID ' + jsonId);
        }
        Step.STEP_IMPLEMENTATIONS.set(jsonId, stepClass);
    }

    /**
     * Applies this step to the given document, returning a result
     * object that either indicates failure, if the step can not be
     * applied to this document, or indicates success by containing a
     * transformed document.
     *
     * @param doc - The document to apply the step to.
     * @returns A StepResult indicating success or failure.
     */
    public abstract apply(doc: PmNode): StepResult;

    /**
     * Get the step map that represents the changes made by this step,
     * and which can be used to transform between positions in the old
     * and the new document.
     *
     * @returns A StepMap describing the position changes, or StepMap.empty if no changes.
     */
    public getMap(): StepMap {
        return StepMap.empty;
    }

    /**
     * Create an inverted version of this step. Needs the document as it
     * was before the step as argument.
     *
     * @param doc - The document before this step was applied.
     * @returns An inverted step that undoes this step.
     */
    public abstract invert(doc: PmNode): Step;

    /**
     * Map this step through a mappable thing, returning either a
     * version of that step with its positions adjusted, or `null` if
     * the step was entirely deleted by the mapping.
     *
     * @param mapping - The mappable object to map through.
     * @returns The mapped step, or null if the step was deleted by the mapping.
     */
    public abstract map(mapping: Mappable): Step | null;

    /**
     * Try to merge this step with another one, to be applied directly
     * after it. Returns the merged step when possible, null if the
     * steps can't be merged.
     *
     * @param _other - The step to merge with.
     * @returns The merged step, or null if the steps can't be merged.
     */
    public merge(_other: Step): Step | null {
        return null;
    }

    /**
     * Create a JSON-serializable representation of this step. When
     * defining this for a custom subclass, make sure the result object
     * includes the step type's [JSON id](#transform.Step^jsonID) under
     * the `stepType` property.
     *
     * @returns A JSON representation of this step.
     */
    public abstract toJSON(): StepJSON;

    /**
     * Recursively map over inline nodes in a fragment, applying a callback function.
     *
     * This function walks through all nodes in a fragment and its nested content,
     * applying the callback function to inline nodes. Non-inline nodes are processed
     * recursively to handle their content, but the callback is only applied to inline nodes.
     *
     * @param fragment - The fragment to map over.
     * @param callbackFunc - Function to apply to each inline node. Receives the child node,
     *                       parent node, and child index as parameters and returns a transformed node.
     * @param parent - The parent node context for the fragment.
     * @returns A new fragment with transformed nodes, preserving the structure.
     */
    protected mapFragment(fragment: Fragment,
                          callbackFunc: (child: PmNode, parent: PmNode, i: number) => PmNode,
                          parent: PmNode): Fragment {
        const mapped: Array<PmNode> = [];
        for (let i = 0; i < fragment.childCount; i++) {
            let child: PmNode = fragment.child(i);
            if (child.content.size) {
                child = child.copy(this.mapFragment(child.content, callbackFunc, child));
            }
            if (child.isInline) {
                child = callbackFunc(child, parent, i);
            }
            mapped.push(child);
        }
        return Fragment.fromArray(mapped);
    }
}
