/**
 * Direction indicator for row movement.
 * - `-1`: Moving backward/upward (toward smaller indexes)
 * - `0`: Natural direction based on origin/target positions
 * - `1`: Moving forward/downward (toward larger indexes)
 */
export type MoveDirection = -1 | 0 | 1;

/**
 * Moves one or more consecutive elements from the origin position to a target position
 * within an array of rows. Supports both single and multi-row operations.
 *
 * The function handles complex scenarios including:
 * - Moving a single row up or down
 * - Moving multiple consecutive rows (e.g., merged cells spanning multiple rows)
 * - Direction overrides for precise positioning control
 *
 * @example
 * ```typescript
 * // Moving a single row down
 * const rows = [0, 1, 2, 3, 4];
 * moveRowInArrayOfRows(rows, [1], [3], 0);
 * // Result: [0, 2, 3, 1, 4]
 *
 * // Moving multiple consecutive rows up
 * const rows2 = [0, 1, 2, 3, 4, 5];
 * moveRowInArrayOfRows(rows2, [4, 5], [1, 2], 0);
 * // Result: [0, 4, 5, 1, 2, 3]
 * ```
 *
 * @typeParam T - The type of elements in the rows array.
 * @param rows - The array of rows to modify. This array is mutated in place.
 * @param indexesOrigin - Array of consecutive indexes to move. For merged cells,
 *                        this contains all row indexes that are part of the span.
 * @param indexesTarget - Array of target indexes. Used to determine the insertion point.
 * @param directionOverride - Controls the insertion position relative to the target:
 *                            - `-1`: Insert before the target position
 *                            - `0`: Use natural direction based on movement
 *                            - `1`: Insert after the target position
 * @returns The modified array (same reference as the input array).
 */
export function moveRowInArrayOfRows<T>(rows: Array<T>,
                                        indexesOrigin: Array<number>,
                                        indexesTarget: Array<number>,
                                        directionOverride: MoveDirection): Array<T> {
    // Guard: Return early if inputs are invalid
    if (
        rows.length === 0 ||
        indexesOrigin.length === 0 ||
        indexesTarget.length === 0
    ) {
        return rows;
    }

    const originStart: number = indexesOrigin[0];
    const targetStart: number = indexesTarget[0];

    // Guard: Return early if moving to the same position
    if (originStart === targetStart) {
        return rows;
    }

    // Determine natural movement direction: -1 for moving up, 1 for moving down
    const naturalDirection: MoveDirection = originStart > targetStart ? -1 : 1;

    // Extract the rows to be moved
    const extractedRows: Array<T> = rows.splice(originStart, indexesOrigin.length);

    // Calculate the target insertion position
    const targetPosition: number = calculateTargetPosition(
        extractedRows.length,
        indexesTarget,
        naturalDirection,
        directionOverride,
    );

    // Insert the extracted rows at the calculated position
    rows.splice(targetPosition, 0, ...extractedRows);

    return rows;
}

/**
 * Calculates the target insertion position based on direction settings and target indexes.
 *
 * @param extractedCount - The number of rows being moved.
 * @param indexesTarget - Array of target indexes.
 * @param naturalDirection - The natural direction of movement based on origin/target positions.
 * @param directionOverride - The direction override setting.
 * @returns The calculated target position for insertion.
 */
function calculateTargetPosition(extractedCount: number,
                                 indexesTarget: Array<number>,
                                 naturalDirection: MoveDirection,
                                 directionOverride: MoveDirection): number {
    // Offset adjustment for even-length extractions
    const positionOffset = extractedCount % 2 === 0 ? 1 : 0;

    // Force insertion before target when moving down but override says "before"
    if (directionOverride === -1 && naturalDirection === 1) {
        return indexesTarget[0] - 1;
    }

    // Force insertion after target when moving up but override says "after"
    if (directionOverride === 1 && naturalDirection === -1) {
        return indexesTarget[indexesTarget.length - 1] - positionOffset + 1;
    }

    // Use natural direction positioning
    return naturalDirection === -1
        ? indexesTarget[0]
        : indexesTarget[indexesTarget.length - 1] - positionOffset;
}

