import type {Mappable, PmMapping, PmSelection, PmTransaction} from '@type-editor/editor-types';
import {Fragment, type PmNode, type ResolvedPos, Slice} from '@type-editor/model';
import {Selection, SelectionRange, TextSelection,} from '@type-editor/state';

import {TableMap} from '../tablemap/TableMap';
import type {CellAttrs} from '../types/CellAttrs';
import type {CellSelectionJSON} from '../types/cellselection/CellSelectionJSON';
import {type Rect} from '../types/tablemap/Rect';
import {inSameTable} from '../utils/in-same-table';
import {pointsAtCell} from '../utils/points-at-cell';
import {removeColSpan} from '../utils/remove-col-span';
import {CellBookmark} from './CellBookmark';

/**
 * A {@link Selection} subclass that represents a cell selection spanning part of a table.
 * With the plugin enabled, these will be created when the user selects across cells,
 * and will be drawn by giving selected cells a `selectedCell` CSS class.
 *
 * @see {@link https://prosemirror.net/docs/ref/#state.Selection|ProseMirror Selection}
 *
 * @example
 * ```typescript
 * // Create a single cell selection
 * const selection = new CellSelection($cellPos);
 *
 * // Create a multi-cell selection
 * const selection = new CellSelection($anchorCell, $headCell);
 *
 * // Create a full column selection
 * const colSel = CellSelection.colSelection($anchorCell, $headCell);
 * ```
 */
export class CellSelection extends Selection implements PmSelection {

    /** The resolved position of the anchor cell (the fixed endpoint of the selection). */
    private readonly _$anchorCell: ResolvedPos;
    /** The resolved position of the head cell (the moving endpoint of the selection). */
    private readonly _$headCell: ResolvedPos;

    /**
     * Creates a table cell selection identified by its anchor and head cells.
     * The positions given to this constructor should point _before_ two
     * cells in the same table. They may be the same, to select a single cell.
     *
     * @param $anchorCell - A resolved position pointing _in front of_ the anchor cell
     *                      (the one that doesn't move when extending the selection).
     * @param $headCell - A resolved position pointing in front of the head cell
     *                    (the one that moves when extending the selection).
     *                    Defaults to `$anchorCell` for single cell selection.
     * @throws {RangeError} If a cell cannot be found at the expected position.
     */
    constructor($anchorCell: ResolvedPos, $headCell: ResolvedPos = $anchorCell) {
        const ranges: Array<SelectionRange> = CellSelection.computeSelectionRanges($anchorCell, $headCell);

        super(ranges[0].$from, ranges[0].$to, ranges);
        this._$anchorCell = $anchorCell;
        this._$headCell = $headCell;
        this.isVisible = false;
    }

    /**
     * The resolved position of the anchor cell (the fixed endpoint of the selection).
     * @returns The anchor cell's resolved position.
     */
    get $anchorCell(): ResolvedPos {
        return this._$anchorCell;
    }

    /**
     * The resolved position of the head cell (the moving endpoint of the selection).
     * @returns The head cell's resolved position.
     */
    get $headCell(): ResolvedPos {
        return this._$headCell;
    }

    /**
     * Creates the smallest column selection that covers the given anchor and head cells.
     *
     * This method expands the selection to span from the top row to the bottom row
     * of the table for the columns containing the anchor and head cells.
     *
     * @param $anchorCell - A resolved position pointing to the anchor cell.
     * @param $headCell - A resolved position pointing to the head cell. Defaults to `$anchorCell`.
     * @returns A new CellSelection spanning complete columns.
     *
     * @example
     * ```typescript
     * // Select the entire column containing the cell at $cellPos
     * const colSelection = CellSelection.colSelection($cellPos);
     * ```
     */
    public static colSelection($anchorCell: ResolvedPos,
                               $headCell: ResolvedPos = $anchorCell): CellSelection {
        const table: PmNode = $anchorCell.node(-1);
        const map: TableMap = TableMap.get(table);
        const tableStart: number = $anchorCell.start(-1);

        const anchorRect: Rect = map.findCell($anchorCell.pos - tableStart);
        const headRect: Rect = map.findCell($headCell.pos - tableStart);
        const doc: PmNode = $anchorCell.node(0);

        // Determine which cell is higher in the table
        const anchorIsAboveOrSame: boolean = anchorRect.top <= headRect.top;

        // Expand selection to span from top to bottom of table
        if (anchorIsAboveOrSame) {
            $anchorCell = this.moveToTopOfColumn($anchorCell, anchorRect, tableStart, map, doc);
            $headCell = this.moveToBottomOfColumn($headCell, headRect, tableStart, map, doc);
        } else {
            $headCell = this.moveToTopOfColumn($headCell, headRect, tableStart, map, doc);
            $anchorCell = this.moveToBottomOfColumn($anchorCell, anchorRect, tableStart, map, doc);
        }

        return new CellSelection($anchorCell, $headCell);
    }

