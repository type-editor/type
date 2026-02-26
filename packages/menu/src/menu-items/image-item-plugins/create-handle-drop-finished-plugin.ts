import type { PmEditorView, PmTransaction } from '@type-editor/editor-types';
import type { Attrs, PmNode, ResolvedPos, Slice } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { Plugin as PmPlugin, PluginKey } from '@type-editor/state';

import { PLUGIN_KEYS } from './PluginKeys';


/**
 * Creates a plugin to handle the completion of drop operations for images,
 * managing node type conversions and attribute updates.
 *
 * @returns A ProseMirror plugin that processes dropped image nodes after insertion
 */
export function createHandleDropFinishedPlugin(): PmPlugin {
    return new PmPlugin({
        key: new PluginKey(PLUGIN_KEYS.DROP_FINISHED),
        props: {
            handleDropFinished: (_view: PmEditorView,
                                 _event: DragEvent,
                                 slice: Slice,
                                 moved: boolean,
                                 insertPosition: number,
                                 transaction: PmTransaction,
                                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                 data: Map<string, any>): boolean => {
                if (!moved || data.get('isImage') !== true || !slice.content.firstChild) {
                    return false;
                }

                const firstChild: PmNode = slice.content.firstChild;

                // Reset textaround attribute on drop to prevent layout issues
                if (firstChild.attrs.textaround) {
                    // Attrs are readonly but we need to mutate them here for drop handling
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                    (firstChild.attrs as any).textaround = false;
                }

                // Handle source figure conversion after image removal
                const sourceFigureStart = data.get('sourceFigureStart') as number | null | undefined;
                if (data.get('isImageWithCaption') && sourceFigureStart !== null && sourceFigureStart !== undefined) {
                    convertSourceFigureIfNeeded(transaction, sourceFigureStart);
                }

                // Handle target paragraph conversion after image insertion
                if (data.get('isImageWithCaption')) {
                    convertTargetParagraphIfNeeded(transaction, insertPosition);
                }

                return false;
            },
        },
    });
}

/**
 * Converts a source figure to a paragraph if it no longer contains captioned images.
 *
 * @param transaction - The transaction to modify
 * @param sourceFigureStart - The position of the source figure (before mapping)
 * @returns The updated transaction
 */
function convertSourceFigureIfNeeded(transaction: PmTransaction,
                                     sourceFigureStart: number): PmTransaction {
    // Map the source figure position through the deletion
    const mappedFigureStart: number = transaction.mapping.map(sourceFigureStart);
    const $figurePos: ResolvedPos = transaction.doc.resolve(mappedFigureStart);

    // Check if we're at the start of the figure node
    const figureNode: PmNode | null = $figurePos.nodeAfter;

    if (figureNode?.type === schema.nodes.figure) {
        // If no images with caption remain, convert figure to paragraph
        if (!figureHasImageWithCaption(figureNode)) {
            const figureEnd: number = mappedFigureStart + figureNode.nodeSize;
            const figureAttrs: Attrs = figureNode.attrs;
            transaction.setBlockType(mappedFigureStart, figureEnd, schema.nodes.paragraph, figureAttrs);
        }
    }

    return transaction;
}

/**
 * Converts the target paragraph to a figure if an image with caption is dropped into it.
 *
 * @param transaction - The transaction to modify
 * @param insertPosition - The position where the image was inserted
 * @returns The updated transaction
 */
function convertTargetParagraphIfNeeded(transaction: PmTransaction,
                                        insertPosition: number): PmTransaction {
    // Resolve the position where we inserted the image
    const $insertPos: ResolvedPos = transaction.doc.resolve(insertPosition);

    // Find the wrapping block node (usually a paragraph)
    const depth: number = $insertPos.depth;
    if (depth > 0) {
        const parentNode: PmNode = $insertPos.node(depth);

        // Check if parent is a paragraph that should become a figure
        if (parentNode.type === schema.nodes.paragraph) {
            const paragraphStart: number = $insertPos.before(depth);
            const paragraphEnd: number = $insertPos.after(depth);

            // Preserve paragraph attributes
            const paragraphAttrs = parentNode.attrs;

            // Transform the paragraph into a figure
            transaction.setBlockType(paragraphStart, paragraphEnd, schema.nodes.figure, paragraphAttrs);
        }
    }

    return transaction;
}

/**
 * Checks if a figure node contains any images with captions.
 *
 * @param figureNode - The figure node to examine
 * @returns True if at least one image with caption is found
 */
function figureHasImageWithCaption(figureNode: PmNode): boolean {
    let hasImageWithCaption = false;

    figureNode.descendants((node: PmNode) => {
        if (node.type === schema.nodes.image && node.attrs.caption) {
            hasImageWithCaption = true;
            return false; // Stop iteration
        }
        return true;
    });

    return hasImageWithCaption;
}
