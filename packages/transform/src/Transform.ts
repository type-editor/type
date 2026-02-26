import type {AttrValue, PmStep, PmStepMap, PmStepResult, TransformDocument} from '@type-editor/editor-types';
import {
    type Attrs,
    type ContentMatch,
    Fragment,
    Mark,
    type MarkType,
    type NodeRange,
    type NodeType,
    type PmNode,
    Slice,
} from '@type-editor/model';

import {join} from './block-changes/join';
import {lift} from './block-changes/lift';
import {setBlockType} from './block-changes/set-block-type';
import {setNodeMarkup} from './block-changes/set-node-markup';
import {split} from './block-changes/split';
import {clearIncompatible} from './block-changes/util';
import {wrap} from './block-changes/wrap';
import {Mapping} from './change-map/Mapping';
import {AddNodeMarkStep} from './change-steps/AddNodeMarkStep';
import {AttrStep} from './change-steps/AttrStep';
import {DocAttrStep,} from './change-steps/DocAttrStep';
import {RemoveNodeMarkStep} from './change-steps/RemoveNodeMarkStep';
import {Step} from './change-steps/Step';
import {StepResult} from './change-steps/StepResult';
import {addMark} from './mark-changes/add-mark';
import {removeMark} from './mark-changes/remove-mark';
import {deleteRange} from './replace/delete-range';
import {replaceRange} from './replace/replace-range';
import {replaceRangeWith} from './replace/replace-range-with';
import {replaceStep} from './replace/replace-step';


/**
 * Error thrown when a transformation step fails.
 */
export class TransformError extends Error {

    /**
     * Creates a new TransformError.
     * @param message - The error message describing why the transformation failed.
     */
    constructor(message: string) {
        super(message);
        this.name = 'TransformError';
    }
}


/**
 * Abstraction to build up and track an array of
 * [steps](#transform.Step) representing a document transformation.
 *
 * Most transforming methods return the `Transform` object itself, so
 * that they can be chained.
 */
export class Transform implements TransformDocument {

    /** The steps in this transform. */
    private readonly _steps: Array<PmStep> = [];
    /** The documents before each of the steps. */
    private readonly _docs: Array<PmNode> = [];
    /** A mapping with the maps for each of the steps in this transform. */
    private readonly _mapping: Mapping = new Mapping();

    /** The current document. */
    protected _doc: PmNode;

    /**
     * Creates a new Transform instance.
     * @param doc - The current document (the result of applying the steps in the transform).
     */
    constructor(doc: PmNode) {
        this._doc = doc;
    }

    /**
     * The current document (the result of applying all steps).
     */
    get doc(): PmNode {
        return this._doc;
    }

    /**
     * The steps in this transform.
     */
    get steps(): ReadonlyArray<Step> {
        return this._steps as unknown as ReadonlyArray<Step>;
    }

    /**
     * The documents before each of the steps.
     */
    get docs(): ReadonlyArray<PmNode> {
        return this._docs;
    }

    /**
     * A mapping with the maps for each of the steps in this transform.
     */
    get mapping(): Mapping {
        return this._mapping;
    }

    /**
     * The starting document.
     */
    get before(): PmNode {
        return this._docs.length ? this._docs[0] : this._doc;
    }

    /**
     * True when the document has been changed (when there are any steps).
     */
    get docChanged(): boolean {
        return this._steps.length > 0;
    }

    /**
     * Apply a new step in this transform, saving the result. Throws an
     * error when the step fails.
     * @param step - The step to apply.
     * @returns This transform instance for chaining.
     * @throws {TransformError} When the step fails to apply.
     */
    public step(step: PmStep): this {
        const result: StepResult = this.maybeStep(step);
        if (result.failed) {
            throw new TransformError(result.failed);
        }
        return this;
    }

    /**
     * Try to apply a step in this transformation, ignoring it if it
     * fails. Returns the step result.
     * @param step - The step to try applying.
     * @returns The result of applying the step, which may indicate failure.
     */
    public maybeStep(step: PmStep): StepResult {
        const result: PmStepResult = step.apply(this._doc);
        if (!result.failed && result.doc) {
            this.addStep(step, result.doc);
        }
        return result as StepResult;
    }