    /**
     * Creates the smallest row selection that covers the given anchor and head cells.
     *
     * This method expands the selection to span from the leftmost column to the
     * rightmost column of the table for the rows containing the anchor and head cells.
     *
     * @param $anchorCell - A resolved position pointing to the anchor cell.
     * @param $headCell - A resolved position pointing to the head cell. Defaults to `$anchorCell`.
     * @returns A new CellSelection spanning complete rows.
     *
     * @example
     * ```typescript
     * // Select the entire row containing the cell at $cellPos
     * const rowSelection = CellSelection.rowSelection($cellPos);
     * ```
     */
    public static rowSelection($anchorCell: ResolvedPos,
                               $headCell: ResolvedPos = $anchorCell): CellSelection {
        const table: PmNode = $anchorCell.node(-1);
        const map: TableMap = TableMap.get(table);
        const tableStart: number = $anchorCell.start(-1);

        const anchorRect: Rect = map.findCell($anchorCell.pos - tableStart);
        const headRect: Rect = map.findCell($headCell.pos - tableStart);
        const doc: PmNode = $anchorCell.node(0);

        // Determine which cell is further left in the table
        const anchorIsLeftOrSame: boolean = anchorRect.left <= headRect.left;

        // Expand selection to span from left to right of table
        if (anchorIsLeftOrSame) {
            $anchorCell = this.moveToLeftOfRow($anchorCell, anchorRect, tableStart, map, doc);
            $headCell = this.moveToRightOfRow($headCell, headRect, tableStart, map, doc);
        } else {
            $headCell = this.moveToLeftOfRow($headCell, headRect, tableStart, map, doc);
            $anchorCell = this.moveToRightOfRow($anchorCell, anchorRect, tableStart, map, doc);
        }

        return new CellSelection($anchorCell, $headCell);
    }

    /**
     * Creates a CellSelection from a JSON representation.
     *
     * @param doc - The document to resolve positions in.
     * @param json - The JSON object representing the selection.
     * @returns A new CellSelection instance.
     */
    public static override fromJSON(doc: PmNode, json: CellSelectionJSON): CellSelection {
        return new CellSelection(doc.resolve(json.anchor), doc.resolve(json.head));
    }

    /**
     * Factory method to create a CellSelection from anchor and head cell positions.
     *
     * @param doc - The document containing the cells.
     * @param anchorCell - The absolute position of the anchor cell.
     * @param headCell - The absolute position of the head cell. Defaults to `anchorCell`.
     * @returns A new CellSelection instance.
     */
    public static create(doc: PmNode,
                         anchorCell: number,
                         headCell: number = anchorCell): CellSelection {
        return new CellSelection(doc.resolve(anchorCell), doc.resolve(headCell));
    }

    /**
     * Computes the selection ranges for all cells in the rectangular area
     * between the anchor and head cells.
     *
     * @param $anchorCell - The resolved position of the anchor cell.
     * @param $headCell - The resolved position of the head cell.
     * @returns An array of SelectionRange objects, with the head cell's range first.
     * @throws {RangeError} If a cell cannot be found at an expected position.
     */
    private static computeSelectionRanges($anchorCell: ResolvedPos, $headCell: ResolvedPos): Array<SelectionRange> {
        const table: PmNode = $anchorCell.node(-1);
        const map: TableMap = TableMap.get(table);
        const tableStart: number = $anchorCell.start(-1);

        const rect: Rect = map.rectBetween(
            $anchorCell.pos - tableStart,
            $headCell.pos - tableStart,
        );

        const doc: PmNode = $anchorCell.node(0);
        const headCellOffset: number = $headCell.pos - tableStart;

        // Get all cells in the rectangle, excluding the head cell (we'll add it back at the front)
        const cells: Array<number> = map.cellsInRect(rect)
            .filter((position: number): boolean => position !== headCellOffset);

        // Make the head cell the first range, so it counts as the primary part of the selection
        cells.unshift(headCellOffset);

        return cells.map((pos: number): SelectionRange => {
            const cell: PmNode | null = table.nodeAt(pos);
            if (!cell) {
                throw new RangeError(`No cell with offset ${pos} found`);
            }

            // Position is +1 to skip the cell node itself and point to its content
            const from: number = tableStart + pos + 1;
            return new SelectionRange(
                doc.resolve(from),
                doc.resolve(from + cell.content.size),
            );
        });
    }

