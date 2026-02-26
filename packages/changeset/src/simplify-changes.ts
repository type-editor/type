import type {Node} from '@type-editor/model';

import type {Change} from './Change';
import {MAX_SIMPLIFY_DISTANCE} from './max-simplify-distance';
import {simplifyAdjacentChanges} from './simplify-changes/simplify-adjacent-changes';


/**
 * Simplifies a set of changes for presentation.
 *
 * This function makes changes more readable by expanding insertions and deletions
 * that occur within the same word to cover entire words. This prevents confusing
 * partial-word changes while maintaining accuracy.
 *
 * The algorithm:
 * 1. Groups nearby changes (within MAX_SIMPLIFY_DISTANCE)
 * 2. For mixed insertions/deletions in a group, expands to word boundaries
 * 3. Preserves single-character replacements as-is
 * 4. Merges adjacent changes when appropriate
 *
 * @param changes - The array of changes to simplify.
 * @param doc - The document node (new version) to analyze.
 * @returns A new array of simplified changes.
 */
export function simplifyChanges(changes: ReadonlyArray<Change>, doc: Node): Array<Change> {
    const result: Array<Change> = [];

    for (let i = 0; i < changes.length; i++) {
        const groupStart: number = i;
        let groupEnd: number = changes[i].toB;

        // Group adjacent changes that are within MAX_SIMPLIFY_DISTANCE
        while (i < changes.length - 1 && changes[i + 1].fromB <= groupEnd + MAX_SIMPLIFY_DISTANCE) {
            groupEnd = changes[++i].toB;
        }

        // Process each group of adjacent changes
        simplifyAdjacentChanges(changes, groupStart, i + 1, doc, result);
    }

    return result;
}
