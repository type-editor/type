import type { PmEditorState } from '@type-editor/editor-types';

/**
 * Checks if the current selection length is within a specified range.
 *
 * @param state - The current editor state
 * @param max - The maximum allowed selection length (default: 1000)
 * @param min - The minimum required selection length (default: 0)
 * @returns `true` if the selection length is within the range [min, max], `false` otherwise
 */
export function isSelectionLengthInRange(state: PmEditorState, max = 1000, min = 0): boolean {
    const len: number = state.selection.to - state.selection.from;
    return len >= min && len <= max;
}
