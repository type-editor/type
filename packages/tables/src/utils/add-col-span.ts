import type {Attrs} from '@type-editor/model';

import type {CellAttrs} from '../types/CellAttrs';


/**
 * Creates new cell attributes with increased colspan.
 *
 * Adds the specified number of columns to the cell's span,
 * inserting zeros at the specified position in the colwidth array
 * if it exists.
 *
 * @param attrs - The current cell attributes.
 * @param pos - The position within the colwidth array to insert at.
 * @param n - The number of columns to add. Defaults to 1.
 * @returns A new attributes object with the updated colspan and colwidth.
 *
 * @example
 * ```typescript
 * const attrs = { colspan: 2, rowspan: 1, colwidth: [100, 200] };
 * const newAttrs = addColSpan(attrs, 1, 1);
 * // newAttrs = { colspan: 3, rowspan: 1, colwidth: [100, 0, 200] }
 * ```
 */
export function addColSpan(attrs: CellAttrs, pos: number, n = 1): Attrs {
    const result = {...attrs, colspan: attrs.colspan + n};

    if (result.colwidth) {
        result.colwidth = result.colwidth.slice();

        // Insert n zero-width entries at the specified position
        const zeros: Array<number> = Array.from({length: n}, () => 0);
        result.colwidth.splice(pos, 0, ...zeros);
    }

    return result;
}
