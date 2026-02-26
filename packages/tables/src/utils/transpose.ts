/**
 * Transposes a 2D array by flipping columns to rows.
 *
 * Transposition is a familiar algebra concept where the matrix is flipped
 * along its diagonal. For more details, see:
 * https://en.wikipedia.org/wiki/Transpose
 *
 * @example
 * ```javascript
 * const arr = [
 *   ['a1', 'a2', 'a3'],
 *   ['b1', 'b2', 'b3'],
 *   ['c1', 'c2', 'c3'],
 *   ['d1', 'd2', 'd3'],
 * ];
 *
 * const result = transpose(arr);
 * result === [
 *   ['a1', 'b1', 'c1', 'd1'],
 *   ['a2', 'b2', 'c2', 'd2'],
 *   ['a3', 'b3', 'c3', 'd3'],
 * ]
 * ```
 */
export function transpose<T>(array: ReadonlyArray<ReadonlyArray<T>>): Array<Array<T>> {
    if (array.length === 0 || array[0].length === 0) {
        return [];
    }
    // Use minimum row length to safely handle jagged arrays
    const columnCount: number = Math.min(...array.map((row: ReadonlyArray<T>): number => row.length));
    if (columnCount === 0) {
        return [];
    }
    const result: Array<Array<T>> = [];
    for (let i = 0; i < columnCount; i++) {
        const newRow: Array<T> = [];
        for (let j = 0; j < array.length; j++) {
            newRow.push(array[j][i]);
        }
        result.push(newRow);
    }
    return result;
}
