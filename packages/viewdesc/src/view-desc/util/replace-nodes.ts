import type {PmEditorView} from '@type-editor/editor-types';

import type {MarkViewDesc} from '../MarkViewDesc';
import type {TextViewDesc} from '../TextViewDesc';
import type {ViewDesc} from '../ViewDesc';


/**
 * Replace range from-to in an array of view descs with replacement
 * (may be undefined to just delete). This goes very much against the grain
 * of the rest of this code, which tends to create nodes with the
 * right shape in one go, rather than messing with them after
 * creation, but is necessary in the composition hack.
 *
 * @param nodes - The array of view descriptions
 * @param from - Start position of the range to replace
 * @param to - End position of the range to replace
 * @param view - The editor view
 * @param replacement - Optional replacement view description
 * @returns A new array with the replacement applied
 */
export function replaceNodes(nodes: ReadonlyArray<ViewDesc>,
                             from: number,
                             to: number,
                             view: PmEditorView,
                             replacement?: ViewDesc): Array<ViewDesc> {
    const result: Array<ViewDesc> = [];
    for (let i = 0, off = 0; i < nodes.length; i++) {
        const child: ViewDesc = nodes[i];
        const start: number = off;
        const end: number = off += child.size;
        if (start >= to || end <= from) {
            result.push(child);
        } else {
            if (start < from) {
                result.push((child as MarkViewDesc | TextViewDesc).slice(0, from - start, view));
            }

            if (replacement) {
                result.push(replacement);
                replacement = undefined;
            }

            if (end > to) {
                result.push((child as MarkViewDesc | TextViewDesc).slice(to - start, child.size, view));
            }
        }
    }
    return result;
}
