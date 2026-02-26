import {
    type Attrs,
    type ContentMatch,
    type Fragment,
    type Mark,
    type MarkType,
    type NodeRange,
    type NodeType,
    type PmNode,
    type Slice
} from '@type-editor/model';

import type {AttrValue} from './AttrValue';
import type {PmMapping} from './PmMapping';
import type {PmStep} from './PmStep';
import type {PmStepResult} from './PmStepResult';

/**
 * Abstraction to build up and track an array of
 * [steps](#transform.Step) representing a document transformation.
 *
 * Most transforming methods return the `Transform` object itself, so
 * that they can be chained.
 */
export interface TransformDocument {
    readonly doc: PmNode;
    readonly steps: ReadonlyArray<PmStep>;
    readonly docs: ReadonlyArray<PmNode>;
    readonly mapping: PmMapping;
    readonly before: PmNode;
    readonly docChanged: boolean;

    /**
     * Apply a new step in this transform, saving the result. Throws an
     * error when the step fails.
     * @param step - The step to apply.
     * @returns This transform instance for chaining.
     * @throws {TransformError} When the step fails to apply.
     */
    step(step: PmStep): this;

    /**
     * Try to apply a step in this transformation, ignoring it if it
     * fails. Returns the step result.
     * @param step - The step to try applying.
     * @returns The result of applying the step, which may indicate failure.
     */
    maybeStep(step: PmStep): PmStepResult;

    /**
     * Add a step to the transform without applying it (assumes it has already been applied).
     * Updates the internal state to track the step and its resulting document.
     * @param step - The step that was applied.
     * @param doc - The resulting document after applying the step.
     */
    addStep(step: PmStep, doc: PmNode): void;

    /**
     * Replace the part of the document between `from` and `to` with the
     * given `slice`. No-op replacements (empty slice over empty range) are
     * silently ignored.
     * @param from - The start position of the range to replace.
     * @param to - The end position of the range to replace. Defaults to `from`.
     * @param slice - The slice to insert. Defaults to an empty slice.
     * @returns This transform instance for chaining.
     */
    replace(from: number,
            to?: number,
            slice?: Slice): this;

    /**
     * Replace the given range with the given content, which may be a
     * fragment, node, or array of nodes.
     * @param from - The start position of the range to replace.
     * @param to - The end position of the range to replace.
     * @param content - The content to insert (fragment, node, or array of nodes).
     * @returns This transform instance for chaining.
     */
    replaceWith(from: number,
                to: number,
                content: Fragment | PmNode | ReadonlyArray<PmNode>): this;

    /**
     * Delete the content between the given positions.
     * @param from - The start position of the range to delete.
     * @param to - The end position of the range to delete.
     * @returns This transform instance for chaining.
     */
    delete(from: number, to: number): this;

    /**
     * Insert the given content at the given position.
     * @param pos - The position at which to insert the content.
     * @param content - The content to insert (fragment, node, or array of nodes).
     * @returns This transform instance for chaining.
     */
    insert(pos: number,
           content: Fragment | PmNode | ReadonlyArray<PmNode>): this;

    /**
     * Replace a range of the document with a given slice, using
     * `from`, `to`, and the slice's
     * [`openStart`](#model.Slice.openStart) property as hints, rather
     * than fixed start and end points. This method may grow the
     * replaced area or close open nodes in the slice in order to get a
     * fit that is more in line with WYSIWYG expectations, by dropping
     * fully covered parent nodes of the replaced region when they are
     * marked [non-defining as
     * context](#model.NodeSpec.definingAsContext), or including an
     * open parent node from the slice that _is_ marked as [defining
     * its content](#model.NodeSpec.definingForContent).
     *
     * This is the method, for example, to handle paste. The similar
     * [`replace`](#transform.Transform.replace) method is a more
     * primitive tool which will _not_ move the start and end of its given
     * range, and is useful in situations where you need more precise
     * control over what happens.
     * @param from - The start position (used as a hint).
     * @param to - The end position (used as a hint).
     * @param slice - The slice to insert.
     * @returns This transform instance for chaining.
     */
    replaceRange(from: number, to: number, slice: Slice): this;

    /**
     * Replace the given range with a node, but use `from` and `to` as
     * hints, rather than precise positions. When from and to are the same
     * and are at the start or end of a parent node in which the given
     * node doesn't fit, this method may _move_ them out towards a parent
     * that does allow the given node to be placed. When the given range
     * completely covers a parent node, this method may completely replace
     * that parent node.
     * @param from - The start position (used as a hint).
     * @param to - The end position (used as a hint).
     * @param node - The node to insert.
     * @returns This transform instance for chaining.
     */
    replaceRangeWith(from: number, to: number, node: PmNode): this;

    /**
     * Delete the given range, expanding it to cover fully covered
     * parent nodes until a valid replace is found.
     * @param from - The start position of the range to delete.
     * @param to - The end position of the range to delete.
     * @returns This transform instance for chaining.
     */
    deleteRange(from: number, to: number): this;

