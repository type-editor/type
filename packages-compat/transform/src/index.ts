/**
 * @type-editor-compat/transform
 *
 * Compatibility layer for @type-editor/transform providing ProseMirror-compatible type signatures.
 *
 * This module re-exports all classes from @type-editor/transform with augmented TypeScript types
 * that use concrete class references instead of Pm* interface types (PmStep, PmStepMap, PmStepResult).
 *
 * KEY DIFFERENCES FROM BASE MODULE:
 * - Step uses concrete Step type instead of PmStep interface
 * - StepMap uses concrete StepMap type instead of PmStepMap interface
 * - StepResult uses concrete StepResult type instead of PmStepResult interface
 * - Transform uses concrete Step, StepMap, StepResult types in all methods
 */

import type {AttrValue, MapResult, StepJSON} from '@type-editor/editor-types';
import {
    AddMarkStep as BaseAddMarkStep,
    AddNodeMarkStep as BaseAddNodeMarkStep,
    AttrStep as BaseAttrStep,
    canJoin as _canJoin,
    canSplit as _canSplit,
    DocAttrStep as BaseDocAttrStep,
    dropPoint as _dropPoint,
    findWrapping as _findWrapping,
    insertPoint as _insertPoint,
    joinPoint as _joinPoint,
    liftTarget as _liftTarget,
    Mapping as BaseMapping,
    PmMapResult,
    RemoveMarkStep as BaseRemoveMarkStep,
    RemoveNodeMarkStep as BaseRemoveNodeMarkStep,
    ReplaceAroundStep as BaseReplaceAroundStep,
    ReplaceStep as BaseReplaceStep,
    replaceStep as _replaceStep,
    Step as BaseStep,
    StepMap as BaseStepMap,
    StepResult as BaseStepResult,
    Transform as BaseTransform,
    TransformError,
} from '@type-editor/transform';
import type {
    Attrs,
    ContentMatch,
    Fragment,
    Mark,
    MarkType,
    NodeRange,
    NodeType,
    PmNode,
    Schema,
    Slice,
} from '@type-editor-compat/model';

// ============================================================================
// Mappable interface - Override with concrete types
// ============================================================================

/**
 * Mappable interface for position mapping through document transformations.
 * Used by Step and StepMap for mapping positions.
 */
export interface Mappable {
    /**
     * Map a position through this mappable object.
     * @param pos - The position to map.
     * @param assoc - Association direction: -1 for left, 1 for right (default: 1).
     * @returns The mapped position.
     */
    map(pos: number, assoc?: number): number;

    /**
     * Map a position through this mappable object, returning detailed result.
     * @param pos - The position to map.
     * @param assoc - Association direction: -1 for left, 1 for right (default: 1).
     * @returns A MapResult with mapped position and deletion information.
     */
    mapResult(pos: number, assoc?: number): MapResult;
}

// ============================================================================
// StepResult Interface - Override with concrete types
// ============================================================================

/**
 * The result of applying a step. Contains either a new document or a failure value.
 * Uses concrete PmNode type instead of interface.
 */
export interface StepResult {
    /** The transformed document, if successful. Null if failed. */
    readonly doc: PmNode | null;

    /** The failure message, if unsuccessful. Null if successful. */
    readonly failed: string | null;
}

/**
 * StepResult constructor with static factory methods.
 */
export interface StepResultConstructor {
    /**
     * Create a successful step result.
     * @param doc - The transformed document.
     * @returns A successful StepResult.
     */
    ok(doc: PmNode): StepResult;

    /**
     * Create a failed step result.
     * @param message - The failure message.
     * @returns A failed StepResult.
     */
    fail(message: string): StepResult;

    /**
     * Create a step result from replacing a range in a document.
     * @param doc - The document to transform.
     * @param from - The start position of the replacement.
     * @param to - The end position of the replacement.
     * @param slice - The slice to insert.
     * @returns A StepResult with the transformed document or failure.
     */
    fromReplace(doc: PmNode, from: number, to: number, slice: Slice): StepResult;
}

