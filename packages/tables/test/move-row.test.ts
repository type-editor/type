import { describe, expect, it } from 'vitest';
import { EditorState } from '@type-editor/state';

import { moveRow } from '@src/utils/move-row';
import { CellSelection } from '../src';

import { doc, table, tr, td, p, c, selectionFor, type TaggedNode } from './build';

/**
 * Helper to create an EditorState from a tagged document
 */
function createState(docNode: TaggedNode): EditorState {
    return EditorState.create({
        doc: docNode,
        selection: selectionFor(docNode),
    });
}

describe('moveRow', () => {
    describe('basic row movement', () => {
        it('should move row down successfully', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                    tr(td(p('R2C0')), td(p('R2C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 0,
                targetIndex: 2,
                select: false,
                pos: 5,
            });

            expect(result).toBe(true);

            const newDoc = transaction.doc;
            const tableNode = newDoc.firstChild;
            expect(tableNode?.child(0).textContent).toBe('R1C0R1C1');
            expect(tableNode?.child(1).textContent).toBe('R2C0R2C1');
            expect(tableNode?.child(2).textContent).toBe('R0C0R0C1');
        });

        it('should move row up successfully', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                    tr(td(p('R2C0')), td(p('R2C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 2,
                targetIndex: 0,
                select: false,
                pos: 5,
            });

            expect(result).toBe(true);

            const newDoc = transaction.doc;
            const tableNode = newDoc.firstChild;
            expect(tableNode?.child(0).textContent).toBe('R2C0R2C1');
            expect(tableNode?.child(1).textContent).toBe('R0C0R0C1');
            expect(tableNode?.child(2).textContent).toBe('R1C0R1C1');
        });
    });

    describe('row selection after move', () => {
        it('should select the moved row when moving up', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                    tr(td(p('R2C0')), td(p('R2C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 2,
                targetIndex: 0,
                select: true,
                pos: 5,
            });

            expect(result).toBe(true);

            const selection = transaction.selection;
            expect(selection).toBeInstanceOf(CellSelection);

            const cellSel = selection as CellSelection;
            expect(cellSel.isRowSelection()).toBe(true);

            // The first row should now contain R2 content
            const tableNode = transaction.doc.firstChild;
            const firstRow = tableNode?.child(0);
            expect(firstRow?.textContent).toBe('R2C0R2C1');
        });

        it('should select the moved row when moving down', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                    tr(td(p('R2C0')), td(p('R2C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 0,
                targetIndex: 2,
                select: true,
                pos: 5,
            });

            expect(result).toBe(true);

            const selection = transaction.selection;
            expect(selection).toBeInstanceOf(CellSelection);

            const cellSel = selection as CellSelection;
            expect(cellSel.isRowSelection()).toBe(true);

            // The last row should now contain R0 content
            const tableNode = transaction.doc.firstChild;
            const lastRow = tableNode?.child(2);
            expect(lastRow?.textContent).toBe('R0C0R0C1');
        });
    });

    describe('error handling', () => {
        it('should return false for invalid position', () => {
            const docNode = doc(p('no table here<cursor>')) as TaggedNode;
            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 0,
                targetIndex: 1,
                select: false,
                pos: 1,
            });

            expect(result).toBe(false);
        });

        it('should return false when origin overlaps target', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 0,
                targetIndex: 0,
                select: false,
                pos: 5,
            });

            expect(result).toBe(false);
        });
    });

    describe('merged cells (rowspan)', () => {
        it('should handle moving a row with rowspan', () => {
            const docNode = doc(
                table(
                    tr(c(1, 2, 'span'), td(p('R0C1<cursor>'))),
                    tr(td(p('R1C1'))),
                    tr(td(p('R2C0')), td(p('R2C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 0,
                targetIndex: 2,
                select: false,
                pos: 5,
            });

            expect(result).toBe(true);
        });
    });

    describe('edge cases - bounds checking', () => {
        it('should return false for out of bounds origin index', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 5,
                targetIndex: 0,
                select: false,
                pos: 5,
            });

            expect(result).toBe(false);
        });

        it('should return false for out of bounds target index', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: 0,
                targetIndex: 5,
                select: false,
                pos: 5,
            });

            expect(result).toBe(false);
        });

        it('should return false for negative indices', () => {
            const docNode = doc(
                table(
                    tr(td(p('R0C0<cursor>')), td(p('R0C1'))),
                    tr(td(p('R1C0')), td(p('R1C1'))),
                ),
            ) as TaggedNode;

            const state = createState(docNode);
            const transaction = state.tr;

            const result = moveRow({
                transaction: transaction,
                originIndex: -1,
                targetIndex: 0,
                select: false,
                pos: 5,
            });

            expect(result).toBe(false);
        });
    });
});

