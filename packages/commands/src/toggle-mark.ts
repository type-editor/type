import type {
    Command,
    DispatchFunction,
    PmEditorState,
    PmSelectionRange,
    PmTransaction,
} from '@type-editor/editor-types';
import type {Attrs, Mark, MarkType, PmNode, ResolvedPos} from '@type-editor/model';
import {SelectionRange} from '@type-editor/state';

import type {ToggleMarkOptions} from './types/ToggleMarkOptions';
import {type ExtendedSelectionResult, findExtendedMarkSelection} from './util/find-extended-mark-selection';


/**
 * Creates a command that toggles a mark on the current selection.
 *
 * This command factory creates commands that add or remove marks (like bold, italic,
 * links, etc.) from the selected content. The behavior is context-aware:
 *
 * **Empty Selection (Cursor)**: Toggles the mark in stored marks, affecting subsequent
 * typed text.
 *
 * **Range Selection**: Adds or removes the mark from the selected content based on the
 * current state and configured options.
 *
 * **Toggle Logic**:
 * - If `removeWhenPresent` is `true` (default): Removes the mark if any selected content
 *   has it, otherwise adds it
 * - If `removeWhenPresent` is `false`: Adds the mark if any selected content lacks it,
 *   otherwise removes it
 *
 * The command automatically handles:
 * - Schema validation (only applies where the mark is allowed)
 * - Whitespace exclusion (configurable)
 * - Atomic inline nodes (configurable)
 * - Complex selection ranges
 *
 * @param markType - The type of mark to toggle
 * @param attrs - Optional attributes for the mark (e.g., `{ href: "..." }` for links)
 * @param options - Configuration options for toggle behavior
 * @returns A command that toggles the mark
 *
 * @example
 * ```typescript
 * // Create basic formatting commands
 * const toggleBold = toggleMark(schema.marks.strong);
 * const toggleItalic = toggleMark(schema.marks.em);
 * const toggleCode = toggleMark(schema.marks.code);
 *
 * // Create a link toggle with attributes
 * const toggleLink = (href: string) =>
 *   toggleMark(schema.marks.link, { href });
 *
 * // Use in a keymap
 * const keymap = {
 *   'Mod-b': toggleBold,
 *   'Mod-i': toggleItalic,
 *   'Mod-`': toggleCode
 * };
 *
 * // Custom toggle behavior
 * const toggleStrikethrough = toggleMark(
 *   schema.marks.strikethrough,
 *   null,
 *   {
 *     removeWhenPresent: false, // Additive behavior
 *     includeWhitespace: true    // Include whitespace
 *   }
 * );
 *
 * // Toggle with attribute-based differentiation
 * const setFontSize = (size: number) =>
 *   toggleMark(schema.marks.fontSize, { size });
 * ```
 */