    /**
     * Return a single range, in post-transform document positions,
     * that covers all content changed by this transform. Returns null
     * if no replacements are made. Note that this will ignore changes
     * that add/remove marks without replacing the underlying content.
     */
    public changedRange(): { from: number; to: number } {
        let from = 1e9;
        let to = -1e9;
        
        for (let mapIndex = 0; mapIndex < this.mapping.maps.length; mapIndex++) {
            const map: PmStepMap = this.mapping.maps[mapIndex];

            if (mapIndex) {
                from = map.map(from, 1);
                to = map.map(to, -1);
            }

            map.forEach((_oldStart: number, _oldEnd: number, newStart: number, newEnd: number): void => {
                from = Math.min(from, newStart);
                to = Math.max(to, newEnd);
            });
        }
        return from === 1e9 ? null : {from, to};
    }

    /**
     * Add a step to the transform without applying it (assumes it has already been applied).
     * Updates the internal state to track the step and its resulting document.
     * @param step - The step that was applied.
     * @param doc - The resulting document after applying the step.
     */
    public addStep(step: PmStep, doc: PmNode): void {
        this._docs.push(this._doc);
        this._steps.push(step);
        this._mapping.appendMap(step.getMap() as PmStepMap);
        this._doc = doc;
    }

    /**
     * Replace the part of the document between `from` and `to` with the
     * given `slice`. No-op replacements (empty slice over empty range) are
     * silently ignored.
     * @param from - The start position of the range to replace.
     * @param to - The end position of the range to replace. Defaults to `from`.
     * @param slice - The slice to insert. Defaults to an empty slice.
     * @returns This transform instance for chaining.
     */
    public replace(from: number,
                   to = from,
                   slice = Slice.empty): this {
        const step: Step = replaceStep(this._doc, from, to, slice);
        if (step) {
            this.step(step);
        }
        return this;
    }

    /**
     * Replace the given range with the given content, which may be a
     * fragment, node, or array of nodes.
     * @param from - The start position of the range to replace.
     * @param to - The end position of the range to replace.
     * @param content - The content to insert (fragment, node, or array of nodes).
     * @returns This transform instance for chaining.
     */
    public replaceWith(from: number,
                       to: number,
                       content: Fragment | PmNode | ReadonlyArray<PmNode>): this {
        return this.replace(from, to, new Slice(Fragment.from(content), 0, 0));
    }

    /**
     * Delete the content between the given positions.
     * @param from - The start position of the range to delete.
     * @param to - The end position of the range to delete.
     * @returns This transform instance for chaining.
     */
    public delete(from: number, to: number): this {
        return this.replace(from, to, Slice.empty);
    }

    /**
     * Insert the given content at the given position.
     * @param pos - The position at which to insert the content.
     * @param content - The content to insert (fragment, node, or array of nodes).
     * @returns This transform instance for chaining.
     */
    public insert(pos: number,
                  content: Fragment | PmNode | ReadonlyArray<PmNode>): this {
        return this.replaceWith(pos, pos, content);
    }

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
    public replaceRange(from: number, to: number, slice: Slice): this {
        replaceRange(this, from, to, slice);
        return this;
    }

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
    public replaceRangeWith(from: number, to: number, node: PmNode): this {
        replaceRangeWith(this, from, to, node);
        return this;
    }

    /**
     * Delete the given range, expanding it to cover fully covered
     * parent nodes until a valid replace is found.
     * @param from - The start position of the range to delete.
     * @param to - The end position of the range to delete.
     * @returns This transform instance for chaining.
     */
    public deleteRange(from: number, to: number): this {
        deleteRange(this, from, to);
        return this;
    }

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
    public lift(range: NodeRange, target: number): this {
        lift(this, range, target);
        return this;
    }

    /**
     * Join the blocks around the given position. If depth is 2, their
     * last and first siblings are also joined, and so on.
     * @param pos - The position around which to join blocks.
     * @param depth - The number of levels to join. Defaults to 1.
     * @returns This transform instance for chaining.
     */
    public join(pos: number, depth = 1): this {
        join(this, pos, depth);
        return this;
    }

    /**
     * Wrap the given [range](#model.NodeRange) in the given set of wrappers.
     * The wrappers are assumed to be valid in this position, and should
     * probably be computed with [`findWrapping`](#transform.findWrapping).
     * @param range - The range to wrap.
     * @param wrappers - The wrapper nodes to apply, with outermost first.
     * @returns This transform instance for chaining.
     */
    public wrap(range: NodeRange,
                wrappers: ReadonlyArray<{ type: NodeType, attrs?: Attrs | null; }>): this {
        wrap(this, range, wrappers);
        return this;
    }

