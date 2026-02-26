
/**
 * Bitfield flags for node context options.
 * These flags control whitespace handling and parsing behavior for each node context.
 * Multiple flags can be combined using bitwise OR operations.
 */
export enum ContextFlags {

    /** Flag indicating that whitespace should be preserved (but newlines may be normalized) */
    OPT_PRESERVE_WS = 1,

    /** Flag indicating that all whitespace should be preserved entirely, including newlines */
    OPT_PRESERVE_WS_FULL = 2,

    /** Flag indicating that the left side of the content is open (no automatic filling) */
    OPT_OPEN_LEFT = 4
}