// ============================================================================
// StepMap Interface - Override with concrete types
// ============================================================================

/**
 * A map describing the deletions and insertions made by a step.
 * Used to find correspondence between positions in pre- and post-step documents.
 */
export interface StepMap extends Mappable {
    /**
     * Recover a position that was deleted by this step map.
     * @param value - The recovery value from a MapResult.
     * @returns The recovered position.
     */
    recover(value: number): number;

    /**
     * Map a position through this step map, returning detailed result.
     * @param pos - The position to map.
     * @param assoc - Association direction: -1 for left, 1 for right (default: 1).
     * @returns A MapResult with mapped position and deletion information.
     */
    mapResult(pos: number, assoc?: number): MapResult;

    /**
     * Map a position through this step map.
     * @param pos - The position to map.
     * @param assoc - Association direction: -1 for left, 1 for right (default: 1).
     * @returns The mapped position.
     */
    map(pos: number, assoc?: number): number;

    /**
     * Test whether the given position touches the range with the given recover value.
     * @param pos - The position to test.
     * @param recover - The recovery value identifying the range.
     * @returns True if the position touches the range.
     */
    touches(pos: number, recover: number): boolean;

    /**
     * Iterate over each changed range in this step map.
     * @param f - Callback receiving old and new positions for each range.
     */
    forEach(f: (oldStart: number, oldEnd: number, newStart: number, newEnd: number) => void): void;

    /**
     * Create an inverted version of this step map.
     * @returns An inverted StepMap.
     */
    invert(): StepMap;
}

/**
 * StepMap constructor with static properties.
 */
export interface StepMapConstructor {
    new(ranges: ReadonlyArray<number>, inverted?: boolean): StepMap;

    /** A StepMap that contains no changed ranges. */
    readonly empty: StepMap;

    /**
     * Create a map that moves all positions by offset n.
     * @param offset - The offset to apply (can be negative).
     * @returns A StepMap that offsets positions.
     */
    offset(offset: number): StepMap;
}

// ============================================================================
// Step Interface - Override with concrete types
// ============================================================================

/**
 * A step object represents an atomic change to a document.
 * Uses concrete StepResult and StepMap types instead of Pm* interfaces.
 */
export interface Step {
    /**
     * Apply this step to the given document, returning a result.
     * @param doc - The document to apply the step to.
     * @returns A StepResult indicating success or failure.
     */
    apply(doc: PmNode): StepResult;

    /**
     * Get the step map representing changes made by this step.
     * @returns A StepMap describing position changes.
     */
    getMap(): StepMap;

    /**
     * Create an inverted version of this step.
     * @param doc - The document before this step was applied.
     * @returns An inverted step that undoes this step.
     */
    invert(doc: PmNode): Step;

    /**
     * Map this step through a mappable transformation.
     * @param mapping - The mappable object to map through.
     * @returns The mapped step, or null if deleted by the mapping.
     */
    map(mapping: Mappable): Step | null;

    /**
     * Try to merge this step with another one.
     * @param other - The step to merge with.
     * @returns The merged step, or null if steps can't be merged.
     */
    merge(other: Step): Step | null;

    /**
     * Create a JSON-serializable representation of this step.
     * @returns A JSON representation of this step.
     */
    toJSON(): StepJSON;
}

/**
 * Step constructor with static methods.
 */
export interface StepConstructor {
    /**
     * Deserialize a step from its JSON representation.
     * @param schema - The schema to use for deserialization.
     * @param json - The JSON representation of the step.
     * @returns The deserialized step.
     */
    fromJSON(schema: Schema, json: StepJSON): Step;

    /**
     * Register a step class with a JSON ID.
     * @param jsonId - The JSON identifier for the step type.
     * @param stepClass - The step class to register.
     */
    registerStep(jsonId: string, stepClass: { fromJSON(schema: Schema, json: StepJSON): Step }): void;
}

