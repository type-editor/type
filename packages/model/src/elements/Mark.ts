import {isUndefinedOrNull} from '@type-editor/commons';

import type {MarkType} from '../schema/MarkType';
import type {Schema} from '../schema/Schema';
import type {MarkJSON} from '../types/elements/MarkJSON';
import type {PmElement} from '../types/elements/PmElement';
import type {Attrs} from '../types/schema/Attrs';
import {ElementType} from './ElementType';
import {compareDeep} from './util/compare-deep';


/**
 * A mark is a piece of information that can be attached to a node,
 * such as it being emphasized, in code font, or a link. It has a
 * type and optionally a set of attributes that provide further
 * information (such as the target of the link). Marks are created
 * through a `Schema`, which controls which types exist and which
 * attributes they have.
 */
export class Mark implements PmElement {

    /**
     * The empty set of marks. This is a frozen, shared instance
     * that can be used anywhere an empty mark set is needed.
     */
    public static readonly none: ReadonlyArray<Mark> = Object.freeze(new Array<Mark>());

    private readonly _type: MarkType;
    private readonly _attrs: Attrs;

    /**
     * Create a mark of the given type, with the given attributes.
     *
     * @param type The type of this mark.
     * @param attrs The attributes associated with this mark.
     */
    constructor(type: MarkType, attrs: Attrs) {
        this._type = type;
        this._attrs = attrs;
    }

    get elementType(): ElementType {
        return ElementType.Mark;
    }

    get type(): MarkType {
        return this._type;
    }

    get attrs(): Attrs {
        return this._attrs;
    }

    /**
     * Type guard to check if a value is a Mark.
     *
     * @param value The value to check for Mark type.
     * @returns True if the value is a Node instance (elementType is 'Mark').
     * @private
     */
    public static isMark(value: unknown): value is Mark {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && (value.elementType === ElementType.Mark);
    }

    /**
     * Deserialize a mark from its JSON representation.
     *
     * @param schema The schema to use for deserializing the mark.
     * @param json The JSON object representing the mark.
     * @returns A new Mark instance.
     * @throws {RangeError} If the JSON is invalid or the mark type doesn't exist in the schema.
     */
    public static fromJSON(schema: Schema, json: MarkJSON): Mark {
        if (!json) {
            throw new RangeError('Invalid input for Mark.fromJSON: json parameter is required');
        }

        const type: MarkType | undefined = schema.marks[json.type];
        if (!type) {
            throw new RangeError(
                `There is no mark type "${json.type}" in this schema. ` +
                `Available mark types: ${Object.keys(schema.marks).join(', ')}`
            );
        }

        const mark: Mark = type.create(json.attrs);
        type.checkAttrs(mark.attrs);
        return mark;
    }

