import { nanoid } from 'nanoid';

import type { Attrs } from '../types/schema/Attrs';
import type { NodeSpec } from '../types/schema/NodeSpec';
import type { PmAttributeSpec } from '../types/schema/PmAttributeSpec';
import { Attribute } from './Attribute';
import { MarkType } from './MarkType';


/**
 * Abstract base class for type objects (NodeType and MarkType).
 * Provides common functionality for attribute management and validation.
 */
export abstract class TypeBase {

    protected readonly attrs: Record<string, Attribute>;

    /**
     * Creates a new TypeBase instance.
     *
     * @param name - The name of the type
     * @param spec - The specification containing attribute definitions
     */
    protected constructor(name: string, spec: NodeSpec) {
        this.attrs = this.initAttrs(name, spec);
    }

    /**
     * Validates attribute values against the type's attribute specifications.
     * Throws a RangeError if any attribute is unsupported or fails validation.
     *
     * @param values - The attribute values to validate
     * @param type - The type name for error messages (e.g., 'node' or 'mark')
     * @throws {RangeError} If an unsupported attribute is found or validation fails
     */
    protected checkAttributes(values: Attrs, type: string): void {
        // Check for unsupported attributes
        for (const name in values) {
            if (!(name in this.attrs)) {
                throw new RangeError(`Unsupported attribute '${name}' for ${type}`);
            }
        }

        // Validate each attribute value
        for (const name in this.attrs) {
            const attr: Attribute = this.attrs[name];
            if (attr.validate) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const value: string | number | boolean | null | undefined = values[name];
                attr.validate(value);
            }
        }
    }

    /**
     * Creates a reusable default attributes object for types where all attributes
     * have default values. This optimization allows sharing the same object across
     * multiple instances when no custom attributes are specified.
     *
     * @returns An Attrs object with all default values, or null if any attribute
     *          lacks a default value (indicating required attributes exist)
     */
    protected createDefaultAttrs(): Attrs | null {
        const defaults = Object.create(null) as Record<string, string | number | boolean | null | undefined>;

        for (const attrName in this.attrs) {
            const attr: Attribute = this.attrs[attrName];
            // If any attribute lacks a default, we cannot create a default object
            if (!attr.hasDefault) {
                return null;
            }
            defaults[attrName] = attr.default;
        }

        return defaults as Attrs;
    }

    /**
     * Computes a complete set of attributes by merging provided values with defaults.
     * Ensures all required attributes are present and applies defaults where needed.
     *
     * @param providedAttrs - The attributes provided by the caller, or null
     * @returns A complete Attrs object with all attributes resolved
     * @throws {RangeError} If a required attribute (one without a default) is missing
     */
    protected computeAttributes(providedAttrs: Attrs | null): Attrs {
        const resolvedAttrs = Object.create(null) as Record<string, string | number | boolean | null | undefined>;

        for (const attrName in this.attrs) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let attrValue: string | number | boolean | null | undefined = providedAttrs?.[attrName];

            if (attrValue === undefined) {
                const attr: Attribute = this.attrs[attrName];
                if (attr.hasDefault) {
                    attrValue = attr.default;
                } else {
                    throw new RangeError(`No value supplied for attribute ${attrName}`);
                }
            }

            resolvedAttrs[attrName] = attrValue;
        }

        if (MarkType.ELEMENTS_ID_ATTR_NAME in this.attrs && resolvedAttrs.id === null) {
            resolvedAttrs.id = nanoid();
        }

        return resolvedAttrs as Attrs;
    }

    /**
     * Initializes attribute descriptors from the provided specification.
     * Creates Attribute objects that encapsulate validation and default values.
     *
     * @param typeName - The name of the type (used in error messages)
     * @param attrs - The attribute specifications from the schema spec
     * @returns A record mapping attribute names to Attribute descriptors
     */
    protected initAttrs(typeName: string, attrs?: Record<string, PmAttributeSpec>): Record<string, Attribute> {
        const result = Object.create(null) as Record<string, Attribute>;
        if (attrs) {
            for (const name in attrs) {
                result[name] = new Attribute(typeName, name, attrs[name]);
            }
        }
        return result;
    }
}
