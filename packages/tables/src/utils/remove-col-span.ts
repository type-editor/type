import type {CellAttrs} from '../types/CellAttrs';


/**
 * Creates new cell attributes with reduced colspan.
 *
 * Removes the specified number of columns from the cell's span,
 * updating the colwidth array accordingly. If all remaining column
 * widths are zero, the colwidth is set to null.
 *
 * @param attrs - The current cell attributes.
 * @param pos - The position within the colwidth array to start removing from.
 * @param n - The number of columns to remove. Defaults to 1.
 * @returns A new CellAttrs object with the updated colspan and colwidth.
 *
 * @example
 * ```typescript
 * const attrs = { colspan: 3, rowspan: 1, colwidth: [100, 200, 300] };
 * const newAttrs = removeColSpan(attrs, 1, 1);
 * // newAttrs = { colspan: 2, rowspan: 1, colwidth: [100, 300] }
 * ```
 */
export function removeColSpan(attrs: CellAttrs, pos: number, n = 1): CellAttrs {
    const result: CellAttrs = {...attrs, colspan: attrs.colspan - n};

    if (result.colwidth) {
        result.colwidth = result.colwidth.slice();
        result.colwidth.splice(pos, n);

        // Clear colwidth if no meaningful widths remain
        const hasPositiveWidth: boolean = result.colwidth.some((width) => width > 0);
        if (!hasPositiveWidth) {
            result.colwidth = null;
        }
    }

    return result;
}