    /**
     * Test whether two sets of marks are identical. Two mark sets are considered
     * identical if they have the same length and contain equivalent marks at each position.
     *
     * @param a The first mark set to compare.
     * @param b The second mark set to compare.
     * @returns `true` if the mark sets are identical, `false` otherwise.
     */
    public static sameSet(a: ReadonlyArray<Mark>, b: ReadonlyArray<Mark>): boolean {
        if (a === b) {
            return true;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].eq(b[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Create a properly sorted mark set from null, a single mark, or an
     * unsorted array of marks. The marks are sorted by their type's rank.
     *
     * @param marks A single mark, an array of marks, null, or undefined.
     *              If null, undefined, or an empty array, returns {@link Mark.none}.
     * @returns A sorted, read-only array of marks.
     */
    public static setFrom(marks?: Mark | ReadonlyArray<Mark> | null): ReadonlyArray<Mark> {
        if (!marks || (Array.isArray(marks) && marks.length === 0)) {
            return Mark.none;
        }

        if (marks instanceof Mark) {
            return [marks];
        }

        const copy: Array<Mark> = marks.slice();
        copy.sort((a: Mark, b: Mark): number => a.type.rank - b.type.rank);
        return copy;
    }

    /**
     * Given a set of marks, create a new set which contains this mark as
     * well, in the right position. The marks are kept sorted by their type's rank.
     *
     * If this mark is already in the set, the original set is returned unchanged.
     * If any marks that are set to be [exclusive](#model.MarkSpec.excludes) with
     * this mark are present, those are replaced by this one. If this mark is
     * excluded by any mark in the set, the original set is returned unchanged.
     *
     * @param set The existing set of marks to add this mark to.
     * @returns A new mark set with this mark added, or the original set if no changes are needed.
     */
    public addToSet(set: ReadonlyArray<Mark>): ReadonlyArray<Mark> {
        let copy: Array<Mark> | undefined;
        let placed = false;

        for (let i = 0; i < set.length; i++) {
            const other: Mark = set[i];

            // If this mark is already in the set, return unchanged
            if (this.eq(other)) {
                return set;
            }

            // If this mark excludes the existing mark, skip it (it will be replaced)
            if (this._type.excludes(other.type)) {
                if (!copy) {
                    copy = set.slice(0, i);
                }
                // Don't add 'other' to copy - it's being excluded
            } else if (other.type.excludes(this._type)) {
                // If the existing mark excludes this mark, return unchanged
                return set;
            } else {
                // Place this mark before marks with higher rank
                if (!placed && other.type.rank > this._type.rank) {
                    if (!copy) {
                        copy = set.slice(0, i);
                    }
                    copy.push(this);
                    placed = true;
                }
                // Add the existing mark to the modified set
                if (copy) {
                    copy.push(other);
                }
            }
        }

        // If we didn't need to modify the set, clone it before adding
        if (!copy) {
            copy = set.slice();
        }

        // If we haven't placed the mark yet, add it at the end
        if (!placed) {
            copy.push(this);
        }

        return copy;
    }

    /**
     * Remove this mark from the given set, returning a new set. If this
     * mark is not in the set, the original set is returned unchanged.
     *
     * @param set The set of marks to remove this mark from.
     * @returns A new mark set without this mark, or the original set if this mark wasn't present.
     */
    public removeFromSet(set: ReadonlyArray<Mark>): ReadonlyArray<Mark> {
        for (let i = 0; i < set.length; i++) {
            if (this.eq(set[i])) {
                return [...set.slice(0, i), ...set.slice(i + 1)];
            }
        }
        return set;
    }

    /**
     * Test whether this mark is in the given set of marks.
     *
     * @param set The set of marks to search in.
     * @returns `true` if an equivalent mark is found in the set, `false` otherwise.
     */
    public isInSet(set: ReadonlyArray<Mark>): boolean {
        return set.some(mark => this.eq(mark));
    }

    /**
     * Test whether this mark has the same type and attributes as
     * another mark. Two marks are considered equal if they are the same
     * instance, or if they have the same type and deep-equal attributes.
     * Attributes marked with `excludeFromMarkupComparison` are ignored
     * during comparison.
     *
     * @param other The mark to compare with this mark.
     * @returns `true` if the marks are equivalent, `false` otherwise.
     */
    public eq(other: Mark): boolean {
        if (this === other) {return true;}
        if (!other) {return false;}
        if (this._type !== other.type) {return false;}
        return this.compareAttrsForMarkup(other.attrs);
    }

    /**
     * Compare attributes for markup comparison, excluding attributes marked with
     * excludeFromMarkupComparison.
     *
     * @param otherAttrs The attributes to compare against.
     * @returns `true` if the attributes match (excluding excluded attributes), `false` otherwise.
     * @private
     */
    private compareAttrsForMarkup(otherAttrs: Attrs): boolean {
        const thisAttrs = this._attrs;
        const typeAttrs = this._type.attributeSpecs;

        // Collect attributes that should be compared
        const attrsToCompare: Record<string, unknown> = {};
        const otherAttrsToCompare: Record<string, unknown> = {};

        for (const attrName in typeAttrs) {
            const attrSpec = typeAttrs[attrName];

            // Skip attributes marked for exclusion from markup comparison
            if (attrSpec.excludeFromMarkupComparison) {
                continue;
            }

            attrsToCompare[attrName] = thisAttrs[attrName];
            otherAttrsToCompare[attrName] = otherAttrs[attrName];
        }

        return compareDeep(attrsToCompare, otherAttrsToCompare);
    }

    /**
     * Convert this mark to a JSON-serializable representation.
     * The resulting object contains the mark type name and optionally
     * its attributes (if non-empty).
     *
     * @returns A JSON representation of this mark.
     */
    public toJSON(): MarkJSON {
        const markJson: MarkJSON = {type: this._type.name};

        // Only include attributes if they exist and are non-empty
        if (this._attrs && Object.keys(this._attrs).length > 0) {
            const attrsWithoutNullValues: Record<string, any> = {};
            let count = 0;
            for (const attrName in this._attrs) {
                if (this._attrs[attrName] !== null) {
                    count++;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    attrsWithoutNullValues[attrName] = this._attrs[attrName];
                }
            }
            if(count) {
                markJson.attrs = attrsWithoutNullValues;
            }
        }

        return markJson;
    }
}
