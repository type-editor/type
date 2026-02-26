import type {PmEditorView} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';


const lineBreakRegex = /(?:\r\n?|\n)+/;

// Supports http://, https://
const URL_PATTERN = /(^|\s)https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/ig;



/**
 * Create a DOM structure from plain text, splitting on line breaks
 * and creating paragraph elements. Applies current marks from context.
 *
 * @param _view - The editor view
 * @param text - The plain text to convert
 * @param _$context - The resolved position providing current marks
 * @returns A div element containing paragraph elements
 */
export function createDOMFromPlainText(_view: PmEditorView,
                                       text: string,
                                       _$context: ResolvedPos): HTMLDivElement {
    const divElement: HTMLDivElement = document.createElement('div');

    text.split(lineBreakRegex).forEach((block: string): void => {
        const paragraphElement: HTMLParagraphElement = divElement.appendChild(document.createElement('p'));
        if (block) {
            paragraphElement.innerHTML = convertLinks(block);
        }
    });

    return divElement;
}

/**
 * Convert URLs in text to HTML anchor tags.
 * URLs must be at the start of the text or preceded by whitespace.
 *
 * @param text - The text containing potential URLs
 * @returns The text with URLs converted to HTML anchor tags
 */
function convertLinks(text: string): string {
    return text.replace(URL_PATTERN, (_match: string): string => {
        const href = _match.trim();
        const whitespace = _match.startsWith(' ') ? ' ' : '';
        return `${whitespace}<a href="${href}">${href}</a>`;
    });
}