export function toggleMark(markType: MarkType,
                           attrs: Attrs | null = null,
                           options: ToggleMarkOptions = DEFAULT_TOGGLE_MARK_OPTIONS): Command {
    const removeWhenPresent: boolean = options.removeWhenPresent ?? true;
    const enterAtoms: boolean = options.enterInlineAtoms ?? true;
    const excludeWhitespace = !options?.includeWhitespace;
    const onlyNumbers: boolean = options.onlyNumbers ?? false;
    const extendEmptySelection: boolean = options.extendEmptySelection ?? false;

    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const {empty, $cursor, $from, ranges} = state.selection;

        // Check if the mark can be applied to the selection
        if ((empty && !$cursor) || !canApplyMark(state.doc, ranges, markType, enterAtoms)) {
            return false;
        }

        if(!$from.parent.type.spec.content.includes('inline')) {
            return false;
        }

        // Handle onlyNumbers validation for non-empty selections
        if (onlyNumbers && !empty) {
            const selectedText: string = getTextInRange(state.doc, $from.pos, state.selection.$to.pos);
            if (!isNumericOnly(selectedText)) {
                return false;
            }
        }

        let hasAppliedChange = false;

        // Handle cursor (empty selection)
        if ($cursor) {
            // Check if we should extend the empty selection to include adjacent character
            if (extendEmptySelection) {
                const extended: ExtendedSelectionResult = findExtendedMarkSelection(state.doc, $cursor, markType, onlyNumbers);

                if (extended.found && extended.char) {

                    // Check if mark can be applied at this position
                    const $extFrom: ResolvedPos = state.doc.resolve(extended.from);
                    if ($extFrom.parent.type.allowsMarkType(markType)) {
                        const transaction: PmTransaction = state.transaction;
                        const hasMark: boolean = state.doc.rangeHasMark(extended.from, extended.to, markType);

                        if (hasMark) {
                            // Check if cursor is at edge of marked range with adjacent whitespace
                            // If so, only remove the mark from the whitespace, not the entire range
                            const edgeWhitespace: EdgeWhitespaceResult = findEdgeWhitespaceInMarkedRange(
                                state.doc,
                                $cursor.pos,
                                extended.from,
                                extended.to
                            );

                            if (edgeWhitespace.found) {
                                // Only remove mark from the edge whitespace
                                transaction.removeMark(edgeWhitespace.from, edgeWhitespace.to, markType);
                            } else {
                                // Remove mark from entire extended range
                                transaction.removeMark(extended.from, extended.to, markType);
                            }
                        } else {
                            transaction.addMark(extended.from, extended.to, markType.create(attrs));
                        }

                        if(dispatch) {
                            dispatch(transaction.scrollIntoView());
                        }
                        return true;
                    }
                }
                // If no character found or validation failed, return false
                return false;
            }

            // Standard cursor behavior - toggle stored marks
            const currentMarks: ReadonlyArray<Mark> = state.storedMarks || $cursor.marks();
            if (markType.isInSet(currentMarks)) {
                if(dispatch) {
                    dispatch(state.transaction.removeStoredMark(markType));
                }
            } else {
                if(dispatch) {
                    dispatch(state.transaction.addStoredMark(markType.create(attrs)));
                }
            }
            hasAppliedChange = true;
        } else {
            // Handle range selection
            const transaction: PmTransaction = state.transaction;

            // Filter ranges to exclude atomic node interiors if configured
            const processedRanges: ReadonlyArray<PmSelectionRange> = enterAtoms ? ranges : excludeInlineAtomInteriors(ranges);

            // Determine whether to add or remove the mark
            const shouldAdd: boolean = shouldAddMark(state, processedRanges, markType, removeWhenPresent);

            // Apply the mark change to all ranges
            for (const range of processedRanges) {

                if (!shouldAdd) {
                    // Remove the mark
                    transaction.removeMark(range.$from.pos, range.$to.pos, markType);
                } else {
                    // Check if mark is allowed at cursor position when adding
                    if(!isMarkAllowedAtPosition(range.$from, markType)) {
                        continue;
                    }
                    // Add the mark, adjusting for whitespace
                    const {from, to} = adjustRangeForWhitespace(
                        range.$from,
                        range.$to,
                        excludeWhitespace
                    );
                    transaction.addMark(from, to, markType.create(attrs));
                }
                hasAppliedChange = true;

                if(!dispatch) {
                    return true;
                }
            }

            if(dispatch) {
                dispatch(transaction.scrollIntoView());
            }
        }

        return hasAppliedChange;
    };
}

/**
 * Checks if a mark type is allowed at a given position.
 *
 * For text content, checks if the parent node allows the mark type.
 * For inline atomic nodes (like images), checks if the node itself allows the mark type.
 *
 * @param position - The resolved position to check
 * @param markType - The mark type to check
 */
function isMarkAllowedAtPosition(position: ResolvedPos, markType: MarkType): boolean {
    const nodeAfter: PmNode | null = position.nodeAfter;

    // For non-text inline atoms (like images), check if the node type allows the mark
    if (nodeAfter && !nodeAfter.isText && nodeAfter.isAtom && nodeAfter.isInline) {
        return nodeAfter.type.allowsMarkType(markType);
    }

    // For text content or no node after, check the parent
    return position.parent.type.allowsMarkType(markType);
}


/**
 * Regex patterns for whitespace detection (defined at module level for performance)
 */
const LEADING_WHITESPACE_PATTERN = /^\s*/;
const TRAILING_WHITESPACE_PATTERN = /\s*$/;

/**
 * Regex pattern for numeric-only validation
 */
const NUMERIC_ONLY_PATTERN = /^\d+$/;

/**
 * Regex pattern for trailing whitespace
 */
const TRAILING_WHITESPACE_ONLY_PATTERN = /\s+$/;

/**
 * Regex pattern for leading whitespace
 */
const LEADING_WHITESPACE_ONLY_PATTERN = /^\s+/;

/**
 * Result of finding edge whitespace in a marked range.
 */
interface EdgeWhitespaceResult {
    /** Whether edge whitespace was found */
    found: boolean;
    /** Start position of the whitespace range to remove */
    from: number;
    /** End position of the whitespace range to remove */
    to: number;
}

/**
 * Finds whitespace at the edge of a marked range when the cursor is at the boundary.
 *
 * This function checks if the cursor is at the start or end of a marked range and
 * if the adjacent character(s) within the mark are whitespace. If so, it returns
 * the range of whitespace that should be unmarked instead of the entire marked range.
 *
 * @param doc - The document node
 * @param cursorPos - The cursor position
 * @param markedFrom - Start of the marked range
 * @param markedTo - End of the marked range
 * @returns Information about edge whitespace to remove, or not found
 */
