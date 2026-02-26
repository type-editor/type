import type {PmEditorView} from '@type-editor/editor-types';

import {endComposition} from './end-composition';


/**
 * Forces any pending DOM changes to be flushed and composition to end.
 * @param view - The editor view
 * @returns True if composition was ended
 */
export function forceDOMFlush(view: PmEditorView): boolean {
    return endComposition(view);
}