    /**
     * Moves a cell position to the top of its column.
     *
     * @param $cell - The current cell position.
     * @param cellRect - The cell's rectangle in the table map.
     * @param tableStart - The start position of the table.
     * @param map - The table map.
     * @param doc - The document node.
     * @returns The resolved position of the cell at the top of the column.
     */
    private static moveToTopOfColumn($cell: ResolvedPos,
                                     cellRect: Rect,
                                     tableStart: number,
                                     map: TableMap,
                                     doc: PmNode): ResolvedPos {
        if (cellRect.top > 0) {
            return doc.resolve(tableStart + map.map[cellRect.left]);
        }
        return $cell;
    }

    /**
     * Moves a cell position to the bottom of its column.
     *
     * @param $cell - The current cell position.
     * @param cellRect - The cell's rectangle in the table map.
     * @param tableStart - The start position of the table.
     * @param map - The table map.
     * @param doc - The document node.
     * @returns The resolved position of the cell at the bottom of the column.
     */
    private static moveToBottomOfColumn($cell: ResolvedPos,
                                        cellRect: Rect,
                                        tableStart: number,
                                        map: TableMap,
                                        doc: PmNode): ResolvedPos {
        if (cellRect.bottom < map.height) {
            return doc.resolve(tableStart + map.map[map.width * (map.height - 1) + cellRect.right - 1]);
        }
        return $cell;
    }

    /**
     * Moves a cell position to the leftmost cell in its row.
     *
     * @param $cell - The current cell position.
     * @param cellRect - The cell's rectangle in the table map.
     * @param tableStart - The start position of the table.
     * @param map - The table map.
     * @param doc - The document node.
     * @returns The resolved position of the leftmost cell in the row.
     */
    private static moveToLeftOfRow($cell: ResolvedPos,
                                   cellRect: Rect,
                                   tableStart: number,
                                   map: TableMap,
                                   doc: PmNode): ResolvedPos {
        if (cellRect.left > 0) {
            return doc.resolve(tableStart + map.map[cellRect.top * map.width]);
        }
        return $cell;
    }

    /**
     * Moves a cell position to the rightmost cell in its row.
     *
     * @param $cell - The current cell position.
     * @param cellRect - The cell's rectangle in the table map.
     * @param tableStart - The start position of the table.
     * @param map - The table map.
     * @param doc - The document node.
     * @returns The resolved position of the rightmost cell in the row.
     */
    private static moveToRightOfRow($cell: ResolvedPos,
                                    cellRect: Rect,
                                    tableStart: number,
                                    map: TableMap,
                                    doc: PmNode): ResolvedPos {
        if (cellRect.right < map.width) {
            return doc.resolve(tableStart + map.map[map.width * (cellRect.top + 1) - 1]);
        }
        return $cell;
    }

