import type {PmEditorView} from '@type-editor/editor-types';
import {Plugin,} from '@type-editor/state';

import {MenuBarView} from './menubar/MenuBarView';
import type {MenuBarOptions} from './types/MenuBarOptions';


/**
 * A plugin that will place a menu bar above the editor. Note that
 * this involves wrapping the editor in an additional `<div>`.
 *
 * The menu bar can optionally float at the top of the viewport when
 * the editor is scrolled partially out of view (on non-iOS devices).
 *
 * @param options - Configuration options for the menu bar
 * @param options.content - Nested array of menu elements to display
 * @param options.floating - Whether the menu should stick to viewport top when scrolling
 * @returns A ProseMirror plugin that manages the menu bar
 */
export function menuBarPlugin(options: MenuBarOptions): Plugin {
    return new Plugin({
        view(editorView: PmEditorView): MenuBarView {
            return new MenuBarView(editorView, options);
        }
    });
}








