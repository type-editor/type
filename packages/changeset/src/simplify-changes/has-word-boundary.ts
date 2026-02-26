import {isLetter} from './is-letter';


/**
 * Checks if there's a word boundary between two changes.
 *
 * A word boundary is detected when there's a transition from non-letter to letter
 * or vice versa between the end of one change and the start of the next.
 *
 * @param text - The text to analyze.
 * @param textStart - The offset where the analyzed text starts in the document.
 * @param fromPos - The start position to check from.
 * @param toPos - The end position to check to.
 * @param contextEnd - The end of the text context (to avoid out-of-bounds).
 * @returns True if a word boundary is found, false otherwise.
 */
export function hasWordBoundary(text: string,
                                textStart: number,
                                fromPos: number,
                                toPos: number,
                                contextEnd: number): boolean {
    // Check each position in the range for non-letter characters
    for (let pos = fromPos; pos < toPos; pos++) {
        const isLetterChar: boolean = pos >= contextEnd ? false : isLetter(text.charCodeAt(pos - textStart));

        // A word boundary exists if any character in the range is not a letter
        if (!isLetterChar) {
            return true;
        }
    }

    return false;
}

