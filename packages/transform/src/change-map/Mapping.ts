import {isUndefinedOrNull} from '@type-editor/commons';
import type {Mappable, MapResult, PmStepMap} from '@type-editor/editor-types';

import {PmMapResult} from './PmMapResult';


/**
 * A mapping represents a pipeline of zero or more [step maps](#transform.StepMap).
 *
 * Mappings are used to track how positions in a document change as transformations
 * are applied. They have special provisions for losslessly handling mapping positions
 * through a series of steps in which some steps are inverted versions of earlier steps.
 * This is essential for '[rebasing](/docs/guide/#transform.rebasing)' steps in
 * collaborative editing or history management scenarios.
 *
 * @example
 * ```typescript
 * // Create a mapping with step maps
 * const mapping = new Mapping();
 * mapping.appendMap(new StepMap([2, 0, 4])); // Insert 4 chars at position 2
 *
 * // Map a position through the transformation
 * const newPos = mapping.map(5); // Returns 9 (5 + 4)
 *
 * // Handle mirrored steps (undo/redo)
 * mapping.appendMap(deleteStep, 0); // Mirror with first step
 * ```
 */
export class Mapping implements Mappable {

    /**
     * Indicates whether this mapping owns its internal data arrays.
     *
     * - `false`: The `_maps` and `_mirror` arrays are shared references that should not be mutated.
     *   This happens when arrays are passed to the constructor.
     * - `true`: The arrays are owned by this instance and can be safely modified.
     *   Set to `true` when modifications are made (e.g., in `appendMap`).
     */
    private ownData: boolean;

    /**
     * Array storing pairs of mirrored step map indices.
     *
     * Mirror relationships are stored as consecutive pairs: `[offset1, mirrorOffset1, offset2, mirrorOffset2, ...]`.
     * Each pair indicates that the step map at one index is the inverse of the step map at the other index.
     * This is used for recovery when mapping through deleted positions - if a position is deleted by one
     * step and its mirror can undo that deletion, the mapping can recover the position correctly.
     */
    private _mirror?: Array<number>;

    /**
     * The starting position in the `_maps` array for mapping operations.
     *
     * When `map()` or `mapResult()` is called, only step maps from index `from` to `to` are applied.
     * This allows creating slices of a mapping without copying the underlying arrays.
     */
    private readonly _from: number;

    /**
     * The end position (exclusive) in the `_maps` array for mapping operations.
     *
     * When `map()` or `mapResult()` is called, only step maps from index `from` to `to` are applied.
     * This is updated when new maps are appended via `appendMap()`.
     */
    private _to: number;

    /**
     * The array of step maps in this mapping.
     *
     * Each step map represents a single document transformation and provides
     * position mapping through that transformation. The maps are applied in
     * sequence when mapping positions.
     */
    private _maps: Array<PmStepMap>;

    /**
     * Create a new mapping with the given position maps.
     *
     * @param maps - Optional array of step maps to include in this mapping. If provided, the array
     *               is copied (not shared) to allow safe modification. If omitted, creates an empty mapping.
     * @param mirror - Optional array of mirrored step map index pairs stored as consecutive values:
     *                 `[index1, mirrorIndex1, index2, mirrorIndex2, ...]`. Each pair indicates that
     *                 the step maps at those indices are inverses of each other.
     * @param from - The starting position in the `maps` array, used when `map` or `mapResult` is called.
     *               Defaults to 0. Allows creating a mapping slice that only applies a subset of maps.
     * @param to - The end position (exclusive) in the `maps` array. Defaults to `maps.length`.
     *             Only maps in the range `[from, to)` are applied during mapping operations.
     *
     * @example
     * ```typescript
     * // Create an empty mapping
     * const mapping1 = new Mapping();
     *
     * // Create with initial step maps
     * const mapping2 = new Mapping([stepMap1, stepMap2]);
     *
     * // Create a slice that only uses the second map
     * const mapping3 = new Mapping([stepMap1, stepMap2], undefined, 1, 2);
     * ```
     */
    constructor(maps?: ReadonlyArray<PmStepMap>,
                mirror?: Array<number>,
                from = 0,
                to?: number) {
        this._maps = maps ? Array.from(maps) : [];
        this.ownData = !(maps || mirror);
        this._mirror = mirror;
        this._from = from;
        this._to = isUndefinedOrNull(to) ? (maps ? maps.length : 0) : to;
    }

