import type {StepJSON} from '@type-editor/editor-types';

/**
 * JSON representation of an attribute step used for serialization and deserialization.
 * Extends the base StepJSON interface with attribute-specific properties.
 */
export interface AttrStepJson extends StepJSON {
    /** The name of the attribute being modified. Required for deserialization. */
    attr?: string;
    /** The new value to set for the attribute. Can be any valid AttrValue type. */
    value?: string | number | boolean | null | undefined;
}
