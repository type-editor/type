import type {Coords} from '../../types/dom-coords/Coords';
import type {Rect} from '../../types/dom-coords/Rect';


const RECT_TOLERANCE = 1;

/**
 * Check if coordinates are within a rectangle, with tolerance.
 *
 * @param coords - The coordinates to check
 * @param rect - The rectangle to check against
 * @returns True if coordinates are within or near the rectangle
 */
export function inRect(coords: Coords, rect: Rect): boolean {
    return coords.left >= rect.left - RECT_TOLERANCE
        && coords.left <= rect.right + RECT_TOLERANCE
        && coords.top >= rect.top - RECT_TOLERANCE
        && coords.top <= rect.bottom + RECT_TOLERANCE;
}
