import {Mark, MarkType, PmNode, Slice} from '@type-editor/model';

import type {PmStep, TransformDocument} from '../transform';
import type {PmPlugin} from './plugin/PmPlugin';
import type {PmPluginKey} from './plugin/PmPluginKey';
import type {PmSelection} from './selection/PmSelection';


export interface PmTransaction extends TransformDocument {

    readonly storedMarks: ReadonlyArray<Mark>;
    readonly time: number;
    readonly selection: PmSelection;
    readonly selectionSet: boolean;
    readonly storedMarksSet: boolean;
    readonly isGeneric: boolean;
    readonly scrolledIntoView: boolean;

    /**
     * Update the transaction's current selection. Will determine the
     * selection that the editor gets when the transaction is applied.
     */
    setSelection(selection: PmSelection): PmTransaction;

    getUpdated(): number;

    setUpdated(updated: number): void;

    /**
     * Make sure the current stored marks or, if that is null, the marks
     * at the selection, match the given set of marks. Does nothing if
     * this is already the case.
     */
    ensureMarks(marks: ReadonlyArray<Mark>): PmTransaction;

    /**
     * Add a mark to the set of stored marks.
     */
    addStoredMark(mark: Mark): PmTransaction;

    /**
     * Remove a mark or mark type from the set of stored marks.
     */
    removeStoredMark(mark: Mark | MarkType): PmTransaction;

    addStep(step: PmStep, doc: PmNode): void;

    /**
     * Update the timestamp for the transaction.
     * @param time
     */
    setTime(time: number): PmTransaction;

    /**
     * Replace the current selection with the given slice.
     * @param slice
     */
    replaceSelection(slice: Slice): PmTransaction;

    /**
     * Replace the selection with the given node. When `inheritMarks` is
     * true and the content is inline, it inherits the marks from the
     * place where it is inserted.
     * @param node
     * @param inheritMarks
     */
    replaceSelectionWith(node: PmNode, inheritMarks?: boolean): PmTransaction;

    /**
     * Delete the selection.
     */
    deleteSelection(): PmTransaction;

    /**
     * Replace the given range, or the selection if no range is given,
     * with a text node containing the given string.
     */
    insertText(text: string, from?: number, to?: number): PmTransaction;

    /**
     * Store a metadata property in this transaction, keyed either by
     * name or by plugin.
     */
    setMeta(key: string | PmPlugin | PmPluginKey, value: any): PmTransaction;

    /**
     * Retrieve a metadata property for a given name or plugin.
     */
    getMeta(key: string | PmPlugin | PmPluginKey): any;

    /**
     * Indicate that the editor should scroll the selection into view
     * when updated to the state produced by this transaction.
     */
    scrollIntoView(): PmTransaction;

    /**
     * Set the current stored marks.
     */
    setStoredMarks(marks: ReadonlyArray<Mark> | null): PmTransaction;

    changedRange(): { from: number; to: number }
}
