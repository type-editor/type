import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import { type Mark, type MarkType, type NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { isCodeBlock } from './util/is-code-block';

/**
 * Regular expression to match URLs when the Enter key is pressed.
 * Matches URLs at the start of a line, with optional protocol.
 * @example "https://example.com/path" or "example.com"
 */
 const URL_PATTERN_ENTER = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/i;

/**
 * Regular expression to match URLs when the Space key is pressed.
 * Matches URLs preceded by whitespace or at the start of text.
 * Same as URL_PATTERN_ENTER but allows leading whitespace.
 */
 const URL_PATTERN_SPACE = /(^|\s)https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/i;

/**
 * Type definition for the trigger key that activates auto-linking.
 */
export type AutoLinkTriggerKey = 'Enter' | 'Space';


/**
 * Automatically converts URLs to clickable links when Enter or Space is pressed.
 *
 * This command detects URLs in the editor and automatically wraps them with a link mark
 * when the user presses Enter or Space. It supports both explicit protocols (http://, https://)
 * and implicit URLs (example.com).
 *
 * @param keyType - The key that triggers the auto-link behavior ('Enter' or 'Space')
 * @param linkMarkType - The mark type to use for creating links (defaults to schema.marks.link)
 * @param codeNodeType - The node type for code blocks to prevent auto-linking inside them (defaults to schema.nodes.code_block)
 * @returns A command function that can be executed in the editor
 *
 * @example
 * ```typescript
 * // Create an auto-link command for the Enter key
 * const autoLinkOnEnter = autoLink('Enter');
 *
 * // Create an auto-link command for the Space key with a custom mark type
 * const autoLinkOnSpace = autoLink('Space', customLinkMarkType);
 * ```
 *
 * @remarks
 * - The command will not create a link if one already exists at the cursor position
 * - For Enter key: matches URLs that span the entire line from the start
 * - for Space key: matches URLs that appear after whitespace or at the start
 * - URLs are automatically normalized to include the https:// protocol if missing
 * - Returns `true` for Enter key (to indicate the command handled the event)
 * - Returns `false` for Space key (to allow default behavior)
 */
export function autoLink(keyType: AutoLinkTriggerKey,
                         linkMarkType: MarkType = schema.marks.link,
                         codeNodeType: NodeType = schema.nodes.code_block): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        if (!linkMarkType) {
            return false;
        }

        const { selection } = state;

        if(!selection.isTextSelection()) {
            return false;
        }

        const { $from, from } = selection;

        // Check if cursor position already has a link
        if (linkMarkType.isInSet($from.marks()) || $from.marks().length > 1) {
            return false;
        }

        if(isCodeBlock(state, codeNodeType)) {
            return false;
        }

        // Extract text from line start to cursor position
        const lineStart: number = $from.start();
        const textBeforeCursor: string = state.doc.textBetween(lineStart, from, '');

        // Extract and validate URL from text
        const url = extractUrl(textBeforeCursor, keyType);
        if (!url) {
            return false;
        }

        // Calculate the start position of the link
        const linkStartPos = keyType === 'Enter' ? lineStart : from - url.length;

        // Apply the link mark and insert trigger character
        if (dispatch) {

            const linkMark: Mark = linkMarkType.create({
                href: url,
                title: url,
                target: '_blank',
            });

            const insertText = keyType === 'Enter' ? '\n' : ' ';

            const transaction: PmTransaction = state.transaction
                .addMark(linkStartPos, from, linkMark)
                .insertText(insertText);

            dispatch(transaction);
        }

        // Return true for Enter to prevent default, false for Space to allow default
        return keyType === 'Enter';
    };
}



/**
 * Extracts and validates a URL from the text based on the trigger key.
 *
 * @param text - The text to extract the URL from
 * @param keyType - The key that triggered the auto-link ('Enter' or 'Space')
 * @returns The extracted URL string, or null if no valid URL is found
 */
function extractUrl(text: string, keyType: AutoLinkTriggerKey): string | null {
    if (keyType === 'Enter') {
        return URL_PATTERN_ENTER.test(text) ? text : null;
    }

    const result = URL_PATTERN_SPACE.exec(text);
    return result ? result[0].trim() : null;
}