// ============================================================================
// Mapping Interface - Override with concrete types
// ============================================================================

/**
 * A mapping represents a pipeline of step maps.
 * Uses concrete StepMap type instead of PmStepMap interface.
 */
export interface Mapping extends Mappable {
    /** The step maps in this mapping. */
    readonly maps: ReadonlyArray<StepMap>;

    /** Starting position in the `maps` array. */
    readonly from: number;

    /** End position in the `maps` array. */
    readonly to: number;

    /**
     * Create a mapping that maps in the other direction.
     * @returns An inverted Mapping.
     */
    invert(): Mapping;

    /**
     * Map a position through this mapping.
     * @param pos - The position to map.
     * @param assoc - Association direction: -1 for left, 1 for right (default: 1).
     * @returns The mapped position.
     */
    map(pos: number, assoc?: number): number;

    /**
     * Map a position through this mapping, returning detailed result.
     * @param pos - The position to map.
     * @param assoc - Association direction: -1 for left, 1 for right (default: 1).
     * @returns A MapResult with mapped position and deletion information.
     */
    mapResult(pos: number, assoc?: number): MapResult;

    /**
     * Add a step map to the end of this mapping.
     * @param map - The StepMap to append.
     * @param mirrors - Optional index of the mirror map.
     */
    appendMap(map: StepMap, mirrors?: number): void;

    /**
     * Add all the step maps in a given mapping to this one.
     * @param mapping - The Mapping to append.
     */
    appendMapping(mapping: Mapping): void;

    /**
     * Finds the offset of the step map that mirrors the map at the given offset.
     * @param n - The offset to find the mirror for.
     * @returns The mirror offset, or undefined if no mirror exists.
     */
    getMirror(n: number): number | undefined;

    /**
     * Set a mirror relationship between two step maps.
     * @param n - The first map offset.
     * @param m - The second map offset (mirror).
     */
    setMirror(n: number, m: number): void;

    /**
     * Append the inverse of the given mapping to this one.
     * @param mapping - The mapping to append the inverse of.
     */
    // appendMappingInverted(mapping: Mapping): void;

    /**
     * Create a new mapping with a subset of the maps.
     * @param from - Starting index (default: this.from).
     * @param to - Ending index (default: this.to).
     * @returns A new Mapping with the specified range.
     */
    slice(from?: number, to?: number): Mapping;
}

/**
 * Mapping constructor type.
 */
export type MappingConstructor = new (maps?: ReadonlyArray<StepMap>, mirror?: number, from?: number, to?: number) => Mapping;

// ============================================================================
// Transform Interface - Override with concrete types
// ============================================================================

/**
 * Transform interface with concrete type references instead of Pm* interfaces.
 * This ensures step(), maybeStep(), and addStep() use Step instead of PmStep,
 * and related methods use StepResult and StepMap.
 */
export interface Transform {
    /** The current document (the result of applying all steps). */
    readonly doc: PmNode;

    /** The steps in this transform. */
    readonly steps: ReadonlyArray<Step>;

    /** The documents before each of the steps. */
    readonly docs: ReadonlyArray<PmNode>;

    /** A mapping with the maps for each of the steps in this transform. */
    readonly mapping: Mapping;

    /** The starting document. */
    readonly before: PmNode;

    /** True when the document has been changed (when there are any steps). */
    readonly docChanged: boolean;

    /**
     * Apply a new step in this transform, saving the result.
     * @param step - The step to apply.
     * @returns This transform instance for chaining.
     * @throws {TransformError} When the step fails to apply.
     */
    step(step: Step): Transform;

    /**
     * Try to apply a step in this transformation, ignoring it if it fails.
     * @param step - The step to try applying.
     * @returns The result of applying the step, which may indicate failure.
     */
    maybeStep(step: Step): StepResult;

