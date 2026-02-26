import {OrderedMap} from '@type-editor/commons';

import {Mark} from '../elements/Mark';
import type {Attrs} from '../types/schema/Attrs';
import type {MarkSpec} from '../types/schema/MarkSpec';
import {Attribute} from './Attribute';
import type {Schema} from './Schema';
import {TypeBase} from './TypeBase';


/**
 * Marks
 *
 * Like nodes, marks (which are associated with nodes to signify
 * things like emphasis or being part of a link) are
 * [tagged](#model.Mark.type) with type objects, which are
 * instantiated once per `Schema`.
 */
export class MarkType extends TypeBase {

    public static readonly ELEMENTS_ID_ATTR_NAME = 'id';

    protected excludedTypes: ReadonlyArray<MarkType>;
    private readonly instance: Mark | null;
    private readonly markTypeName: string;
    private readonly markTypeRank: number;
    private readonly markTypeSchema: Schema;
    private readonly markTypeSpec: MarkSpec;

    /**
     * Creates a new MarkType instance.
     *
     * @param name - The name of the mark type
     * @param rank - The numeric rank for ordering marks (lower ranks come first)
     * @param schema - The schema that this mark type instance is part of
     * @param spec - The specification on which the type is based
     */
    constructor(name: string, rank: number, schema: Schema, spec: MarkSpec) {
        super(name, spec.attrs);
        this.markTypeName = name;
        this.markTypeRank = rank;
        this.markTypeSchema = schema;
        this.markTypeSpec = spec;

        this.excludedTypes = [];
        const defaults: Attrs | null = this.createDefaultAttrs();
        this.instance = defaults ? new Mark(this, defaults) : null;
    }

    /**
     * The array of mark types that are excluded by this mark type.
     * By default, marks exclude themselves, preventing multiple instances of the same mark.
     */
    get excluded(): ReadonlyArray<MarkType> {
        return this.excludedTypes;
    }

    /**
     * Sets the array of mark types excluded by this mark.
     * @param value - The array of MarkType instances to exclude
     */
    set excluded(value: ReadonlyArray<MarkType>) {
        this.excludedTypes = value;
    }

    /**
     * The name of this mark type.
     */
    get name(): string {
        return this.markTypeName;
    }

    /**
     * The schema that this mark type is part of.
     */
    get schema(): Schema {
        return this.markTypeSchema;
    }

    /**
     * The spec that this mark type is based on.
     */
    get spec(): MarkSpec {
        return this.markTypeSpec;
    }

    /**
     * The numeric rank of this mark type, used for ordering marks.
     * Lower rank numbers appear first when marks are sorted.
     */
    get rank(): number {
        return this.markTypeRank;
    }

    /**
     * The attribute specifications for this mark type.
     * Contains metadata about each attribute including validation and comparison behavior.
     */
    get attributeSpecs(): Record<string, Attribute> {
        return this.attrs;
    }

    /**
     * Compiles a set of mark specifications into MarkType instances.
     * Assigns sequential rank numbers to maintain mark ordering.
     *
     * @param marks - An OrderedMap of mark specifications
     * @param schema - The schema these mark types belong to
     * @returns A record mapping mark names to MarkType instances
     */
    public static compile(marks: OrderedMap<MarkSpec>, schema: Schema): Record<string, MarkType> {
        const result = Object.create(null) as Record<string, MarkType>;
        let rank = 0;
        marks.forEach((name: string, spec: MarkSpec): MarkType => {
            result[name] = new MarkType(name, rank++, schema, spec);
            return result[name];
        });
        return result;
    }

    /**
     * Creates a mark of this type with the specified attributes.
     * Attributes are merged with defaults. Returns a cached instance if possible.
     *
     * @param attrs - Attribute values for the mark, or null to use all defaults
     * @returns A Mark instance
     */
    public create(attrs: Attrs | null = null): Mark {
        if (!attrs && this.instance) {
            return this.instance;
        }
        return new Mark(this, this.computeAttributes(attrs));
    }

    /**
     * Removes all marks of this type from the given set.
     * Returns a new array without marks of this type, or the original if none found.
     *
     * @param set - The array of marks to filter
     * @returns A new array without marks of this type
     */
    public removeFromSet(set: ReadonlyArray<Mark>): ReadonlyArray<Mark> {
        let result: Array<Mark> | null = null;

        for (let i = 0; i < set.length; i++) {
            if (set[i].type === this) {
                if (!result) {
                    // Create a new array with all elements before this index
                    result = [...set.slice(0, i)];
                }
                // Skip this element (don't add it to result)
            } else if (result) {
                // If we've started building a result array, add this element
                result.push(set[i]);
            }
        }

        return result ?? set;
    }

    /**
     * Searches for a mark of this type in the given set.
     *
     * @param set - The array of marks to search
     * @returns The first mark of this type found, or undefined if none exists
     */
    public isInSet(set: ReadonlyArray<Mark>): Mark | undefined {
        for (const item of set) {
            if (item.type === this) {
                return item;
            }
        }
    }

    /**
     * Validates attributes for this mark type.
     *
     * @param attrs - The attributes to validate
     * @throws {RangeError} If any attribute is invalid
     */
    public checkAttrs(attrs: Attrs): void {
        this.checkAttributes(attrs, 'mark');
    }

    /**
     * Checks whether the given mark type is excluded by this one.
     * Based on the excludes specification in the mark's schema spec.
     *
     * @param other - The mark type to check exclusion for
     * @returns True if the other mark type is excluded by this one
     */
    public excludes(other: MarkType): boolean {
        return this.excludedTypes.includes(other);
    }
}
