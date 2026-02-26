import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmSelection, PmTransaction} from '@type-editor/editor-types';
import {Mark, type MarkType, Node, type ResolvedPos, type Schema, type Slice} from '@type-editor/model';
import {type Step, Transform,} from '@type-editor/transform';

import type {EditorState} from './editor-state/EditorState';
import type {Plugin} from './plugin/Plugin';
import type {PluginKey} from './plugin/PluginKey';
import {Selection} from './selection/Selection';

enum UpdateType {

    UPDATED_SEL = 1,
    UPDATED_MARKS = 2,
    UPDATED_SCROLL = 4
}

/**
 * An editor state transaction, which can be applied to a state to
 * create an updated state. Use
 * [`EditorState.tr`](#state.EditorState.tr) to create an instance.
 *
 * Transactions track changes to the document (they are a subclass of
 * [`Transform`](#transform.Transform)), but also other state changes,
 * like selection updates and adjustments of the set of [stored
 * marks](#state.EditorState.storedMarks). In addition, you can store
 * metadata properties in a transaction, which are extra pieces of
 * information that client code or plugins can use to describe what a
 * transaction represents, so that they can update their [own
 * state](#state.StateField) accordingly.
 *
 * The [editor view](#view.EditorView) uses a few metadata
 * properties: it will attach a property `'pointer'` with the value
 * `true` to selection transactions directly caused by mouse or touch
 * input, a `'composition'` property holding an ID identifying the
 * composition that caused it to transactions caused by composed DOM
 * input, and a `'uiEvent'` property of that may be `'paste'`,
 * `'cut'`, or `'drop'`.
 */
export class Transaction extends Transform implements PmTransaction {


    /**
     * The timestamp associated with this transaction, in the same
     * format as `Date.now()`.
     */
    private timestamp: number;
    private curSelection: PmSelection;
    /**
     * The step count for which the current selection is valid.
     * @internal
     */
    private curSelectionFor = 0;
    /**
     * Bitfield to track which aspects of the state were updated by
     * this transaction.
     * @internal
     */
    private updated = 0;
    /**
     * Object used to store metadata properties for the transaction.
     * @internal
     */
    private meta = new Map<string, any>();
    /**
     * The stored marks set by this transaction, if any.
     */
    private _storedMarks: ReadonlyArray<Mark> | null;

    constructor(state: EditorState) {
        super(state.doc);
        this.timestamp = Date.now();
        this.curSelection = state.selection;
        this._storedMarks = state.storedMarks;
    }

    /**
     * The stored marks set by this transaction, if any.
     */
    get storedMarks(): ReadonlyArray<Mark> | null {
        return this._storedMarks;
    }

    /**
     * The timestamp associated with this transaction, in the same
     * format as `Date.now()`.
     */
    get time(): number {
        return this.timestamp;
    }

    /**
     * The transaction's current selection. This defaults to the editor
     * selection [mapped](#state.Selection.map) through the steps in the
     * transaction, but can be overwritten with
     * [`setSelection`](#state.Transaction.setSelection).
     */
    get selection(): Selection {
        if (this.curSelectionFor < this.steps.length) {
            this.curSelection = this.curSelection.map(this._doc, this.mapping.slice(this.curSelectionFor));
            this.curSelectionFor = this.steps.length;
        }
        return this.curSelection as Selection;
    }

    /**
     * Whether the selection was explicitly updated by this transaction.
     */
    get selectionSet(): boolean {
        return (this.updated & UpdateType.UPDATED_SEL) > 0;
    }

    /**
     * Whether the stored marks were explicitly set for this transaction.
     */
    get storedMarksSet(): boolean {
        return (this.updated & UpdateType.UPDATED_MARKS) > 0;
    }

    /**
     * Returns true if this transaction doesn't contain any metadata,
     * and can thus safely be extended.
     */
    get isGeneric(): boolean {
        return this.meta.size === 0;
    }

    /**
     * True when this transaction has had `scrollIntoView` called on it.
     */
    get scrolledIntoView(): boolean {
        return (this.updated & UpdateType.UPDATED_SCROLL) > 0;
    }

    /**
     * Update the transaction's current selection. Will determine the
     * selection that the editor gets when the transaction is applied.
     */
    public setSelection(selection: Selection): Transaction {
        if (selection.$from.doc !== this._doc) {
            throw new RangeError('Selection passed to setSelection must point at the current document');
        }
        this.curSelection = selection;
        this.curSelectionFor = this.steps.length;
        this.updated = (this.updated | UpdateType.UPDATED_SEL) & ~UpdateType.UPDATED_MARKS;
        this._storedMarks = null;
        return this;
    }

    public getUpdated(): number {
        return this.updated;
    }