    /**
     * Add a step to the transform without applying it (assumes it has already been applied).
     * @param step - The step that was applied.
     * @param doc - The resulting document after applying the step.
     */
    addStep(step: Step, doc: PmNode): void;

    /**
     * Replace the part of the document between `from` and `to` with the given `slice`.
     * @param from - The start position of the range to replace.
     * @param to - The end position of the range to replace. Defaults to `from`.
     * @param slice - The slice to insert. Defaults to an empty slice.
     * @returns This transform instance for chaining.
     */
    replace(from: number, to?: number, slice?: Slice): Transform;

    /**
     * Replace the given range with the given content.
     * @param from - The start position of the range to replace.
     * @param to - The end position of the range to replace.
     * @param content - The content to insert (fragment, node, or array of nodes).
     * @returns This transform instance for chaining.
     */
    replaceWith(from: number, to: number, content: Fragment | PmNode | ReadonlyArray<PmNode>): Transform;

    /**
     * Delete the content between the given positions.
     * @param from - The start position of the range to delete.
     * @param to - The end position of the range to delete.
     * @returns This transform instance for chaining.
     */
    delete(from: number, to: number): Transform;

    /**
     * Insert the given content at the given position.
     * @param pos - The position at which to insert the content.
     * @param content - The content to insert (fragment, node, or array of nodes).
     * @returns This transform instance for chaining.
     */
    insert(pos: number, content: Fragment | PmNode | ReadonlyArray<PmNode>): Transform;

    /**
     * Replace a range of the document with a given slice using WYSIWYG semantics.
     * @param from - The start position (used as a hint).
     * @param to - The end position (used as a hint).
     * @param slice - The slice to insert.
     * @returns This transform instance for chaining.
     */
    replaceRange(from: number, to: number, slice: Slice): Transform;

    /**
     * Replace the given range with a node using WYSIWYG semantics.
     * @param from - The start position (used as a hint).
     * @param to - The end position (used as a hint).
     * @param node - The node to insert.
     * @returns This transform instance for chaining.
     */
    replaceRangeWith(from: number, to: number, node: PmNode): Transform;

    /**
     * Delete the given range, expanding to cover fully covered parent nodes.
     * @param from - The start position of the range to delete.
     * @param to - The end position of the range to delete.
     * @returns This transform instance for chaining.
     */
    deleteRange(from: number, to: number): Transform;

    /**
     * Lift content from the given range to the specified depth.
     * @param range - The range of content to lift.
     * @param target - The depth to lift the content to.
     * @returns This transform instance for chaining.
     */
    lift(range: NodeRange, target: number): Transform;

    /**
     * Join the blocks around the given position.
     * @param pos - The position around which to join blocks.
     * @param depth - The number of levels to join. Defaults to 1.
     * @returns This transform instance for chaining.
     */
    join(pos: number, depth?: number): Transform;

    /**
     * Wrap the given range in the given set of wrappers.
     * @param range - The range to wrap.
     * @param wrappers - The wrapper nodes to apply, with outermost first.
     * @returns This transform instance for chaining.
     */
    wrap(range: NodeRange, wrappers: ReadonlyArray<{ type: NodeType; attrs?: Attrs | null }>): Transform;

    /**
     * Set the type of all textblocks between `from` and `to`.
     * @param from - The start position of the range.
     * @param to - The end position of the range. Defaults to `from`.
     * @param type - The node type to set.
     * @param attrs - The attributes to set, or a function that computes attributes.
     * @returns This transform instance for chaining.
     */
    setBlockType(from: number, to?: number, type?: NodeType, attrs?: Attrs | null | ((oldNode: PmNode) => Attrs)): Transform;

    /**
     * Change the type, attributes, and/or marks of the node at `pos`.
     * @param pos - The position of the node to modify.
     * @param type - The new node type, or null to keep the existing type.
     * @param attrs - The new attributes, or null to keep the existing attributes.
     * @param marks - The new marks to apply to the node.
     * @returns This transform instance for chaining.
     */
    setNodeMarkup(pos: number, type?: NodeType | null, attrs?: Attrs | null, marks?: ReadonlyArray<Mark>): Transform;

