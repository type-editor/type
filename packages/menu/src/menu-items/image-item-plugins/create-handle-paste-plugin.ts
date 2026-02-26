import type { PmEditorView } from '@type-editor/editor-types';
import { type PmNode, Slice } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { Plugin as PmPlugin, PluginKey } from '@type-editor/state';

import { PLUGIN_KEYS } from './PluginKeys';

/**
 * Creates a plugin to handle paste events for images with special handling
 * for the textaround attribute.
 *
 * @returns A ProseMirror plugin that processes pasted image nodes
 */
export function createHandlePastePlugin(): PmPlugin {
    return new PmPlugin({
        key: new PluginKey(PLUGIN_KEYS.PASTE),
        props: {
            handlePaste: (_view: PmEditorView, _event: ClipboardEvent, slice: Slice): boolean => {
                if (slice === Slice.empty || !slice.content.firstChild) {
                    return false;
                }

                // Special handling for single image node with textaround attribute
                const firstChild: PmNode = slice.content.firstChild;
                const isImage: boolean = slice.content.childCount === 1 && firstChild.type === schema.nodes.image;

                if (isImage && firstChild.attrs.textaround) {
                    // Reset textaround attribute on paste to prevent layout issues
                    // Attrs are readonly but we need to mutate them here for paste handling
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                    (firstChild.attrs as any).textaround = false;
                }

                return false;
            },
        },
    });
}