    public setUpdated(updated: number): void {
        this.updated = updated;
    }

    /**
     * Make sure the current stored marks or, if that is null, the marks
     * at the selection, match the given set of marks. Does nothing if
     * this is already the case.
     */
    public ensureMarks(marks: ReadonlyArray<Mark>): Transaction {
        if (!Mark.sameSet(this._storedMarks || this.selection.$from.marks(), marks)) {
            this.setStoredMarks(marks);
        }
        return this;
    }

    /**
     * Add a mark to the set of stored marks.
     */
    public addStoredMark(mark: Mark): Transaction {
        const addedMarks: ReadonlyArray<Mark> = mark.addToSet(this._storedMarks || this.selection.$from.marks());
        return this.ensureMarks(addedMarks);
    }

    /**
     * Remove a mark or mark type from the set of stored marks.
     */
    public removeStoredMark(mark: Mark | MarkType): Transaction {
        const removedMarks: ReadonlyArray<Mark> = mark.removeFromSet(this._storedMarks || this.selection.$from.marks());
        return this.ensureMarks(removedMarks);
    }

    public addStep(step: Step, doc: Node): void {
        super.addStep(step, doc);
        this.updated = this.updated & ~UpdateType.UPDATED_MARKS;
        this._storedMarks = null;
    }

    /**
     * Update the timestamp for the transaction.
     * @param time
     */
    public setTime(time: number): Transaction {
        this.timestamp = time;
        return this;
    }

    /**
     * Replace the current selection with the given slice.
     * @param slice
     */
    public replaceSelection(slice: Slice): Transaction {
        this.selection.replace(this, slice);
        return this;
    }

    /**
     * Replace the selection with the given node. When `inheritMarks` is
     * true and the content is inline, it inherits the marks from the
     * place where it is inserted.
     * @param node
     * @param inheritMarks
     */
    public replaceSelectionWith(node: Node, inheritMarks = true): Transaction {
        const selection: Selection = this.selection;

        if (inheritMarks) {
            let marks: ReadonlyArray<Mark>;
            if (this._storedMarks) {
                marks = this._storedMarks;
            } else if (selection.empty) {
                marks = selection.$from.marks();
            } else {
                marks = selection.$from.marksAcross(selection.$to) || Mark.none;
            }
            node = node.mark(marks);
        }
        selection.replaceWith(this, node);
        return this;
    }

    /**
     * Delete the selection.
     */
    public deleteSelection(): Transaction {
        this.selection.replace(this);
        return this;
    }

    /**
     * Replace the given range, or the selection if no range is given,
     * with a text node containing the given string.
     */
    public insertText(text: string, from?: number, to?: number): Transaction {
        const schema: Schema = this._doc.type.schema;
        if (isUndefinedOrNull(from)) {
            if (!text) {
                return this.deleteSelection();
            }
            return this.replaceSelectionWith(schema.text(text), true);
        } else {
            to ??= from;
            if (!text) {
                return this.deleteRange(from, to);
            }

            let marks: ReadonlyArray<Mark> = this._storedMarks;
            if (!marks) {
                const $from: ResolvedPos = this._doc.resolve(from);
                marks = to === from ? $from.marks() : ($from.marksAcross(this._doc.resolve(to)) || Mark.none);
            }

            this.replaceRangeWith(from, to, schema.text(text, marks));
            // After replacement, the new text ends at: from + text.length
            // If selection.to is at that position and selection is not empty, move selection
            const newEnd: number = from + text.length;
            if (!this.selection.empty && this.selection.from < newEnd && this.selection.to <= newEnd) {
                this.setSelection(Selection.near(this._doc.resolve(newEnd)));
            }
            return this;
        }
    }

    /**
     * Store a metadata property in this transaction, keyed either by
     * name or by plugin.
     */
    public setMeta(key: string | Plugin | PluginKey, value: any): Transaction {
        this.meta.set(typeof key === 'string' ? key : key.key, value);
        return this;
    }

    /**
     * Retrieve a metadata property for a given name or plugin.
     */
    public getMeta(key: string | Plugin | PluginKey): any {
        return this.meta.get(typeof key === 'string' ? key : key.key);
    }

    /**
     * Indicate that the editor should scroll the selection into view
     * when updated to the state produced by this transaction.
     */
    public scrollIntoView(): Transaction {
        this.updated |= UpdateType.UPDATED_SCROLL;
        return this;
    }

    /**
     * Set the current stored marks.
     */
    public setStoredMarks(marks: ReadonlyArray<Mark> | null): Transaction {
        this._storedMarks = marks;
        this.updated |= UpdateType.UPDATED_MARKS;
        return this;
    }
}
