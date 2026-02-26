import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Translates a text string using the view's translation function if available.
 *
 * @param view - The editor view that may contain a translate function
 * @param text - The text to translate
 * @returns The translated text, or the original text if no translation function is available
 */
export function translate(view: PmEditorView, text: string): string {
    return ('translate' in view.props && typeof view.props.translate === 'function')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ? (view.props.translate(text) as string)
        : text;
}