    /**
     * Returns the step maps in this mapping.
     *
     * This provides access to all step maps in the mapping, not just those in the
     * active range defined by `from` and `to`. The returned array is read-only to
     * prevent external modifications. Use `appendMap()` to add new maps.
     *
     * @returns A read-only array of step maps representing the transformation pipeline.
     */
    get maps(): ReadonlyArray<PmStepMap> {
        return this._maps;
    }

    /**
     * Returns the starting position in the `maps` array.
     *
     * When `map()` or `mapResult()` is called, only step maps from index `from` to `to` are applied.
     * This allows creating slices of a mapping without copying the underlying arrays.
     *
     * @returns The starting index for mapping operations.
     */
    get from(): number {
        return this._from;
    }

    /**
     * Returns the end position (exclusive) in the `maps` array.
     *
     * When `map()` or `mapResult()` is called, only step maps from index `from` to `to` are applied.
     * This is updated when new maps are appended via `appendMap()`.
     *
     * @returns The ending index for mapping operations.
     */
    get to(): number {
        return this._to;
    }

    /**
     * Create a mapping that maps only through a part of this one.
     *
     * This creates a new mapping that shares the same underlying step map array
     * but operates on a different range. This is efficient as it doesn't copy
     * the maps themselves, only creates a new view into them.
     *
     * @param from - The starting index (inclusive) of the slice range. Defaults to 0.
     * @param to - The ending index (exclusive) of the slice range. Defaults to `this.maps.length`.
     * @returns A new Mapping that only maps through step maps in the range `[from, to)`.
     *
     * @example
     * ```typescript
     * const mapping = new Mapping([map1, map2, map3, map4]);
     * // Create a slice that only uses map2 and map3
     * const sliced = mapping.slice(1, 3);
     * ```
     */
    public slice(from = 0, to: number = this.maps.length): Mapping {
        return new Mapping(this._maps, this._mirror, from, to);
    }

    /**
     * Add a step map to the end of this mapping.
     *
     * If the mapping doesn't own its data arrays (when created with shared arrays),
     * this method will first copy them to ensure safe modification. The `to` index
     * is automatically updated to reflect the new length.
     *
     * @param map - The step map to append to this mapping.
     * @param mirrors - Optional index of the step map that is the mirror (inverse) of the one
     *                  being added. When provided, establishes a mirror relationship that allows
     *                  position recovery when mapping through deleted content. The mirror index
     *                  refers to a position in the current maps array.
     *
     * @example
     * ```typescript
     * const mapping = new Mapping();
     * const deleteMap = new StepMap([2, 4, 0]); // Delete 4 chars at pos 2
     * mapping.appendMap(deleteMap);
     *
     * const insertMap = new StepMap([2, 0, 4]); // Insert 4 chars at pos 2
     * mapping.appendMap(insertMap, 0); // Mirror with the delete at index 0
     * ```
     */
    public appendMap(map: PmStepMap, mirrors?: number): void {
        if (!this.ownData) {
            this._maps = this._maps.slice();
            this._mirror = this._mirror?.slice();
            this.ownData = true;
        }
        this._to = this._maps.push(map);
        if (!isUndefinedOrNull(mirrors)) {
            this.setMirror(this._maps.length - 1, mirrors);
        }
    }

    /**
     * Add all the step maps in a given mapping to this one, preserving mirroring information.
     *
     * This method iterates through all step maps in the provided mapping and appends them
     * to this mapping. Mirror relationships are preserved by adjusting the mirror indices
     * to account for the current size of this mapping.
     *
     * @param mapping - The mapping whose step maps should be appended. All maps and their
     *                  mirror relationships from this mapping will be added to the current mapping.
     *
     * @example
     * ```typescript
     * const mapping1 = new Mapping([map1, map2]);
     * const mapping2 = new Mapping([map3, map4]);
     * mapping1.appendMapping(mapping2); // mapping1 now contains [map1, map2, map3, map4]
     * ```
     */
    public appendMapping(mapping: Mapping): void {
        const startSize: number = this._maps.length;
        for (let i = 0; i < mapping._maps.length; i++) {
            const mirror: number = mapping.getMirror(i);
            this.appendMap(mapping._maps[i], !isUndefinedOrNull(mirror) && mirror < i ? startSize + mirror : undefined);
        }
    }