function findEdgeWhitespaceInMarkedRange(doc: PmNode,
                                          cursorPos: number,
                                          markedFrom: number,
                                          markedTo: number): EdgeWhitespaceResult {
    const markedText: string = doc.textBetween(markedFrom, markedTo, '', '');

    // Check if cursor is at the end of the marked range
    if (cursorPos === markedTo) {
        const trailingMatch: RegExpExecArray | null = TRAILING_WHITESPACE_ONLY_PATTERN.exec(markedText);
        if (trailingMatch && trailingMatch[0].length < markedText.length) {
            // There is trailing whitespace and it's not the entire text
            const whitespaceStart: number = markedTo - trailingMatch[0].length;
            return {
                found: true,
                from: whitespaceStart,
                to: markedTo
            };
        }
    }

    // Check if cursor is at the start of the marked range
    if (cursorPos === markedFrom) {
        const leadingMatch: RegExpExecArray | null = LEADING_WHITESPACE_ONLY_PATTERN.exec(markedText);
        if (leadingMatch && leadingMatch[0].length < markedText.length) {
            // There is leading whitespace and it's not the entire text
            return {
                found: true,
                from: markedFrom,
                to: markedFrom + leadingMatch[0].length
            };
        }
    }

    return { found: false, from: -1, to: -1 };
}

/**
 * Checks if the given text contains only numeric characters.
 *
 * @param text - The text to check
 * @returns `true` if the text contains only digits, `false` otherwise
 */
function isNumericOnly(text: string): boolean {
    return NUMERIC_ONLY_PATTERN.test(text);
}


/**
 * Gets the text content of a selection range.
 *
 * @param doc - The document
 * @param from - Start position
 * @param to - End position
 * @returns The text content between the positions
 */
function getTextInRange(doc: PmNode, from: number, to: number): string {
    return doc.textBetween(from, to, '', '');
}


/**
 * Checks if a mark type can be applied to any content in the given ranges.
 *
 * @param doc - The document node
 * @param ranges - The selection ranges to check
 * @param markType - The mark type to check
 * @param enterAtoms - Whether to check inside atomic inline nodes
 * @returns `true` if the mark can be applied somewhere in the ranges, `false` otherwise
 */
function canApplyMark(doc: PmNode,
                      ranges: ReadonlyArray<PmSelectionRange>,
                      markType: MarkType,
                      enterAtoms: boolean): boolean {
    for (const range of ranges) {
        const {$from, $to} = range;
        let foundApplicable = false;

        // Check if we can apply at document level
        if ($from.depth === 0) {
            foundApplicable = doc.inlineContent && doc.type.allowsMarkType(markType);
        }

        // Check all nodes in the range
        doc.nodesBetween($from.pos, $to.pos, (node: PmNode, pos: number): boolean => {
            // If we already found an applicable spot, stop searching
            if (foundApplicable) {
                return false;
            }

            // Skip atomic inline nodes if configured to do so
            if (!enterAtoms
                && node.isAtom
                && node.isInline
                && pos >= $from.pos
                && pos + node.nodeSize <= $to.pos) {
                return false;
            }

            // Check if this node can have the mark
            foundApplicable = node.inlineContent && node.type.allowsMarkType(markType);
            return !foundApplicable; // Continue if not found
        });

        if (foundApplicable) {
            return true;
        }
    }

    return false;
}

/**
 * Filters selection ranges to exclude the content of inline atomic nodes.
 *
 * This function takes selection ranges and splits them around inline atomic nodes
 * that have content, effectively excluding the interior of these atoms from the
 * resulting ranges while keeping the surrounding positions.
 *
 * @param ranges - The original selection ranges
 * @returns New ranges with atomic node interiors excluded
 */
function excludeInlineAtomInteriors(ranges: ReadonlyArray<PmSelectionRange>): ReadonlyArray<PmSelectionRange> {
    const result: Array<PmSelectionRange> = [];

    for (const range of ranges) {
        let $from: ResolvedPos = range.$from;
        const $to: ResolvedPos = range.$to;

        // Find all inline atoms in the range and split around them
        $from.doc.nodesBetween($from.pos, $to.pos, (node: PmNode, pos: number): boolean => {
            const isInlineAtomWithContent: boolean =
                node.isAtom
                && node.content.size > 0
                && node.isInline
                && pos >= $from.pos
                && pos + node.nodeSize <= $to.pos;

            if (isInlineAtomWithContent) {
                const beforeAtom: number = pos + 1;
                const afterAtom: number = pos + 1 + node.content.size;
                const docSize: number = $from.doc.content.size;

                // Add range up to the atom if there's content before it and position is valid
                if (beforeAtom > $from.pos && beforeAtom <= docSize) {
                    result.push(new SelectionRange($from, $from.doc.resolve(beforeAtom)));
                }

                // Skip over the atom's interior content if position is valid
                if (afterAtom <= $to.pos && afterAtom <= docSize) {
                    $from = $from.doc.resolve(afterAtom);
                }
                return false; // Don't descend into the atom
            }
        });

        // Add the remaining range after the last atom
        if ($from.pos < $to.pos) {
            result.push(new SelectionRange($from, $to));
        }
    }

    return result;
}

