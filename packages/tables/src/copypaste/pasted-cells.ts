import {Fragment, type NodeType, type PmNode, type Schema, Slice} from '@type-editor/model';

import {tableNodeTypes} from '../schema';
import type {Area} from '../types/copypaste/Area';
import type {ColWidths} from '../types/tablemap/ColWidths';
import {fitSlice} from './fit-slice';

/** Table role identifier for row nodes. */
const TABLE_ROLE_ROW = 'row';
/** Table role identifier for cell nodes. */
const TABLE_ROLE_CELL = 'cell';
/** Table role identifier for header cell nodes. */
const TABLE_ROLE_HEADER_CELL = 'header_cell';
/** Table role identifier for table nodes. */
const TABLE_ROLE_TABLE = 'table';


/**
 * Extracts a rectangular area of cells from a slice.
 *
 * This function analyzes the content of a slice and, if it contains table cells
 * or rows, extracts them into a normalized rectangular {@link Area} structure.
 * The function handles partial selections by fitting them into complete rows.
 *
 * @param slice - The slice to extract cells from, typically from a clipboard operation.
 * @returns A rectangular {@link Area} containing the cells, or `null` if the slice
 *          doesn't contain table cells or rows.
 *
 * @example
 * ```typescript
 * const slice = view.state.doc.slice(from, to);
 * const cells = pastedCells(slice);
 * if (cells) {
 *   console.log(`Pasted ${cells.width}x${cells.height} cells`);
 * }
 * ```
 */
export function pastedCells(slice: Slice): Area | null {
    if (slice.size === 0) {
        return null;
    }

    const unwrappedContent = unwrapSliceContent(slice);
    if (!unwrappedContent) {
        return null;
    }

    const {content, openStart, openEnd} = unwrappedContent;
    const firstChild: PmNode = content.child(0);
    const role: string = firstChild.type.spec.tableRole as string;
    const schema: Schema = firstChild.type.schema;

    const rows: Array<Fragment> = extractRowsFromContent(content, role, schema, openStart, openEnd);
    if (!rows) {
        return null;
    }

    return ensureRectangular(schema, rows);
}

/**
 * Unwraps nested content from a slice until we reach table rows or cells.
 *
 * @param slice - The slice to unwrap.
 * @returns The unwrapped content with adjusted open depths, or null if empty.
 */
function unwrapSliceContent(slice: Slice): { content: Fragment; openStart: number; openEnd: number } | null {
    let {content, openStart, openEnd} = slice;

    // Unwrap single-child wrappers (like document or table nodes)
    while (
        content.childCount === 1
        && ((openStart > 0 && openEnd > 0) || content.child(0).type.spec.tableRole === TABLE_ROLE_TABLE)
        ) {
        openStart--;
        openEnd--;
        content = content.child(0).content;
    }

    if (content.childCount === 0) {
        return null;
    }

    return {content, openStart, openEnd};
}

/**
 * Extracts rows of cells from content based on the table role.
 *
 * @param content - The fragment containing the table content.
 * @param role - The table role of the first child ('row', 'cell', or 'header_cell').
 * @param schema - The document schema.
 * @param openStart - The open depth at the start of the slice.
 * @param openEnd - The open depth at the end of the slice.
 * @returns An array of row fragments, or null if the content is not table-related.
 */
function extractRowsFromContent(content: Fragment,
                                role: string,
                                schema: Schema,
                                openStart: number,
                                openEnd: number): Array<Fragment> | null {
    if (role === TABLE_ROLE_ROW) {
        return extractRowsFromRowContent(content, schema, openStart, openEnd);
    }

    if (role === TABLE_ROLE_CELL || role === TABLE_ROLE_HEADER_CELL) {
        return extractRowsFromCellContent(content, schema, openStart, openEnd);
    }

    return null;
}

/**
 * Extracts rows when the content consists of row nodes.
 *
 * @param content - The fragment containing row nodes.
 * @param schema - The document schema.
 * @param openStart - The open depth at the start.
 * @param openEnd - The open depth at the end.
 * @returns An array of row fragments.
 */
function extractRowsFromRowContent(content: Fragment,
                                   schema: Schema,
                                   openStart: number,
                                   openEnd: number): Array<Fragment> {
    const rows: Array<Fragment> = [];
    const rowNodeType: NodeType = tableNodeTypes(schema).row;

    for (let i = 0; i < content.childCount; i++) {
        let cells: Fragment = content.child(i).content;

        // Calculate how much of the slice is "open" at each end for this row
        const leftOpenDepth: number = i === 0 ? Math.max(0, openStart - 1) : 0;
        const rightOpenDepth: number = i < content.childCount - 1 ? 0 : Math.max(0, openEnd - 1);

        if (leftOpenDepth > 0 || rightOpenDepth > 0) {
            cells = fitSlice(rowNodeType, new Slice(cells, leftOpenDepth, rightOpenDepth)).content;
        }

        rows.push(cells);
    }

    return rows;
}

/**
 * Extracts a single row when the content consists of cell nodes.
 *
 * @param content - The fragment containing cell nodes.
 * @param schema - The document schema.
 * @param openStart - The open depth at the start.
 * @param openEnd - The open depth at the end.
 * @returns An array containing a single row fragment.
 */
function extractRowsFromCellContent(
    content: Fragment,
    schema: Schema,
    openStart: number,
    openEnd: number
): Array<Fragment> {
    const rowNodeType: NodeType = tableNodeTypes(schema).row;

    const rowContent: Fragment = (openStart > 0 || openEnd > 0)
        ? fitSlice(rowNodeType, new Slice(content, openStart, openEnd)).content
        : content;

    return [rowContent];
}

/**
 * Computes the dimensions and normalizes a set of rows to be rectangular.
 *
 * This function calculates the maximum width needed to contain all cells
 * (accounting for colspan/rowspan) and pads shorter rows with empty cells
 * to ensure all rows have the same width.
 *
 * @param schema - The document schema for creating empty cells.
 * @param rows - The rows to normalize, each containing cell fragments.
 * @returns A normalized rectangular {@link Area} structure.
 */
function ensureRectangular(schema: Schema, rows: Array<Fragment>): Area {
    const widths: ColWidths = [];
    for (let i = 0; i < rows.length; i++) {
        const row: Fragment = rows[i];

        for (let j = row.childCount - 1; j >= 0; j--) {
            const {rowspan, colspan} = row.child(j).attrs;
            for (let r = i; r < i + (rowspan as number); r++) {
                widths[r] = (widths[r] || 0) + (colspan as number);
            }
        }
    }

    let width = 0;
    for (const item of widths) {
        width = Math.max(width, item || 0);
    }

    for (let r = 0; r < widths.length; r++) {
        if (r >= rows.length) {
            rows.push(Fragment.empty);
        }

        const rowWidth = widths[r] || 0;
        if (rowWidth < width) {
            const empty: PmNode = tableNodeTypes(schema).cell.createAndFill();
            const cells: Array<PmNode> = [];
            for (let i = rowWidth; i < width; i++) {
                cells.push(empty);
            }

            rows[r] = rows[r].append(Fragment.from(cells));
        }
    }

    return {
        height: rows.length,
        width,
        rows
    };
}
