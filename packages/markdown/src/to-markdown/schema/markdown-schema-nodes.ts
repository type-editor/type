import {type Node} from '@type-editor/model';

import type {MarkdownSerializerState} from '../MarkdownSerializerState';


export const markdownSchemaNodes = {

    blockquote(state: MarkdownSerializerState, node: Node): void {
        state.wrapBlock('> ', null, node, (): void => {
            state.renderContent(node);
        });
    },

    code_block(state: MarkdownSerializerState, node: Node): void {
        // Find all backtick sequences in the code to ensure our fence is longer
        const backtickMatches: RegExpMatchArray | null = node.textContent.match(/`{3,}/gm);
        // Use one more backtick than the longest sequence found, or default to ```
        // We copy the array before sorting to avoid mutating the original
        const fence: string = backtickMatches
            ? ([...backtickMatches].sort().slice(-1)[0] + '`')
            : '```';

        // Add language identifier if present (e.g., ```javascript)
        const params: string = node.attrs.params as string || '';
        state.write(fence + params + '\n');
        state.text(node.textContent, false);
        state.write('\n');
        state.write(fence);
        state.closeBlock(node);
    },

    heading(state: MarkdownSerializerState, node: Node): void {
        state.write(state.repeat('#', node.attrs.level as number) + ' ');
        state.renderInline(node, false);
        state.closeBlock(node);
    },

    horizontal_rule(state: MarkdownSerializerState, node: Node): void {
        state.write(node.attrs.markup as string || '---');
        state.closeBlock(node);
    },

    bullet_list(state: MarkdownSerializerState, node: Node): void {
        state.renderList(node, '  ', () => (node.attrs.bullet as string || '*') + ' ');
    },

    ordered_list(state: MarkdownSerializerState, node: Node): void {
        const start: number = node.attrs.order as number || 1;
        // Calculate the width needed for the highest number to align all items
        const maxW: number = String(start + node.childCount - 1).length;
        const space: string = state.repeat(' ', maxW + 2);
        state.renderList(node, space, i => {
            const nStr = String(start + i);
            // Pad numbers with spaces so all items align vertically
            return state.repeat(' ', maxW - nStr.length) + nStr + '. ';
        });
    },

    list_item(state: MarkdownSerializerState, node: Node): void {
        state.renderContent(node);
    },

    paragraph(state: MarkdownSerializerState, node: Node): void {
        state.renderInline(node);
        state.closeBlock(node);
    },

    image(state: MarkdownSerializerState, node: Node): void {
        // Format: ![alt](src "title")
        // Escape parentheses in src and quotes in title to prevent markdown parsing issues
        state.write(`![${state.esc(node.attrs.alt as string || '')}](${(node.attrs.src as string).replace(/[()]/g, '\\$&')}${node.attrs.title ? ' "' + (node.attrs.title as string).replace(/"/g, '\\"') + '"' : ''})`);
    },

    hard_break(state: MarkdownSerializerState, node: Node, parent: Node, index: number): void {
        // Only write a hard break if this is not the last node or if there are non-hard-break siblings after it
        for (let i = index + 1; i < parent.childCount; i++) {
            if (parent.child(i).type !== node.type) {
                state.write('\\\n');
                return;
            }
        }
    },

    text(state: MarkdownSerializerState, node: Node): void {
        state.text(node.text, !state.inAutolink);
    }
};
