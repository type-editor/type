import type {Node} from '@type-editor/model';

import {Change} from '../Change';
import {MAX_SIMPLIFY_DISTANCE} from '../max-simplify-distance';
import {expandToWordBoundaries} from './expand-to-word-boundaries';
import {fillChange} from './fill-change';
import {getText} from './get-text';
import {hasWordBoundary} from './has-word-boundary';


/**
 * Processes a group of adjacent changes and adds simplified versions to the target array.
 *
 * This function examines changes in a group to determine if they should be merged.
 * Changes are merged if they're within the same word (no word boundary between them).
 * Mixed insertions/deletions are expanded to word boundaries unless they're single
 * character replacements.
 *
 * @param changes - The complete array of changes.
 * @param from - The start index in the changes array (inclusive).
 * @param to - The end index in the changes array (exclusive).
 * @param doc - The document node to analyze.
 * @param target - The array to add simplified changes to.
 */
export function simplifyAdjacentChanges(changes: ReadonlyArray<Change>,
                                        from: number,
                                        to: number,
                                        doc: Node,
                                        target: Array<Change>): void {
    // Get text context around the changes for word boundary detection
    const contextStart: number = Math.max(0, changes[from].fromB - MAX_SIMPLIFY_DISTANCE);
    const contextEnd: number = Math.min(doc.content.size, changes[to - 1].toB + MAX_SIMPLIFY_DISTANCE);
    const text: string = getText(doc.content, contextStart, contextEnd);

    for (let i = from; i < to; i++) {
        const groupStartIndex: number = i;
        let lastChange: Change = changes[i];
        let totalDeleted: number = lastChange.lenA;
        let totalInserted: number = lastChange.lenB;

        // Try to merge consecutive changes that are within the same word
        while (i < to - 1) {
            const nextChange: Change = changes[i + 1];

            // Check if there's a word boundary between the current and next change
            const hasWindowBoundary: boolean = hasWordBoundary(
                text,
                contextStart,
                lastChange.toB,
                nextChange.fromB,
                contextEnd
            );

            if (hasWindowBoundary) {
                break;
            }

            // Accumulate the change metrics
            totalDeleted += nextChange.lenA;
            totalInserted += nextChange.lenB;
            lastChange = nextChange;
            i++;
        }

        // Determine if we should expand this change group to word boundaries
        const shouldExpandToWords: boolean =
            totalInserted > 0
            && totalDeleted > 0
            && !(totalInserted === 1 && totalDeleted === 1);

        if (shouldExpandToWords) {
            // Expand the range to word boundaries
            const [expandedFrom, expandedTo] = expandToWordBoundaries(
                text,
                contextStart,
                contextEnd,
                changes[groupStartIndex].fromB,
                changes[i].toB
            );

            // Create a merged change covering the expanded range
            const mergedChange: Change = fillChange(
                changes.slice(groupStartIndex, i + 1),
                expandedFrom,
                expandedTo
            );

            // Try to merge with the previous change in target if they're adjacent
            const previousChange: Change | null = target.length > 0 ? target[target.length - 1] : null;

            if (previousChange?.toA === mergedChange.fromA) {
                // Merge with previous change
                target[target.length - 1] = new Change(
                    previousChange.fromA,
                    mergedChange.toA,
                    previousChange.fromB,
                    mergedChange.toB,
                    previousChange.deleted.concat(mergedChange.deleted),
                    previousChange.inserted.concat(mergedChange.inserted)
                );
            } else {
                target.push(mergedChange);
            }
        } else {
            // Add changes individually without expansion
            for (let j = groupStartIndex; j <= i; j++) {
                target.push(changes[j]);
            }
        }
    }
}