    /**
     * Maps this selection through a document change.
     *
     * If the anchor and head cells are still valid after the mapping and remain
     * in the same table, a new CellSelection is returned. For row or column
     * selections where the table structure changed, the selection is recreated
     * to maintain the correct boundaries.
     *
     * @param doc - The new document after the change.
     * @param mapping - The mapping describing the document change.
     * @returns A new CellSelection if cells are still valid, or a TextSelection fallback.
     */
    public map(doc: PmNode, mapping: Mappable): CellSelection | Selection {
        const $anchorCell: ResolvedPos = doc.resolve(mapping.map(this._$anchorCell.pos));
        const $headCell: ResolvedPos = doc.resolve(mapping.map(this._$headCell.pos));

        // Verify both positions still point to valid cells in the same table
        if (pointsAtCell($anchorCell) && pointsAtCell($headCell) && inSameTable($anchorCell, $headCell)) {
            const tableChanged: boolean = this._$anchorCell.node(-1) !== $anchorCell.node(-1);

            // For row/column selections, recreate them to maintain correct boundaries
            if (tableChanged && this.isRowSelection()) {
                return CellSelection.rowSelection($anchorCell, $headCell);
            }
            if (tableChanged && this.isColSelection()) {
                return CellSelection.colSelection($anchorCell, $headCell);
            }
            return new CellSelection($anchorCell, $headCell);
        }

        // Fall back to a text selection if cells are no longer valid
        return TextSelection.between($anchorCell, $headCell);
    }

    /**
     * Returns a rectangular slice of table rows containing the selected cells.
     *
     * If cells span beyond the selection rectangle, their colspan/rowspan
     * attributes are adjusted accordingly. If the entire table is selected,
     * the complete table node is returned.
     *
     * @returns A Slice containing the selected cells organized in rows.
     * @throws {RangeError} If a cell cannot be found at an expected position.
     */
    public override content(): Slice {
        const table: PmNode = this._$anchorCell.node(-1);
        const map: TableMap = TableMap.get(table);
        const tableStart: number = this._$anchorCell.start(-1);

        const rect: Rect = map.rectBetween(
            this._$anchorCell.pos - tableStart,
            this._$headCell.pos - tableStart,
        );

        const rows: Array<PmNode> = this.extractRowsForRect(table, map, rect);

        // If entire table is selected, return the table; otherwise return just the rows
        const fragment: PmNode | Array<PmNode> =
            this.isColSelection() && this.isRowSelection() ? table : rows;
        return new Slice(Fragment.from(fragment), 1, 1);
    }

    /**
     * Replaces the content of all selected cells with the given content.
     *
     * The first cell receives the provided content, while all other cells
     * are cleared. After replacement, the selection is updated to point
     * to a valid position.
     *
     * @param transaction - The transaction to apply changes to.
     * @param content - The content to insert into the first cell. Defaults to empty.
     */
    public override replace(transaction: PmTransaction, content: Slice = Slice.empty): void {
        // Record the current step count to track changes made by this operation
        const mapFrom: number = transaction.steps.length;
        const ranges: ReadonlyArray<SelectionRange> = this.ranges;

        // Replace content in each selected cell
        for (let i = 0; i < ranges.length; i++) {
            const {$from, $to} = ranges[i];

            // Create a mapping from the start of this operation to adjust for previous replacements
            const mapping: PmMapping = transaction.mapping.slice(mapFrom);

            // Only insert content into the first cell; clear others
            transaction.replace(
                mapping.map($from.pos),
                mapping.map($to.pos),
                i ? Slice.empty : content,
            );
        }

        // Find a valid selection position after the replacement
        const selection: PmSelection = Selection.findFrom(
            transaction.doc.resolve(transaction.mapping.slice(mapFrom).map(this.to)),
            -1,
        );

        if (selection) {
            transaction.setSelection(selection);
        }
    }

    /**
     * Replaces the content of all selected cells with the given node.
     *
     * @param tr - The transaction to apply changes to.
     * @param node - The node to insert into the first cell.
     */
    public override replaceWith(tr: PmTransaction, node: PmNode): void {
        this.replace(tr, new Slice(Fragment.from(node), 0, 0));
    }

    /**
     * Iterates over all cells in the selection, calling the provided callback
     * for each cell with the cell node and its absolute document position.
     *
     * @param callbackFunc - Function to call for each cell.
     *                       Receives the cell node and its document position.
     *
     * @example
     * ```typescript
     * selection.forEachCell((cell, pos) => {
     *     console.log(`Cell at ${pos} has ${cell.childCount} children`);
     * });
     * ```
     */
    public forEachCell(callbackFunc: (node: PmNode, pos: number) => void): void {
        const table: PmNode = this._$anchorCell.node(-1);
        const map: TableMap = TableMap.get(table);
        const tableStart: number = this._$anchorCell.start(-1);

        const cells: Array<number> = map.cellsInRect(
            map.rectBetween(
                this._$anchorCell.pos - tableStart,
                this._$headCell.pos - tableStart,
            ),
        );

        for (const cellOffset of cells) {
            const cell: PmNode = table.nodeAt(cellOffset);
            if (cell) {
                callbackFunc(cell, tableStart + cellOffset);
            }
        }
    }

