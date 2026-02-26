import type {AttrValue, Mappable} from '@type-editor/editor-types';
import type {AttrsObject, Schema} from '@type-editor/model';
import {type PmNode} from '@type-editor/model';

import {StepMap} from '../change-map/StepMap';
import type {AttrStepJson} from '../types/json/AttrStepJson';
import {Step} from './Step';
import {StepResult} from './StepResult';


/**
 * A document attribute step represents an update to an attribute
 * of the document node itself (rather than a node within the document).
 *
 * This step type is used to modify document-level attributes such as metadata
 * or configuration settings without affecting the document's content structure.
 *
 * @example
 * ```typescript
 * // Create a step that sets the 'language' attribute on the document node
 * const step = new DocAttrStep('language', 'en-US');
 * ```
 */
export class DocAttrStep extends Step {

    /** The name of the document attribute to modify. */
    private readonly attr: string;
    /** The new value to set for the document attribute. */
    private readonly value: AttrValue;

    /**
     * Construct a document attribute step.
     *
     * @param attr - The name of the document attribute to set.
     * @param value - The attribute's new value (string, number, boolean, null, or undefined).
     */
    constructor(attr: string, value: AttrValue) {
        super();
        this.attr = attr;
        this.value = value;
    }

    /**
     * Deserialize a document attribute step from its JSON representation.
     *
     * This method validates that the JSON contains a valid attribute name.
     * The attribute name must be a non-empty string.
     *
     * @param _schema - The schema (not used but required by the Step interface).
     * @param json - The JSON representation of the step containing attr and value properties.
     * @returns A new DocAttrStep instance constructed from the JSON data.
     * @throws {RangeError} When the JSON is invalid or attribute name is empty.
     */
    public static fromJSON(_schema: Schema, json: AttrStepJson): DocAttrStep {
        if (typeof json.attr !== 'string') {
            throw new RangeError('Invalid input for DocAttrStep.fromJSON');
        }
        if (json.attr.length === 0) {
            throw new RangeError('Attribute name in DocAttrStep.fromJSON cannot be empty');
        }
        return new DocAttrStep(json.attr, json.value);
    }

    /**
     * Apply this step to a document, modifying an attribute of the document node itself.
     *
     * Creates a new version of the document with the updated attribute value while
     * preserving all other attributes, content, and marks. This operates at the
     * document level rather than on nodes within the document.
     *
     * @param doc - The document to apply the step to.
     * @returns A StepResult with the updated document (always succeeds for valid documents).
     */
    apply(doc: PmNode): StepResult {
        const attrs: AttrsObject = Object.create(null) as AttrsObject;
        for (const name in doc.attrs) {
            attrs[name] = doc.attrs[name];
        }

        attrs[this.attr] = this.value;
        const updated: PmNode = doc.type.create(attrs, doc.content, doc.marks);
        return StepResult.ok(updated);
    }

    /**
     * Get the step map for this step.
     *
     * Document attribute changes don't affect document positions or structure,
     * so this returns an empty map indicating no position mapping is needed.
     *
     * @returns An empty StepMap indicating no position changes occurred.
     */
    getMap(): StepMap {
        return StepMap.empty;
    }

    /**
     * Create an inverted version of this step that undoes the document attribute change.
     *
     * This is used for undo operations. The inverted step will restore the document
     * attribute to its value before this step was applied.
     *
     * @param doc - The document before the step was applied.
     * @returns A DocAttrStep that restores the original attribute value.
     */
    invert(doc: PmNode): DocAttrStep {
        return new DocAttrStep(this.attr, doc.attrs[this.attr]);
    }

    /**
     * Map this step through a mappable object.
     *
     * Document attribute steps are not affected by position mapping since they
     * operate on the document node itself rather than positions within the document.
     * This always returns the same step unchanged.
     *
     * @param _mapping - The mappable to apply (unused for document attributes).
     * @returns This same DocAttrStep instance.
     */
    map(_mapping: Mappable): DocAttrStep {
        return this;
    }

    /**
     * Serialize this step to JSON for storage or transmission.
     *
     * The resulting JSON object can be deserialized using {@link DocAttrStep.fromJSON}.
     *
     * @returns The JSON representation of this step including stepType, attr, and value.
     */
    toJSON(): AttrStepJson {
        return {
            stepType: 'docAttr',
            attr: this.attr,
            value: this.value
        };
    }
}

Step.registerStep('docAttr', DocAttrStep);
