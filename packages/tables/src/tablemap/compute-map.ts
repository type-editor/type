import {isUndefinedOrNull} from '@type-editor/commons';
import type {Attrs, PmNode} from '@type-editor/model';

import type {CellAttrs} from '../types/CellAttrs';
import type {ColWidths} from '../types/tablemap/ColWidths';
import type {Problem} from '../types/tablemap/Problem';
import {TableMap} from './TableMap';


/**
 * Context object for tracking state during table map computation.
 */
interface MapComputationContext {
    /** The table width (number of columns) */
    width: number;
    /** The table height (number of rows) */
    height: number;
    /** The position map being built */
    map: Array<number>;
    /** Current position in the map */
    mapPos: number;
    /** Array of detected problems */
    problems: Array<Problem> | null;
    /** Column width tracking: alternates between [width, count, width, count, ...] */
    colWidths: ColWidths;
}


/**
 * Compute a table map for the given table node.
 *
 * The map is a flat array where each element represents a cell in the grid.
 * The value at each position is the table-relative offset of the cell that
 * covers that grid position. Cells with colspan/rowspan will appear multiple
 * times in the array.
 *
 * @param table - The table node to compute the map for
 * @returns A TableMap describing the table structure
 * @throws {RangeError} If the provided node is not a table
 */
export function computeMap(table: PmNode): TableMap {
    if (table.type.spec.tableRole !== 'table') {
        throw new RangeError('Not a table node: ' + table.type.name);
    }

    const width: number = findWidth(table);
    const height: number = table.childCount;

    // Initialize the computation context
    const ctx: MapComputationContext = {
        width,
        height,
        map: new Array<number>(width * height).fill(0),
        mapPos: 0,
        problems: null,
        colWidths: [],
    };

    // Process each row
    let pos = 0;
    for (let row = 0; row < height; row++) {
        pos = processRow(ctx, table, row, pos);
    }

    // Check for zero-sized table
    if (width === 0 || height === 0) {
        ctx.problems = addProblem(ctx.problems, {type: 'zero_sized'});
    }

    const tableMap = new TableMap(width, height, ctx.map, ctx.problems);

    // Check for and report column width inconsistencies
    if (hasInconsistentWidths(ctx.colWidths, height)) {
        findBadColWidths(tableMap, ctx.colWidths, table);
    }

    return tableMap;
}

/**
 * Calculate the width (number of columns) of a table.
 *
 * This accounts for both colspan and rowspan attributes to determine
 * the maximum width needed to represent all cells in the table.
 *
 * @param table - The table node to measure
 * @returns The number of columns in the table
 */
function findWidth(table: PmNode): number {
    if (table.childCount === 0) {
        return 0;
    }

    let width = -1;
    // Track rowspan contributions incrementally: array of remaining rowspan counts per "column slot"
    // Each entry is [remainingRows, colspan]
    const activeRowspans: Array<{ remainingRows: number, colspan: number }> = [];

    for (let row = 0; row < table.childCount; row++) {
        const rowNode: PmNode = table.child(row);
        let rowWidth = 0;

        // Add width from active rowspans extending into this row
        for (let i = activeRowspans.length - 1; i >= 0; i--) {
            const span = activeRowspans[i];
            if (span.remainingRows > 0) {
                rowWidth += span.colspan;
                span.remainingRows--;
            }
            // Remove expired rowspans
            if (span.remainingRows <= 0) {
                activeRowspans.splice(i, 1);
            }
        }

        // Add width from cells in this row and track new rowspans
        for (let i = 0; i < rowNode.childCount; i++) {
            const cell: PmNode = rowNode.child(i);
            const colspan = cell.attrs.colspan as number;
            const rowspan = cell.attrs.rowspan as number;

            rowWidth += colspan;

            // Track new rowspans that extend beyond this row
            if (rowspan > 1) {
                activeRowspans.push({
                    remainingRows: rowspan - 1,
                    colspan
                });
            }
        }

        // Update the maximum width
        if (width === -1) {
            width = rowWidth;
        } else if (width !== rowWidth) {
            width = Math.max(width, rowWidth);
        }
    }

    return width;
}

/**
 * Check if any columns have inconsistent widths.
 *
 * @param colWidths - The column widths tracking array
 * @param height - The table height
 * @returns true if there are width inconsistencies
 */
function hasInconsistentWidths(colWidths: ColWidths, height: number): boolean {
    for (let i = 0; i < colWidths.length; i += 2) {
        if (!isUndefinedOrNull(colWidths[i]) && colWidths[i + 1] < height) {
            return true;
        }
    }
    return false;
}

/**
 * Find cells with inconsistent column widths and add problems to the map.
 *
 * For columns that have defined widths but whose widths disagree between rows,
 * this function identifies cells whose width doesn't match the computed one
 * and adds 'colwidth mismatch' problems.
 *
 * @param map - The table map to check and update
 * @param colWidths - The column width tracking array (alternating width, count pairs)
 * @param table - The table node
 */