    /**
     * Checks whether this selection spans entire columns (from top to bottom of the table).
     *
     * A selection is a column selection if both the anchor and head cells
     * together span from the first row to the last row of the table.
     *
     * @returns `true` if this selection spans complete columns, `false` otherwise.
     */
    public isColSelection(): boolean {
        const anchorTop: number = this._$anchorCell.index(-1);
        const headTop: number = this._$headCell.index(-1);

        // If either cell is not in the first row, it's not a full column selection
        if (Math.min(anchorTop, headTop) > 0) {
            return false;
        }

        // Calculate the bottom row indices considering rowspan
        const anchorBottom: number = anchorTop + (this._$anchorCell.nodeAfter?.attrs.rowspan as number ?? 1);
        const headBottom: number = headTop + (this._$headCell.nodeAfter?.attrs.rowspan as number ?? 1);

        // Check if either cell reaches the last row of the table
        return Math.max(anchorBottom, headBottom) === this._$headCell.node(-1).childCount;
    }

    /**
     * Checks whether this selection spans entire rows (from left to right of the table).
     *
     * A selection is a row selection if both the anchor and head cells
     * together span from the first column to the last column of the table.
     *
     * @returns `true` if this selection spans complete rows, `false` otherwise.
     */
    public isRowSelection(): boolean {
        const table: PmNode = this._$anchorCell.node(-1);
        const map: TableMap = TableMap.get(table);
        const tableStart: number = this._$anchorCell.start(-1);

        // Get the leftmost column index of each cell
        const anchorLeft: number = map.colCount(this._$anchorCell.pos - tableStart);
        const headLeft: number = map.colCount(this._$headCell.pos - tableStart);

        // If either cell is not in the first column, it's not a full row selection
        if (Math.min(anchorLeft, headLeft) > 0) {
            return false;
        }

        // Calculate the rightmost column indices considering colspan
        const anchorRight: number = anchorLeft + (this._$anchorCell.nodeAfter?.attrs.colspan as number ?? 1);
        const headRight: number = headLeft + (this._$headCell.nodeAfter?.attrs.colspan as number ?? 1);

        // Check if either cell reaches the last column of the table
        return Math.max(anchorRight, headRight) === map.width;
    }

    /**
     * Compares this selection with another for equality.
     *
     * Two CellSelections are equal if they have the same anchor and head positions.
     *
     * @param other - The object to compare with.
     * @returns `true` if the selections are equal, `false` otherwise.
     */
    public eq(other: unknown): boolean {
        return (
            other instanceof CellSelection
            && other._$anchorCell.pos === this._$anchorCell.pos
            && other._$headCell.pos === this._$headCell.pos
        );
    }

    /**
     * Converts this selection to a JSON-serializable object.
     *
     * @returns A CellSelectionJSON object representing this selection.
     */
    public toJSON(): CellSelectionJSON {
        return {
            type: 'cell',
            anchor: this._$anchorCell.pos,
            head: this._$headCell.pos
        };
    }

    /**
     * Returns a bookmark that can be used to recreate this selection after document changes.
     *
     * @returns A CellBookmark representing this selection's position.
     */
    public override getBookmark(): CellBookmark {
        return new CellBookmark(this._$anchorCell.pos, this._$headCell.pos);
    }

    /**
     * Extracts row nodes for the specified rectangular selection area.
     *
     * @param table - The table node containing the cells.
     * @param map - The TableMap for the table.
     * @param rect - The rectangular selection area.
     * @returns An array of row nodes with adjusted cell spans.
     */
    private extractRowsForRect(table: PmNode, map: TableMap, rect: Rect): Array<PmNode> {
        // Track cells we've already processed (important for cells spanning multiple columns/rows)
        const seen = new Set<number>();
        const rows: Array<PmNode> = [];

        for (let row = rect.top; row < rect.bottom; row++) {
            const rowContent: Array<PmNode> = this.extractRowContent(table, map, rect, row, seen);
            rows.push(table.child(row).copy(Fragment.from(rowContent)));
        }

        return rows;
    }

