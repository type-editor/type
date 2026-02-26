
/** Unicode letter detection regex (if supported by the runtime). */
let unicodeLetterRegex: RegExp | undefined;

/**
 * Initialize Unicode letter detection regex if the runtime supports it.
 * Falls back to alternative detection methods if not available.
 */
try {
    unicodeLetterRegex = new RegExp('[\\p{Alphabetic}_]', 'u');
} catch (_) {
    // Unicode property escapes not supported
}


/**
 * Regular expression matching common single-case script characters.
 * These characters are always word characters but don't have distinct
 * upper/lowercase forms (Hebrew, Arabic, CJK, etc.).
 */
const nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;


/**
 * ASCII character code ranges for word characters.
 */
const ASCII_DIGIT_START = 48;    // '0'
const ASCII_DIGIT_END = 57;      // '9'
const ASCII_UPPER_START = 65;    // 'A'
const ASCII_UPPER_END = 90;      // 'Z'
const ASCII_LOWER_START = 97;    // 'a'
const ASCII_LOWER_END = 122;     // 'z'


/**
 * Determines whether a character code represents a letter or digit.
 *
 * For ASCII characters, checks if the code is in the alphanumeric range.
 * For non-ASCII characters, uses Unicode properties if available, otherwise
 * checks for case changes or single-case script membership.
 *
 * @param code - The character code to test.
 * @returns True if the character is a letter or digit, false otherwise.
 */
export function isLetter(code: number): boolean {
    // Fast path for ASCII characters
    if (code < 128) {
        return (code >= ASCII_DIGIT_START && code <= ASCII_DIGIT_END)
            || (code >= ASCII_UPPER_START && code <= ASCII_UPPER_END)
            || (code >= ASCII_LOWER_START && code <= ASCII_LOWER_END);
    }

    const char = String.fromCharCode(code);

    // Use Unicode properties if available
    if (unicodeLetterRegex) {
        return unicodeLetterRegex.test(char);
    }

    // Fallback: check for case changes or single-case script membership
    return char.toUpperCase() !== char.toLowerCase() || nonASCIISingleCaseWordChar.test(char);
}
