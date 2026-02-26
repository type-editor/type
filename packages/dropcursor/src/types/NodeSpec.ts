import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Module augmentation to add the `disableDropCursor` option to NodeSpec.
 * This allows individual node types to control drop cursor behavior.
 */
declare module '@type-editor/model' {

    interface NodeSpec {
        /**
         * Controls whether the drop cursor can appear inside this node type.
         * - `true`: Drop cursor is disabled for this node
         * - `false`: Drop cursor is enabled (default)
         * - Function: Called with view, position, and event to determine dynamically
         */
        disableDropCursor?: boolean | ((view: PmEditorView, pos: {
            /** The absolute position in the document */
            pos: number,
            /** The position inside the parent node, or -1 if not inside a node */
            inside: number;
        }, event: DragEvent) => boolean);
    }
}
