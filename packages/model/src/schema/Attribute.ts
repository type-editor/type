import {hasOwnProperty, isUndefinedOrNull} from '@type-editor/commons';

import type {PmAttributeSpec} from '../types/schema/PmAttributeSpec';


/**
 * Represents an attribute descriptor for node and mark types.
 * Encapsulates attribute metadata including default values and validation logic.
 */
export class Attribute {

    private readonly hasDefaultValue: boolean;
    private readonly defaultValue: string | number | boolean | null | undefined;
    private readonly validateFunc?: ((value: string | number | boolean | null | undefined) => void);
    private readonly excludeFromMarkup: boolean;

    /**
     * Creates a new Attribute descriptor.
     *
     * @param typeName - The name of the type this attribute belongs to
     * @param attrName - The name of this attribute
     * @param options - The attribute specification from the schema
     */
    constructor(typeName: string, attrName: string, options: PmAttributeSpec) {
        this.hasDefaultValue = hasOwnProperty(options, 'default');
        this.defaultValue = options.default;
        this.validateFunc = typeof options.validate === 'string' ? this.validateType(typeName, attrName, options.validate) : options.validate;
        this.excludeFromMarkup = options.excludeFromMarkupComparison ?? false;
    }

    /**
     * Indicates whether this attribute is required (has no default value).
     */
    get isRequired(): boolean {
        return !this.hasDefaultValue;
    }

    /**
     * The default value for this attribute, or undefined if no default exists.
     */
    get default(): string | number | boolean | null | undefined {
        return this.defaultValue;
    }

    /**
     * Indicates whether this attribute has a default value.
     */
    get hasDefault(): boolean {
        return this.hasDefaultValue;
    }

    /**
     * The validation function for this attribute, if any.
     */
    get validate(): ((value: string | number | boolean | null | undefined) => void) | undefined {
        return this.validateFunc;
    }

    /**
     * Indicates whether this attribute should be excluded from markup comparison.
     */
    get excludeFromMarkupComparison(): boolean {
        return this.excludeFromMarkup;
    }

    /**
     * Creates a type validation function from a type specification string.
     * Supports pipe-separated type unions (e.g., "string|number").
     *
     * @param typeName - The name of the type this attribute belongs to
     * @param attrName - The name of this attribute
     * @param type - The type specification string
     * @returns A validation function that checks the attribute value's type
     */
    private validateType(typeName: string, attrName: string, type: string): (value: string | number | boolean | null | undefined) => void {
        const types: Array<string> = type.split('|');

        return (value: string | number | boolean | null | undefined) => {

            const name: string = isUndefinedOrNull(value) ? 'null' : typeof value;
            if (!types.includes(name)) {
                throw new RangeError(`Expected value of type ${types.toString()} for attribute ${attrName} on type ${typeName}, got ${name}`);
            }

        };
    }
}