    /**
     * Set a single attribute on a given node.
     * @param pos - The position of the node.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transform instance for chaining.
     */
    setNodeAttribute(pos: number, attr: string, value: AttrValue): Transform;

    /**
     * Set a single attribute on the document.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transform instance for chaining.
     */
    setDocAttribute(attr: string, value: AttrValue): Transform;

    /**
     * Add a mark to the node at position `pos`.
     * @param position - The position of the node.
     * @param mark - The mark to add.
     * @returns This transform instance for chaining.
     */
    addNodeMark(position: number, mark: Mark): Transform;

    /**
     * Remove a mark (or all marks of the given type) from the node at position `pos`.
     * @param position - The position of the node.
     * @param mark - The mark or mark type to remove.
     * @returns This transform instance for chaining.
     */
    removeNodeMark(position: number, mark: Mark | MarkType): Transform;

    /**
     * Split the node at the given position.
     * @param pos - The position at which to split.
     * @param depth - The number of levels to split. Defaults to 1.
     * @param typesAfter - Optional array of node types and attributes for split nodes.
     * @returns This transform instance for chaining.
     */
    split(pos: number, depth?: number, typesAfter?: Array<null | { type: NodeType; attrs?: Attrs | null }>): Transform;

    /**
     * Add the given mark to the inline content between `from` and `to`.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param mark - The mark to add.
     * @returns This transform instance for chaining.
     */
    addMark(from: number, to: number, mark: Mark): Transform;

    /**
     * Remove marks from inline nodes between `from` and `to`.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param mark - The mark, mark type, or null to remove all marks.
     * @returns This transform instance for chaining.
     */
    removeMark(from: number, to: number, mark?: Mark | MarkType | null): Transform;

    /**
     * Remove all marks and nodes that don't match the given parent node type.
     * @param position - The position of the parent node.
     * @param parentType - The node type to match content against.
     * @param match - Optional starting content match.
     * @returns This transform instance for chaining.
     */
    clearIncompatible(position: number, parentType: NodeType, match?: ContentMatch): Transform;
}

/**
 * Transform constructor type.
 */
export type TransformConstructor = new (doc: PmNode) => Transform;

// ============================================================================
// Concrete Step Types - Override with concrete types
// ============================================================================

/**
 * AddMarkStep interface with concrete Step types.
 */
export interface AddMarkStep extends Step {
    readonly from: number;
    readonly to: number;
    readonly mark: Mark;
}

/**
 * AddNodeMarkStep interface with concrete Step types.
 */
export interface AddNodeMarkStep extends Step {
    readonly pos: number;
    readonly mark: Mark;
}

/**
 * RemoveMarkStep interface with concrete Step types.
 */
export interface RemoveMarkStep extends Step {
    readonly from: number;
    readonly to: number;
    readonly mark: Mark;
}

/**
 * RemoveNodeMarkStep interface with concrete Step types.
 */
export interface RemoveNodeMarkStep extends Step {
    readonly pos: number;
    readonly mark: Mark;
}

/**
 * ReplaceStep interface with concrete Step types.
 */
export interface ReplaceStep extends Step {
    readonly from: number;
    readonly to: number;
    readonly slice: Slice;
    readonly structure: boolean;
}

/**
 * ReplaceAroundStep interface with concrete Step types.
 */
export interface ReplaceAroundStep extends Step {
    readonly from: number;
    readonly to: number;
    readonly gapFrom: number;
    readonly gapTo: number;
    readonly slice: Slice;
    readonly insert: number;
    readonly structure: boolean;
}

/**
 * AttrStep interface with concrete Step types.
 */
export interface AttrStep extends Step {
    readonly pos: number;
    readonly attr: string;
    readonly value: AttrValue;
}

/**
 * DocAttrStep interface with concrete Step types.
 */
