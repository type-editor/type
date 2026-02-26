import {isLetter} from './is-letter';


/**
 * Expands a position range to word boundaries.
 *
 * If the range starts or ends within a word, expands it to include the entire word.
 * This ensures that changes don't split words in confusing ways.
 *
 * @param text - The text to analyze.
 * @param textStart - The offset where the analyzed text starts in the document.
 * @param textEnd - The end of the text context.
 * @param fromPos - The start position to expand.
 * @param toPos - The end position to expand.
 * @returns A tuple with the expanded [from, to] positions.
 */
export function expandToWordBoundaries(text: string,
                                       textStart: number,
                                       textEnd: number,
                                       fromPos: number,
                                       toPos: number): [number, number] {
    let expandedFrom: number = fromPos;
    let expandedTo: number = toPos;

    // Expand start position backward to word boundary
    if (expandedFrom < textEnd && isLetter(text.charCodeAt(expandedFrom - textStart))) {
        while (expandedFrom > textStart && isLetter(text.charCodeAt(expandedFrom - 1 - textStart))) {
            expandedFrom--;
        }
    }

    // Expand end position forward to word boundary
    if (expandedTo > textStart
        && expandedTo <= textEnd
        && isLetter(text.charCodeAt(expandedTo - 1 - textStart))) {

        while (expandedTo < textEnd && isLetter(text.charCodeAt(expandedTo - textStart))) {
            expandedTo++;
        }
    }

    return [expandedFrom, expandedTo];
}