    /**
     * Extracts cell content for a single row within the selection rectangle.
     *
     * @param table - The table node containing the cells.
     * @param map - The TableMap for the table.
     * @param rect - The rectangular selection area.
     * @param row - The current row index.
     * @param seen - Set of already processed cell positions (for spanning cells).
     * @returns An array of cell nodes for the row.
     */
    private extractRowContent(table: PmNode,
                              map: TableMap,
                              rect: Rect,
                              row: number,
                              seen: Set<number>): Array<PmNode> {
        const rowContent: Array<PmNode> = [];

        for (let col = rect.left; col < rect.right; col++) {
            const index: number = row * map.width + col;
            const pos: number = map.map[index];

            // Skip if we've already processed this cell (happens with spanning cells)
            if (seen.has(pos)) {
                continue;
            }
            seen.add(pos);

            const cellRect: Rect = map.findCell(pos);
            const cell: PmNode = this.adjustCellForRect(table, pos, cellRect, rect);
            rowContent.push(cell);
        }

        return rowContent;
    }

    /**
     * Adjusts a cell's colspan/rowspan attributes to fit within the selection rectangle.
     *
     * @param table - The table node containing the cell.
     * @param pos - The position of the cell within the table.
     * @param cellRect - The rectangle describing the cell's span.
     * @param selectionRect - The selection rectangle.
     * @returns The adjusted cell node.
     * @throws {RangeError} If the cell cannot be found or created.
     */
    private adjustCellForRect(table: PmNode,
                              pos: number,
                              cellRect: Rect,
                              selectionRect: Rect): PmNode {
        let cell: PmNode | null = table.nodeAt(pos);
        if (!cell) {
            throw new RangeError(`No cell with offset ${pos} found`);
        }

        cell = this.adjustCellColspan(cell, cellRect, selectionRect);
        cell = this.adjustCellRowspan(cell, cellRect, selectionRect);

        return cell;
    }

    /**
     * Adjusts cell colspan if it extends beyond the selection rectangle.
     *
     * @param cell - The cell node to adjust.
     * @param cellRect - The rectangle describing the cell's span.
     * @param selectionRect - The selection rectangle.
     * @returns The adjusted cell node.
     */
    private adjustCellColspan(cell: PmNode, cellRect: Rect, selectionRect: Rect): PmNode {
        const extraLeft: number = selectionRect.left - cellRect.left;
        const extraRight: number = cellRect.right - selectionRect.right;

        if (extraLeft <= 0 && extraRight <= 0) {
            return cell;
        }

        let attrs: CellAttrs = cell.attrs as CellAttrs;

        if (extraLeft > 0) {
            attrs = removeColSpan(attrs, 0, extraLeft);
        }
        if (extraRight > 0) {
            attrs = removeColSpan(attrs, attrs.colspan - extraRight, extraRight);
        }

        // If cell starts before selection, create empty cell; otherwise preserve content
        if (cellRect.left < selectionRect.left) {
            const newCell: PmNode = cell.type.createAndFill(attrs);
            if (!newCell) {
                throw new RangeError(`Could not create cell with attrs ${JSON.stringify(attrs)}`);
            }
            return newCell;
        }

        return cell.type.create(attrs, cell.content);
    }

    /**
     * Adjusts cell rowspan if it extends beyond the selection rectangle.
     *
     * @param cell - The cell node to adjust.
     * @param cellRect - The rectangle describing the cell's span.
     * @param selectionRect - The selection rectangle.
     * @returns The adjusted cell node.
     */
    private adjustCellRowspan(cell: PmNode, cellRect: Rect, selectionRect: Rect): PmNode {
        if (cellRect.top >= selectionRect.top && cellRect.bottom <= selectionRect.bottom) {
            return cell;
        }

        const attrs = {
            ...cell.attrs,
            rowspan: Math.min(cellRect.bottom, selectionRect.bottom) - Math.max(cellRect.top, selectionRect.top),
        };

        // If cell starts before selection, create empty cell; otherwise preserve content
        if (cellRect.top < selectionRect.top) {
            return cell.type.createAndFill(attrs) ?? cell;
        }

        return cell.type.create(attrs, cell.content);
    }
}

Selection.registerJsonDeserializerClass('cell', CellSelection);