    /**
     * Finds the offset of the step map that mirrors the map at the given offset.
     *
     * Mirror relationships are established via the second argument to `appendMap()`.
     * This method searches through the `_mirror` array to find the corresponding
     * mirror index for the given offset.
     *
     * @param offset - The offset (index) of the step map to find the mirror for.
     *                 This should be a valid index in the `_maps` array.
     * @returns The offset of the mirroring step map, or `undefined` if no mirror
     *          relationship exists for the given offset.
     *
     * @example
     * ```typescript
     * const mapping = new Mapping();
     * mapping.appendMap(deleteMap);    // index 0
     * mapping.appendMap(insertMap, 0); // index 1, mirrors index 0
     * mapping.getMirror(0); // Returns 1
     * mapping.getMirror(1); // Returns 0
     * ```
     */
    public getMirror(offset: number): number | undefined {
        if (this._mirror) {
            for (let i = 0; i < this._mirror.length; i++) {
                if (this._mirror[i] === offset) {
                    return this._mirror[i + (i % 2 ? -1 : 1)];
                }
            }
        }
        return undefined;
    }

    /**
     * Register a mirroring relationship between two step maps.
     *
     * This indicates that the step map at `mirrorOffset` is the inverse of the step map
     * at `offset`. Mirror relationships are bidirectional - if A mirrors B, then B mirrors A.
     * This information is used during position mapping to recover positions that would
     * otherwise be lost when mapping through deleted content.
     *
     * @param offset - The offset (index) of the first step map in the mirror relationship.
     * @param mirrorOffset - The offset (index) of the mirroring step map. This step map
     *                       should be the inverse operation of the step map at `offset`.
     *
     * @example
     * ```typescript
     * const mapping = new Mapping();
     * mapping.appendMap(deleteMap);    // index 0
     * mapping.appendMap(insertMap);    // index 1
     * mapping.setMirror(0, 1);         // Establish mirror relationship
     * // Now getMirror(0) returns 1, and getMirror(1) returns 0
     * ```
     */
    public setMirror(offset: number, mirrorOffset: number): void {
        if (!this._mirror) {
            this._mirror = [];
        }
        this._mirror.push(offset, mirrorOffset);
    }

    /**
     * Create an inverted version of this mapping.
     *
     * The inverted mapping contains the same step maps in reverse order, with each
     * step map inverted. This allows mapping positions backward through a series of
     * transformations. Mirror relationships are preserved in the inverted mapping.
     *
     * @returns A new Mapping that is the inverse of this one, which can be used to
     *          map positions from the transformed document back to the original.
     *
     * @example
     * ```typescript
     * const mapping = new Mapping();
     * mapping.appendMap(new StepMap([2, 0, 4])); // Insert 4 chars at pos 2
     * const inverted = mapping.invert();
     *
     * const pos = mapping.map(5);     // Returns 9
     * const original = inverted.map(pos); // Returns 5 (back to original)
     * ```
     */
    public invert(): Mapping {
        const inverse = new Mapping();
        inverse.appendMappingInverted(this);
        return inverse;
    }

    /**
     * Map a position through this mapping.
     *
     * Applies all step maps in the active range (from `from` to `to`) in sequence
     * to transform the position. If mirror relationships exist, uses the more complex
     * `_map()` method for recovery. Otherwise, uses a simple sequential mapping.
     *
     * @param pos - The position to map through the transformation pipeline.
     * @param assoc - The association side determining behavior at insertion boundaries.
     *                Use `-1` to associate with the left side (position stays before insertions),
     *                or `1` to associate with the right side (position moves after insertions).
     *                Defaults to `1`.
     * @returns The mapped position after applying all transformations in the range.
     *
     * @example
     * ```typescript
     * const mapping = new Mapping([new StepMap([2, 0, 4])]); // Insert 4 at pos 2
     * mapping.map(5, 1);  // Returns 9 (5 + 4)
     * mapping.map(2, 1);  // Returns 6 (after insertion)
     * mapping.map(2, -1); // Returns 2 (before insertion)
     * ```
     */
    public map(pos: number, assoc = 1): number {
        if (this._mirror && this._mirror.length > 0) {
            return this._map(pos, assoc, true) as number;
        }
        for (let i = this._from; i < this._to; i++) {
            pos = this._maps[i].map(pos, assoc);
        }
        return pos;
    }

