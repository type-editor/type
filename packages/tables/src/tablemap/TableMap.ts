import type {PmNode} from '@type-editor/model';

import type {Problem} from '../types/tablemap/Problem';
import type {Rect} from '../types/tablemap/Rect';
import {computeMap} from './compute-map';
import {StandardTableMapCache} from './StandardTableMapCache';


/**
 * A table map describes the structure of a given table. To avoid
 * recomputing them all the time, they are cached per table node. To
 * be able to do that, positions saved in the map are relative to the
 * start of the table, rather than the start of the document.
 */
export class TableMap {

    private readonly _width: number;
    private readonly _height: number;
    private readonly _map: Array<number>;
    private _problems: Array<Problem> | null;

    /**
     *
     * @param width - The number of columns
     * @param height - The number of rows
     * @param map - A width * height array with the start position of
     * the cell covering that part of the table in each slot.
     * @param problems - An optional array of problems (cell overlap or non-rectangular
     * shape) for the table, used by the table normalizer.
     */
    constructor(width: number,
                height: number,
                map: Array<number>,
                problems: Array<Problem> | null) {
        this._width = width;
        this._height = height;
        this._map = map;
        this._problems = problems;
    }

    get problems(): Array<Problem> {
        return this._problems;
    }

    set problems(problems: Array<Problem>) {
        this._problems = problems;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get map(): Array<number> {
        return this._map;
    }

    /**
     * Find the table map for the given table node.
     * Results are cached, so subsequent calls with the same node are efficient.
     *
     * @param table - The table node to get the map for
     * @returns The TableMap for the given table node
     * @throws {RangeError} If the provided node is not a table
     */
    public static get(table: PmNode): TableMap {
        return StandardTableMapCache.get(table) || StandardTableMapCache.set(table, computeMap(table));
    }

    /**
     * Find the dimensions of the cell at the given position.
     *
     * @param pos - The table-relative position of the cell
     * @returns A Rect describing the cell's boundaries in the grid
     * @throws {RangeError} If no cell exists at the given position
     */
    public findCell(pos: number): Rect {
        for (let i = 0; i < this._map.length; i++) {
            const curPos: number = this._map[i];
            if (curPos !== pos) {
                continue;
            }

            const left: number = i % this._width;
            const top: number = (i / this._width) | 0;
            let right: number = left + 1;
            let bottom: number = top + 1;

            for (let j = 1; right < this._width && this._map[i + j] === curPos; j++) {
                right++;
            }

            for (
                let j = 1;
                bottom < this._height && this._map[i + this._width * j] === curPos;
                j++
            ) {
                bottom++;
            }

            return {left, top, right, bottom};
        }

        throw new RangeError(`No cell with offset ${pos} found`);
    }

    /**
     * Find the left side (column index) of the cell at the given position.
     *
     * @param pos - The table-relative position of the cell
     * @returns The 0-based column index where the cell starts
     * @throws {RangeError} If no cell exists at the given position
     */
    public colCount(pos: number): number {
        for (let i = 0; i < this._map.length; i++) {
            if (this._map[i] === pos) {
                return i % this._width;
            }
        }

        throw new RangeError(`No cell with offset ${pos} found`);
    }

    /**
     * Find the next cell in the given direction, starting from the cell at `pos`, if any.
     *
     * @param pos - The table-relative position of the starting cell
     * @param axis - The direction axis: 'horiz' for horizontal, 'vert' for vertical
     * @param dir - The direction: negative for left/up, positive for right/down
     * @returns The position of the adjacent cell, or null if at table boundary
     */
    public nextCell(pos: number, axis: 'horiz' | 'vert', dir: number): null | number {
        const {left, right, top, bottom} = this.findCell(pos);

        if (axis === 'horiz') {
            if (dir < 0 ? left === 0 : right === this._width) {
                return null;
            }
            return this._map[top * this._width + (dir < 0 ? left - 1 : right)];
        } else {
            if (dir < 0 ? top === 0 : bottom === this._height) {
                return null;
            }
            return this._map[left + this._width * (dir < 0 ? top - 1 : bottom)];
        }
    }

    /**
     * Get the rectangle spanning the two given cells.
     *
     * @param a - The table-relative position of the first cell
     * @param b - The table-relative position of the second cell
     * @returns A Rect that encompasses both cells
     */
    public rectBetween(a: number, b: number): Rect {
        const {
            left: leftA,
            right: rightA,
            top: topA,
            bottom: bottomA,
        } = this.findCell(a);

        const {
            left: leftB,
            right: rightB,
            top: topB,
            bottom: bottomB,
        } = this.findCell(b);

        return {
            left: Math.min(leftA, leftB),
            top: Math.min(topA, topB),
            right: Math.max(rightA, rightB),
            bottom: Math.max(bottomA, bottomB),
        };
    }

    /**
     * Return the position of all cells that have the top left corner in
     * the given rectangle.
     *
     * @param rect - The rectangular region to search within
     * @returns Array of table-relative positions of cells with top-left corners in the rect
     */
    public cellsInRect(rect: Rect): Array<number> {
        const result: Array<number> = [];
        const seen: Record<number, boolean> = {};

        for (let row = rect.top; row < rect.bottom; row++) {
            for (let col = rect.left; col < rect.right; col++) {
                const index: number = row * this._width + col;
                const pos: number = this._map[index];

                if (seen[pos]) {
                    continue;
                }

                seen[pos] = true;

                if ((col === rect.left && col && this._map[index - 1] === pos)
                    || (row === rect.top && row && this._map[index - this._width] === pos)) {
                    continue;
                }

                result.push(pos);
            }
        }
        return result;
    }

    /**
     * Return the position at which the cell at the given row and column
     * starts, or would start, if a cell started there.
     *
     * @param row - The 0-based row index
     * @param col - The 0-based column index
     * @param table - The table node
     * @returns The table-relative position where the cell at (row, col) starts
     */
    public positionAt(row: number, col: number, table: PmNode): number {
        for (let i = 0, rowStart = 0; ; i++) {
            const rowEnd: number = rowStart + table.child(i).nodeSize;
            if (i === row) {
                let index: number = col + row * this._width;
                const rowEndIndex: number = (row + 1) * this._width;

                // Skip past cells from previous rows (via rowspan)
                while (index < rowEndIndex && this._map[index] < rowStart) {
                    index++;
                }

                return index === rowEndIndex ? rowEnd - 1 : this._map[index];
            }
            rowStart = rowEnd;
        }
    }
}
