import type {PmEditorView} from '@type-editor/editor-types';
import {Plugin} from '@type-editor/state';

import {DropCursorView} from './DropCursorView';
import type {DropCursorOptions} from './types/DropCursorOptions';


/**
 * Creates a plugin that displays a visual drop cursor indicator when content is dragged over the editor.
 *
 * The drop cursor helps users see where dragged content will be inserted. It appears as a colored line
 * or block at the potential drop position during drag-and-drop operations.
 *
 * ## Usage Example
 * ```typescript
 * const editor = new EditorView({
 *   state: EditorState.create({
 *     plugins: [dropCursor({ color: 'blue', width: 2 })]
 *   })
 * });
 * ```
 *
 * ## Node Spec Integration
 * Nodes may add a `disableDropCursor` property to their spec to control whether the drop cursor
 * can appear inside them. This can be:
 * - A boolean: `true` to disable, `false` to enable
 * - A function: `(view, pos, event) => boolean` for dynamic control
 *
 * @param options - Configuration options for the drop cursor appearance and behavior
 * @param options.color - The color of the cursor. Defaults to `"black"`. Set to `false` to rely only on CSS classes
 * @param options.width - The width of the cursor in pixels. Defaults to `1`
 * @param options.class - A CSS class name to add to the cursor element for custom styling
 * @returns A ProseMirror plugin instance
 */
export function dropCursor(options: DropCursorOptions = {}): Plugin {
    return new Plugin({
        view(editorView: PmEditorView): DropCursorView {
            return new DropCursorView(editorView, options);
        }
    });
}
