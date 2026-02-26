/**
 * @type-editor-compat/gapcursor
 *
 * Compatibility layer for @type-editor/gapcursor providing ProseMirror-compatible type signatures.
 *
 * Re-exports gapcursor plugin with concrete type signatures.
 */

import {gapCursor as baseGapCursor} from '@type-editor/gapcursor';
import type {
    Plugin as BasePlugin,
    Selection as BaseSelection,
} from '@type-editor-compat/state';

// Define concrete types locally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;
export type Selection = BaseSelection;

// Re-export from base module
export {GapCursor} from '@type-editor/gapcursor';

type GapCursorFactory = () => Plugin;
export const gapCursor: GapCursorFactory = baseGapCursor as unknown as GapCursorFactory;