/**
 * Calculates the amount of whitespace to exclude from mark application.
 *
 * This function determines how many characters of leading or trailing whitespace
 * should be excluded when applying marks, preventing marks from being applied to
 * spaces at the boundaries of the selection.
 *
 * @param isStart - Whether to check for leading (true) or trailing (false) whitespace
 * @param shouldExcludeWhitespace - Whether whitespace exclusion is enabled
 * @param node - The text node to check (null if not a text node)
 * @returns The number of whitespace characters to exclude
 */
function calculateWhitespaceOffset(isStart: boolean,
                                   shouldExcludeWhitespace: boolean,
                                   node?: PmNode | null): number {
    if (!shouldExcludeWhitespace || !node?.isText || !node.text) {
        return 0;
    }

    const pattern: RegExp = isStart ? LEADING_WHITESPACE_PATTERN : TRAILING_WHITESPACE_PATTERN;
    const match: RegExpExecArray = pattern.exec(node.text);

    return match ? match[0].length : 0;
}

/**
 * Default configuration for toggleMark commands.
 */
export const DEFAULT_TOGGLE_MARK_OPTIONS: ToggleMarkOptions = {
    removeWhenPresent: true,
    enterInlineAtoms: true,
    includeWhitespace: false,
    extendEmptySelection: true,
};

/**
 * Subscript / Superscript configuration for toggleMark commands.
 */
export const ONLY_NUMBERS_OPTIONS: ToggleMarkOptions = {
    ...DEFAULT_TOGGLE_MARK_OPTIONS,
    onlyNumbers: true,
};

/**
 * Determines whether to add or remove the mark based on the current selection state.
 *
 * @param state - The current editor state
 * @param ranges - The selection ranges to check
 * @param markType - The mark type to check
 * @param removeWhenPresent - Whether to remove the mark if any part has it
 * @returns `true` to add the mark, `false` to remove it
 */
function shouldAddMark(state: PmEditorState,
                       ranges: ReadonlyArray<PmSelectionRange>,
                       markType: MarkType,
                       removeWhenPresent: boolean): boolean {
    if (removeWhenPresent) {
        // Remove if ANY range has the mark
        return !ranges.some((range: PmSelectionRange): boolean =>
            state.doc.rangeHasMark(range.$from.pos, range.$to.pos, markType)
        );
    }

    // Add if ANY range is missing the mark (check non-whitespace content)
    return !ranges.every((range: PmSelectionRange): boolean => {
        let hasMarkEverywhere = true;

        state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node: PmNode, pos: number, parent: PmNode | null): boolean => {
            if (!hasMarkEverywhere) {
                return false; // Stop if we found missing mark
            }

            // Check if this node is missing the mark
            const nodeStartInRange: number = Math.max(0, range.$from.pos - pos);
            const nodeEndInRange: number = Math.min(node.nodeSize, range.$to.pos - pos);
            const nodeTextInRange: string = node.isText ? node.textBetween(nodeStartInRange, nodeEndInRange) : '';

            // Only consider non-whitespace content
            const isOnlyWhitespace = node.isText && nodeTextInRange.trim() === '';

            const isMissingMark: boolean =
                !markType.isInSet(node.marks)
                && !!parent
                && parent.type.allowsMarkType(markType)
                && !isOnlyWhitespace;

            hasMarkEverywhere = !isMissingMark;
            return hasMarkEverywhere; // Continue if mark is present
        });

        return hasMarkEverywhere;
    });
}

/**
 * Adjusts a range to exclude leading and trailing whitespace.
 *
 * @param $from - Start of the range
 * @param $to - End of the range
 * @param excludeWhitespace - Whether to exclude whitespace
 * @returns Adjusted from and to positions
 */
function adjustRangeForWhitespace($from: ResolvedPos,
                                  $to: ResolvedPos,
                                  excludeWhitespace: boolean): { from: number; to: number } {
    let from: number = $from.pos;
    let to: number = $to.pos;

    if (!excludeWhitespace) {
        return { from, to };
    }

    const startNode: PmNode = $from.nodeAfter;
    const endNode: PmNode = $to.nodeBefore;
    const leadingSpaces: number = calculateWhitespaceOffset(true, excludeWhitespace, startNode);
    const trailingSpaces: number = calculateWhitespaceOffset(false, excludeWhitespace, endNode);

    // Only adjust if there's content remaining after removing whitespace
    if (from + leadingSpaces < to) {
        from += leadingSpaces;
        to -= trailingSpaces;
    }

    return { from, to };
}