export interface DocAttrStep extends Step {
    readonly attr: string;
    readonly value: AttrValue;
}

// ============================================================================
// Constructor Type Assertions
// ============================================================================

export const Step: StepConstructor = BaseStep as unknown as StepConstructor;
export const StepMap: StepMapConstructor = BaseStepMap as unknown as StepMapConstructor;
export const StepResult: StepResultConstructor = BaseStepResult as unknown as StepResultConstructor;
export const Mapping: MappingConstructor = BaseMapping as unknown as MappingConstructor;
export const Transform: TransformConstructor = BaseTransform as unknown as TransformConstructor;
export const AddMarkStep = BaseAddMarkStep as unknown as { new(from: number, to: number, mark: Mark): AddMarkStep; fromJSON(schema: Schema, json: StepJSON): AddMarkStep };
export const AddNodeMarkStep = BaseAddNodeMarkStep as unknown as { new(pos: number, mark: Mark): AddNodeMarkStep; fromJSON(schema: Schema, json: StepJSON): AddNodeMarkStep };
export const RemoveMarkStep = BaseRemoveMarkStep as unknown as { new(from: number, to: number, mark: Mark): RemoveMarkStep; fromJSON(schema: Schema, json: StepJSON): RemoveMarkStep };
export const RemoveNodeMarkStep = BaseRemoveNodeMarkStep as unknown as { new(pos: number, mark: Mark): RemoveNodeMarkStep; fromJSON(schema: Schema, json: StepJSON): RemoveNodeMarkStep };
export const ReplaceStep = BaseReplaceStep as unknown as { new(from: number, to: number, slice: Slice, structure?: boolean): ReplaceStep; fromJSON(schema: Schema, json: StepJSON): ReplaceStep };
export const ReplaceAroundStep = BaseReplaceAroundStep as unknown as { new(from: number, to: number, gapFrom: number, gapTo: number, slice: Slice, insert: number, structure?: boolean): ReplaceAroundStep; fromJSON(schema: Schema, json: StepJSON): ReplaceAroundStep };
export const AttrStep = BaseAttrStep as unknown as { new(pos: number, attr: string, value: AttrValue): AttrStep; fromJSON(schema: Schema, json: StepJSON): AttrStep };
export const DocAttrStep = BaseDocAttrStep as unknown as { new(attr: string, value: AttrValue): DocAttrStep; fromJSON(schema: Schema, json: StepJSON): DocAttrStep };
export {
    PmMapResult, TransformError,
};

// ============================================================================
// Function Exports
// Wrapper types ensure compat Node/NodeRange/NodeType/Slice flow through.
// ============================================================================

export const canJoin = _canJoin as unknown as (doc: PmNode, pos: number) => boolean;
export const canSplit = _canSplit as unknown as (doc: PmNode, pos: number, depth?: number, typesAfter?: Array<null | { type: NodeType; attrs?: Attrs | null }>) => boolean;
export const dropPoint = _dropPoint as unknown as (doc: PmNode, pos: number, slice: Slice) => number | null;
export const findWrapping = _findWrapping as unknown as (range: NodeRange, nodeType: NodeType, attrs?: Attrs | null, innerRange?: NodeRange) => Array<{ type: NodeType; attrs: Attrs | null }> | null;
export const insertPoint = _insertPoint as unknown as (doc: PmNode, pos: number, nodeType: NodeType) => number | null;
export const joinPoint = _joinPoint as unknown as (doc: PmNode, pos: number, dir?: number) => number | null;
export const liftTarget = _liftTarget as unknown as (range: NodeRange) => number | null;
export const replaceStep = _replaceStep as unknown as (doc: PmNode, from: number, to?: number, slice?: Slice) => Step | null;

// ============================================================================
// Type Re-exports
// ============================================================================

export type { Mappable as MappableType } from '@type-editor/editor-types';
export type { MapResult } from '@type-editor/editor-types';
export type { StepJSON } from '@type-editor/editor-types';

