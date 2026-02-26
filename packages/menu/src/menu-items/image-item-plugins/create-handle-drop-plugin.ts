import type { PmEditorView } from '@type-editor/editor-types';
import type { PmNode, ResolvedPos, Slice } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { Plugin as PmPlugin, PluginKey } from '@type-editor/state';

import { PLUGIN_KEYS } from './PluginKeys';

/**
 * Creates a plugin to handle the start of drop operations for images,
 * tracking metadata needed for subsequent processing.
 *
 * @param editorView - The editor view for accessing document state
 * @returns A ProseMirror plugin that processes dropped image nodes
 */
export function createHandleDropPlugin(editorView: PmEditorView): PmPlugin {
    return new PmPlugin({
        key: new PluginKey(PLUGIN_KEYS.DROP_START),
        props: {
            handleDrop: (_view: PmEditorView,
                         _event: DragEvent,
                         slice: Slice,
                         moved: boolean,
                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data: Map<string, any>): boolean => {

                if (!moved || !slice.content.firstChild) {
                    return false;
                }

                const firstChild: PmNode = slice.content.firstChild;
                const isImage: boolean = slice.content.childCount === 1 && firstChild.type === schema.nodes.image;

                if (!isImage) {
                    return false;
                }

                const isImageWithCaption = Boolean(firstChild.attrs.caption);

                // Track metadata for drop operation
                data.set('isImage', isImage);

                if (isImageWithCaption) {
                    data.set('isImageWithCaption', isImageWithCaption);

                    // Find the wrapping figure position if needed
                    const $sourcePos: ResolvedPos = editorView.state.doc.resolve(editorView.state.selection.from);
                    const sourceFigureStart = findWrappingFigurePosition($sourcePos);
                    data.set('sourceFigureStart', sourceFigureStart);

                }

                return false;
            },
        },
    });
}

/**
 * Finds the position of the wrapping figure node for a given selection position.
 *
 * @param $sourcePos - The resolved position to search from
 * @returns The position before the figure node, or null if not found
 */
function findWrappingFigurePosition($sourcePos: ResolvedPos): number | null {
    for (let depth = $sourcePos.depth; depth > 0; depth--) {
        if ($sourcePos.node(depth).type === schema.nodes.figure) {
            return $sourcePos.before(depth);
        }
    }
    return null;
}