    /**
     * Set the type of all textblocks (partly) between `from` and `to` to
     * the given node type with the given attributes.
     * @param from - The start position of the range.
     * @param to - The end position of the range. Defaults to `from`.
     * @param type - The node type to set.
     * @param attrs - The attributes to set, or a function that computes attributes from the old node. Defaults to null.
     * @returns This transform instance for chaining.
     */
    public setBlockType(from: number,
                        to = from,
                        type: NodeType,
                        attrs: Attrs | null | ((oldNode: PmNode) => Attrs) = null): this {
        setBlockType(this, from, to, type, attrs);
        return this;
    }

    /**
     * Change the type, attributes, and/or marks of the node at `pos`.
     * When `type` isn't given, the existing node type is preserved.
     * @param pos - The position of the node to modify.
     * @param type - The new node type, or null to keep the existing type.
     * @param attrs - The new attributes, or null to keep the existing attributes.
     * @param marks - The new marks to apply to the node.
     * @returns This transform instance for chaining.
     */
    public setNodeMarkup(pos: number,
                         type?: NodeType | null,
                         attrs: Attrs | null = null,
                         marks?: ReadonlyArray<Mark>): this {
        setNodeMarkup(this, pos, type, attrs, marks);
        return this;
    }

    /**
     * Set a single attribute on a given node to a new value.
     * The `pos` addresses the document content. Use `setDocAttribute`
     * to set attributes on the document itself.
     * @param pos - The position of the node.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transform instance for chaining.
     */
    public setNodeAttribute(pos: number, attr: string, value: AttrValue): this {
        this.step(new AttrStep(pos, attr, value));
        return this;
    }

    /**
     * Set a single attribute on the document to a new value.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transform instance for chaining.
     */
    public setDocAttribute(attr: string, value: AttrValue): this {
        this.step(new DocAttrStep(attr, value));
        return this;
    }

    /**
     * Add a mark to the node at position `pos`.
     * @param position - The position of the node.
     * @param mark - The mark to add.
     * @returns This transform instance for chaining.
     * @throws {RangeError} When there is no node at the given position.
     */
    public addNodeMark(position: number, mark: Mark): this {
        const node: PmNode = this._doc.nodeAt(position);
        if (!node) {
            throw new RangeError(`No node at position ${position.toString()}`);
        }
        this.step(new AddNodeMarkStep(position, mark));
        return this;
    }

    /**
     * Remove a mark (or all marks of the given type) from the node at
     * position `pos`.
     * @param position - The position of the node.
     * @param mark - The mark or mark type to remove.
     * @returns This transform instance for chaining.
     * @throws {RangeError} When there is no node at the given position.
     */
    public removeNodeMark(position: number, mark: Mark | MarkType): this {
        const node: PmNode = this._doc.nodeAt(position);
        if (!node) {
            throw new RangeError(`No node at position ${position.toString()}`);
        }

        if (Mark.isMark(mark)) {
            if (mark.isInSet(node.marks)) {
                this.step(new RemoveNodeMarkStep(position, mark));
            }
        } else {
            let set: ReadonlyArray<Mark> = node.marks;
            const steps: Array<Step> = [];
            let found: Mark | undefined = (mark).isInSet(set);

            while (found) {
                steps.push(new RemoveNodeMarkStep(position, found));
                set = found.removeFromSet(set);
                found = (mark).isInSet(set);
            }
            for (let i = steps.length - 1; i >= 0; i--) {
                this.step(steps[i]);
            }
        }
        return this;
    }

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
    public split(pos: number,
                 depth = 1,
                 typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): this {
        split(this, pos, depth, typesAfter);
        return this;
    }

    /**
     * Add the given mark to the inline content between `from` and `to`.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param mark - The mark to add.
     * @returns This transform instance for chaining.
     */
    public addMark(from: number, to: number, mark: Mark): this {
        addMark(this, from, to, mark);
        return this;
    }

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
    public removeMark(from: number,
                      to: number,
                      mark?: Mark | MarkType | null): this {
        removeMark(this, from, to, mark);
        return this;
    }

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
    public clearIncompatible(position: number, parentType: NodeType, match?: ContentMatch): this {
        clearIncompatible(this, position, parentType, match);
        return this;
    }
}
