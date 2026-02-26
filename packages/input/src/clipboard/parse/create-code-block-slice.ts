import type {PmEditorView} from '@type-editor/editor-types';
import {Fragment, Slice} from '@type-editor/model';

/**
 * Create a slice from plain text for insertion into code blocks.
 * Normalizes line endings to Unix format (\n).
 *
 * @param view - The editor view
 * @param text - The plain text to convert
 * @returns A slice containing the text as a single text node
 */
export function createCodeBlockSlice(view: PmEditorView, text: string): Slice {
    const normalizedText: string = text.replace(/\r\n?/g, '\n');
    return new Slice(Fragment.from(view.state.schema.text(normalizedText)), 0, 0);
}
