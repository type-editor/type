import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Type definition for event handler functions used in the editor.
 * @template T - The type of event being handled
 * @param view - The editor view instance
 * @param event - The DOM event
 * @returns True if the event was handled and should not be processed further
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type EventHandler<T extends Event> = (view: PmEditorView, event: T) => boolean | void;
