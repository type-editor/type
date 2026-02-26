import {isUndefinedOrNull} from '@type-editor/commons';

/**
 * Extended RegExp type that supports the hasIndices flag.
 */
type RegExpWithIndices = RegExp & { hasIndices: boolean };

/**
 * Base flags for regular expressions:
 * - 'g': global search
 * - 'u': unicode support (if available)
 * - 'd': indices for capture groups (if available)
 */
export const regexFlags: string = 'g'
    + (isUndefinedOrNull(/x/.unicode) ? '' : 'u')
    + (isUndefinedOrNull((/x/ as RegExpWithIndices).hasIndices) ? '' : 'd');