    /**
     * Map a position through this mapping, returning a MapResult with detailed information.
     *
     * Unlike the simple `map()` method, this returns a MapResult object that includes
     * information about whether content was deleted at the mapped position and provides
     * recovery values for handling mirrored steps.
     *
     * @param pos - The position to map through the transformation pipeline.
     * @param assoc - The association side determining behavior at insertion boundaries.
     *                Use `-1` to associate with the left side (position stays before insertions),
     *                or `1` to associate with the right side (position moves after insertions).
     *                Defaults to `1`.
     * @returns A MapResult object containing:
     *          - `pos`: The mapped position
     *          - `delInfo`: Bitwise flags indicating deletion information
     *          - `deleted`, `deletedBefore`, `deletedAfter`, `deletedAcross`: Boolean flags
     *          - `recover`: Recovery value for mirrored steps (if applicable)
     *
     * @example
     * ```typescript
     * const mapping = new Mapping([new StepMap([2, 4, 0])]); // Delete 4 chars at pos 2
     * const result = mapping.mapResult(4, 1);
     * console.log(result.pos);     // Mapped position
     * console.log(result.deleted); // true if position was deleted
     * ```
     */
    public mapResult(pos: number, assoc = 1): MapResult {
        return this._map(pos, assoc, false) as MapResult;
    }

    /**
     * Append the inverted version of the given mapping to this one.
     *
     * The inverted maps are added in reverse order with mirroring relationships preserved.
     * This is used internally by the `invert()` method to create an inverted mapping.
     * Mirror indices are adjusted to account for the combined size of both mappings.
     *
     * @param mapping - The mapping to invert and append. Its step maps will be inverted
     *                  and added in reverse order to this mapping.
     */
    private appendMappingInverted(mapping: Mapping): void {
        const totalSize: number = this._maps.length + mapping._maps.length;
        for (let i = mapping.maps.length - 1; i >= 0; i--) {
            const mirror: number = mapping.getMirror(i);
            this.appendMap(mapping._maps[i].invert(), !isUndefinedOrNull(mirror) && mirror > i ? totalSize - mirror - 1 : undefined);
        }
    }

    /**
     * Internal mapping implementation that handles recovery through mirrored steps.
     *
     * This method provides the core mapping logic with mirror recovery support. When a position
     * is deleted by a step and that step has a mirror relationship, the method uses the recovery
     * value to map through the mirrored step instead, allowing lossless position tracking through
     * inverted operations. This is essential for collaborative editing and undo/redo functionality.
     *
     * @param pos - The position to map through the transformation pipeline.
     * @param assoc - The association side determining behavior at insertion boundaries.
     *                `-1` associates with the left side, `1` with the right side.
     * @param simple - Control flag for return type:
     *                 - `true`: Returns only the mapped position as a number (for `map()` method)
     *                 - `false`: Returns a full MapResult with deletion info (for `mapResult()` method)
     * @returns Either a number (if `simple` is true) or an IMapResult object (if `simple` is false).
     *          The MapResult includes the mapped position, deletion flags, and recovery information.
     */
    private _map(pos: number, assoc: number, simple: boolean): number | MapResult {
        let delInfo = 0;

        for (let i = this._from; i < this._to; i++) {
            const map: PmStepMap = this._maps[i];
            const result: MapResult = map.mapResult(pos, assoc);
            if (!isUndefinedOrNull(result.recover)) {
                const corr: number = this.getMirror(i);
                if (!isUndefinedOrNull(corr) && corr > i && corr < this._to) {
                    i = corr;
                    pos = this._maps[corr].recover(result.recover);
                    continue;
                }
            }

            delInfo |= result.delInfo;
            pos = result.pos;
        }

        return simple ? pos : new PmMapResult(pos, delInfo, null);
    }
}