    /**
     * Split the content in the given range off from its parent, if there
     * is sibling content before or after it, and move it up the tree to
     * the depth specified by `target`. You'll probably want to use
     * [`liftTarget`](#transform.liftTarget) to compute `target`, to make
     * sure the lift is valid.
     * @param range - The range of content to lift.
     * @param target - The depth to lift the content to.
     * @returns This transform instance for chaining.
     */
    lift(range: NodeRange, target: number): this;

    /**
     * Join the blocks around the given position. If depth is 2, their
     * last and first siblings are also joined, and so on.
     * @param pos - The position around which to join blocks.
     * @param depth - The number of levels to join. Defaults to 1.
     * @returns This transform instance for chaining.
     */
    join(pos: number, depth?: number): this;

    /**
     * Wrap the given [range](#model.NodeRange) in the given set of wrappers.
     * The wrappers are assumed to be valid in this position, and should
     * probably be computed with [`findWrapping`](#transform.findWrapping).
     * @param range - The range to wrap.
     * @param wrappers - The wrapper nodes to apply, with outermost first.
     * @returns This transform instance for chaining.
     */
    wrap(range: NodeRange,
         wrappers: ReadonlyArray<{ type: NodeType, attrs?: Attrs | null; }>): this;

    /**
     * Set the type of all textblocks (partly) between `from` and `to` to
     * the given node type with the given attributes.
     * @param from - The start position of the range.
     * @param to - The end position of the range. Defaults to `from`.
     * @param type - The node type to set.
     * @param attrs - The attributes to set, or a function that computes attributes from the old node. Defaults to null.
     * @returns This transform instance for chaining.
     */
    setBlockType(from: number,
                 to?: number,
                 type?: NodeType,
                 attrs?: Attrs | null | ((oldNode: PmNode) => Attrs)): this;

    /**
     * Change the type, attributes, and/or marks of the node at `pos`.
     * When `type` isn't given, the existing node type is preserved.
     * @param pos - The position of the node to modify.
     * @param type - The new node type, or null to keep the existing type.
     * @param attrs - The new attributes, or null to keep the existing attributes.
     * @param marks - The new marks to apply to the node.
     * @returns This transform instance for chaining.
     */
    setNodeMarkup(pos: number,
                  type?: NodeType | null,
                  attrs?: Attrs | null,
                  marks?: ReadonlyArray<Mark>): this;

    /**
     * Set a single attribute on a given node to a new value.
     * The `pos` addresses the document content. Use `setDocAttribute`
     * to set attributes on the document itself.
     * @param pos - The position of the node.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transform instance for chaining.
     */
    setNodeAttribute(pos: number, attr: string, value: AttrValue): this;

    /**
     * Set a single attribute on the document to a new value.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transform instance for chaining.
     */
    setDocAttribute(attr: string, value: AttrValue): this;

    /**
     * Add a mark to the node at position `pos`.
     * @param position - The position of the node.
     * @param mark - The mark to add.
     * @returns This transform instance for chaining.
     * @throws {RangeError} When there is no node at the given position.
     */
    addNodeMark(position: number, mark: Mark): this;

    /**
     * Remove a mark (or all marks of the given type) from the node at
     * position `pos`.
     * @param position - The position of the node.
     * @param mark - The mark or mark type to remove.
     * @returns This transform instance for chaining.
     * @throws {RangeError} When there is no node at the given position.
     */
    removeNodeMark(position: number, mark: Mark | MarkType): this;

    /**
     * Split the node at the given position, and optionally, if `depth` is
     * greater than one, any number of nodes above that. By default, the
     * parts split off will inherit the node type of the original node.
     * This can be changed by passing an array of types and attributes to
     * use after the split (with the outermost nodes coming first).
     * @param pos - The position at which to split.
     * @param depth - The number of levels to split. Defaults to 1.
     * @param typesAfter - Optional array of node types and attributes to use for the split nodes.
     * @returns This transform instance for chaining.
     */
    split(pos: number,
          depth?: number,
          typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): this;

    /**
     * Add the given mark to the inline content between `from` and `to`.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param mark - The mark to add.
     * @returns This transform instance for chaining.
     */
    addMark(from: number, to: number, mark: Mark): this;

    /**
     * Remove marks from inline nodes between `from` and `to`. When
     * `mark` is a single mark, remove precisely that mark. When it is
     * a mark type, remove all marks of that type. When it is null,
     * remove all marks of any type.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param mark - The mark, mark type, or null to remove all marks.
     * @returns This transform instance for chaining.
     */
    removeMark(from: number,
               to: number,
               mark?: Mark | MarkType | null): this;

    /**
     * Removes all marks and nodes from the content of the node at
     * `position` that don't match the given new parent node type. Accepts
     * an optional starting [content match](#model.ContentMatch) as
     * third argument.
     * @param position - The position of the parent node.
     * @param parentType - The node type to match content against.
     * @param match - Optional starting content match.
     * @returns This transform instance for chaining.
     */
    clearIncompatible(position: number, parentType: NodeType, match?: ContentMatch): this;
}
