import type {PmNode} from '@type-editor/model';

import type {CellAttrs} from '../types/CellAttrs';


/**
 * Result of processing column widths for a table row.
 */
interface ColumnWidthResult {
    /**
     * The total width of all columns in pixels.
     */
    totalWidth: number;

    /**
     * Whether all columns have explicit fixed widths.
     */
    allColumnsHaveFixedWidth: boolean;
}


/**
 * Updates the column widths of a table's colgroup to match the document state.
 *
 * This function synchronizes the visual column widths (via `<col>` elements in the colgroup)
 * with the column width attributes stored in the table cells. It handles:
 * - Creating new `<col>` elements when needed
 * - Updating existing `<col>` element widths
 * - Removing excess `<col>` elements
 * - Setting the table's overall width or min-width based on column configuration
 *
 * @param node - The table node from the document.
 * @param colgroup - The HTML colgroup element to update.
 * @param table - The HTML table element to update width on.
 * @param defaultCellMinWidth - The default minimum width in pixels for cells without explicit widths.
 * @param overrideCol - Optional column index whose width should be overridden (used during drag resizing).
 * @param overrideValue - Optional width value to use for the overrideCol (used during drag resizing).
 */
export function updateColumnsOnResize(node: PmNode,
                                      colgroup: HTMLTableColElement,
                                      table: HTMLTableElement,
                                      defaultCellMinWidth: number,
                                      overrideCol?: number,
                                      overrideValue?: number): void {
    const firstRow: PmNode = node.firstChild;
    if (!firstRow) {
        return;
    }

    const result = processRowColumns(
        firstRow,
        colgroup,
        defaultCellMinWidth,
        overrideCol,
        overrideValue,
    );

    removeExcessColElements(colgroup, result.lastProcessedColElement);
    applyTableWidth(table, result.totalWidth, result.allColumnsHaveFixedWidth);
}


/**
 * Processes all columns in a table row and updates/creates the corresponding col elements.
 *
 * @param row - The first row of the table containing cell definitions.
 * @param colgroup - The colgroup element containing col elements.
 * @param defaultCellMinWidth - The default minimum width for cells without explicit widths.
 * @param overrideCol - Optional column index to override.
 * @param overrideValue - Optional width value for the override column.
 * @returns The processing result including total width and fixed width status.
 */
function processRowColumns(row: PmNode,
                           colgroup: HTMLTableColElement,
                           defaultCellMinWidth: number,
                           overrideCol?: number,
                           overrideValue?: number): ColumnWidthResult & { lastProcessedColElement: HTMLElement | null } {
    let totalWidth = 0;
    let allColumnsHaveFixedWidth = true;
    let currentColElement: HTMLElement | null = colgroup.firstChild as HTMLElement;
    let columnIndex = 0;

    for (let cellIndex = 0; cellIndex < row.childCount; cellIndex++) {
        const cell: PmNode = row.child(cellIndex);
        const {colspan, colwidth} = cell.attrs as CellAttrs;
        const effectiveColspan = colspan || 1;

        for (let spanIndex = 0; spanIndex < effectiveColspan; spanIndex++) {
            const columnWidth: number = getColumnWidth(
                columnIndex,
                spanIndex,
                colwidth,
                overrideCol,
                overrideValue,
            );

            const hasExplicitWidth: boolean = columnWidth !== undefined && columnWidth !== null;
            const cssWidth: string = hasExplicitWidth ? `${columnWidth}px` : '';
            totalWidth += hasExplicitWidth ? columnWidth : defaultCellMinWidth;

            if (!hasExplicitWidth) {
                allColumnsHaveFixedWidth = false;
            }

            currentColElement = updateOrCreateColElement(
                colgroup,
                currentColElement,
                cssWidth,
            );

            columnIndex++;
        }
    }

    return {
        totalWidth,
        allColumnsHaveFixedWidth,
        lastProcessedColElement: currentColElement,
    };
}

/**
 * Determines the width for a specific column, considering any override values.
 *
 * @param columnIndex - The current column index in the table.
 * @param spanIndex - The index within the cell's colspan.
 * @param colwidth - The array of column widths from the cell attributes, or null.
 * @param overrideCol - Optional column index to override.
 * @param overrideValue - Optional width value for the override column.
 * @returns The column width in pixels, or undefined if no explicit width is set.
 */
function getColumnWidth(columnIndex: number,
                        spanIndex: number,
                        colwidth: Array<number> | null,
                        overrideCol?: number,
                        overrideValue?: number): number | undefined {
    if (overrideCol === columnIndex) {
        return overrideValue;
    }
    return colwidth?.[spanIndex];
}

/**
 * Updates an existing col element's width or creates a new one if needed.
 *
 * @param colgroup - The colgroup element to append new col elements to.
 * @param currentColElement - The current col element being processed, or null if none exists.
 * @param cssWidth - The CSS width value to set (e.g., "100px" or "").
 * @returns The next col element to process (sibling of current), or null if at the end.
 */
function updateOrCreateColElement(colgroup: HTMLTableColElement,
                                  currentColElement: HTMLElement | null,
                                  cssWidth: string): HTMLElement | null {
    if (!currentColElement) {
        const newColElement: HTMLTableColElement = document.createElement('col');
        newColElement.style.width = cssWidth;
        colgroup.appendChild(newColElement);
        return null;
    }

    if (currentColElement.style.width !== cssWidth) {
        currentColElement.style.width = cssWidth;
    }

    return currentColElement.nextSibling as HTMLElement | null;
}

/**
 * Removes any excess col elements that are no longer needed.
 *
 * @param colgroup - The colgroup element containing the col elements.
 * @param startElement - The first col element to remove, or null if none should be removed.
 */
function removeExcessColElements(colgroup: HTMLTableColElement,
                                 startElement: HTMLElement | null): void {
    let elementToRemove: HTMLElement = startElement;

    while (elementToRemove) {
        const nextElement = elementToRemove.nextSibling as HTMLElement | null;
        colgroup.removeChild(elementToRemove);
        elementToRemove = nextElement;
    }
}

/**
 * Applies the appropriate width styling to the table element.
 *
 * If all columns have fixed widths, the table gets an exact width.
 * Otherwise, the table gets a minimum width to allow flexible columns to expand.
 *
 * @param table - The table element to style.
 * @param totalWidth - The total width of all columns in pixels.
 * @param hasFixedWidth - Whether all columns have explicit fixed widths.
 */
function applyTableWidth(table: HTMLTableElement,
                         totalWidth: number,
                         hasFixedWidth: boolean): void {
    if (hasFixedWidth) {
        table.style.width = `${totalWidth}px`;
        table.style.minWidth = '';
    } else {
        table.style.width = '';
        table.style.minWidth = `${totalWidth}px`;
    }
}