function findBadColWidths(map: TableMap, colWidths: ColWidths, table: PmNode): void {
    if (!map.problems) {
        map.problems = [];
    }

    const seen: Record<number, boolean> = {};

    for (let i = 0; i < map.map.length; i++) {
        const pos: number = map.map[i];

        // Skip cells we've already processed
        if (seen[pos]) {
            continue;
        }
        seen[pos] = true;

        const node: PmNode = table.nodeAt(pos);
        if (!node) {
            throw new RangeError(`No cell with offset ${pos} found`);
        }

        const attrs = node.attrs as CellAttrs;
        let updated: ColWidths = null;

        // Check each column the cell spans
        for (let j = 0; j < attrs.colspan; j++) {
            const col: number = (i + j) % map.width;
            const expectedWidth: number = colWidths[col * 2];

            // If there's an expected width that doesn't match the cell's width
            if (!isUndefinedOrNull(expectedWidth) && attrs.colwidth?.[j] !== expectedWidth) {
                updated ??= freshColWidth(attrs);
                updated[j] = expectedWidth;
            }
        }

        if (updated) {
            map.problems.unshift({
                type: 'colwidth mismatch',
                pos,
                colwidth: updated,
            });
        }
    }
}

/**
 * Create a new column width array for a cell, copying existing widths if present.
 *
 * @param attrs - The cell attributes
 * @returns A new ColWidths array initialized from the cell's colwidth attribute
 *          or filled with zeros
 */
function freshColWidth(attrs: Attrs): ColWidths {
    if (attrs.colwidth) {
        return (attrs.colwidth as ColWidths).slice();
    }

    // Create array of zeros with length equal to colspan
    return new Array<number>(attrs.colspan as number).fill(0);
}

/**
 * Process a single row, updating the map and detecting missing cells.
 *
 * @param ctx - The computation context
 * @param table - The table node
 * @param row - The current row index
 * @param pos - The current position (will be mutated)
 * @returns The updated position after processing the row
 */
function processRow(ctx: MapComputationContext,
                    table: PmNode,
                    row: number,
                    pos: number): number {
    const rowNode: PmNode = table.child(row);
    // Skip the row's opening token
    pos++;

    for (let cellIndex = 0; ; cellIndex++) {
        // Skip already-filled positions (from rowspans)
        while (ctx.mapPos < ctx.map.length && ctx.map[ctx.mapPos] !== 0) {
            ctx.mapPos++;
        }

        if (cellIndex === rowNode.childCount) {
            break;
        }

        const cellNode: PmNode = rowNode.child(cellIndex);
        processCell(ctx, cellNode, pos, row);

        ctx.mapPos += cellNode.attrs.colspan as number;
        pos += cellNode.nodeSize;
    }

    // Check for missing cells at end of row
    const expectedPos: number = (row + 1) * ctx.width;
    let missing = 0;

    while (ctx.mapPos < expectedPos) {
        if (ctx.map[ctx.mapPos++] === 0) {
            missing++;
        }
    }

    if (missing) {
        ctx.problems = addProblem(ctx.problems, {type: 'missing', row, n: missing});
    }

    // Skip the row's closing token
    return pos + 1;
}

/**
 * Process a single cell, filling in its positions in the map and tracking column widths.
 *
 * @param ctx - The computation context
 * @param cellNode - The cell node being processed
 * @param cellPos - The table-relative position of the cell
 * @param row - The current row index
 */
function processCell(ctx: MapComputationContext,
                     cellNode: PmNode,
                     cellPos: number,
                     row: number): void {
    const {colspan, rowspan, colwidth} = cellNode.attrs;

    for (let h = 0; h < rowspan; h++) {
        // Check for rowspan exceeding table height
        if (h + row >= ctx.height) {
            ctx.problems = addProblem(ctx.problems, {
                type: 'overlong_rowspan',
                pos: cellPos,
                n: rowspan - h,
            });
            break;
        }

        const start: number = ctx.mapPos + h * ctx.width;

        for (let w = 0; w < colspan; w++) {
            const mapIndex: number = start + w;

            if (ctx.map[mapIndex] === 0) {
                ctx.map[mapIndex] = cellPos;
            } else {
                // Cell collision detected
                ctx.problems = addProblem(ctx.problems, {
                    type: 'collision',
                    row,
                    pos: cellPos,
                    n: colspan - w,
                });
            }

            // Track column widths
            const colW: number | undefined = colwidth ? (colwidth as Array<number>)[w] : undefined;
            if (!isUndefinedOrNull(colW)) {
                updateColWidthTracking(ctx.colWidths, mapIndex, ctx.width, colW);
            }
        }
    }
}

/**
 * Helper to add a problem to the problems array, initializing it if needed.
 *
 * @param problems - The current problems array (may be null)
 * @param problem - The problem to add
 * @returns The updated problems array
 */
function addProblem(problems: Array<Problem> | null, problem: Problem): Array<Problem> {
    if (!problems) {
        problems = [];
    }
    problems.push(problem);
    return problems;
}

/**
 * Updates the column width tracking array with a new width observation.
 *
 * @param colWidths - The column widths tracking array
 * @param mapIndex - The current map index
 * @param width - The table width
 * @param colW - The observed column width
 */
function updateColWidthTracking(colWidths: ColWidths,
                                mapIndex: number,
                                width: number,
                                colW: number): void {
    const widthIndex: number = (mapIndex % width) * 2;
    const prev: number = colWidths[widthIndex];

    if (isUndefinedOrNull(prev) || (prev !== colW && colWidths[widthIndex + 1] === 1)) {
        // First occurrence or override single previous value
        colWidths[widthIndex] = colW;
        colWidths[widthIndex + 1] = 1;
    } else if (prev === colW) {
        // Increment count for matching width
        colWidths[widthIndex + 1]++;
    }
}
