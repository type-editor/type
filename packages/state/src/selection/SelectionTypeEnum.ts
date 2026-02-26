
/**
 * Enumeration of selection types supported by the editor.
 * Each type represents a different way of selecting content in the document.
 */
export enum SelectionTypeEnum {

    /** A text selection with anchor and head positions in inline content */
    TEXT = 'text',

    /** A selection of a single block-level node */
    NODE = 'node',

    /** A selection spanning the entire document */
    ALL = 'all',

    BASE = 'base',

    CUSTOM = 'custom'
}
