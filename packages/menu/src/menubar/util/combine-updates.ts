import type {PmEditorState} from '@type-editor/editor-types';

/**
 * Combines multiple update functions into a single update function.
 * Each update function controls the visibility of its corresponding node.
 *
 * @param updates - Array of update functions to combine
 * @param nodes - Array of DOM nodes corresponding to each update function
 * @returns A combined update function that returns true if any item is visible
 */
export function combineUpdates(updates: ReadonlyArray<(state: PmEditorState) => boolean>, nodes: ReadonlyArray<HTMLElement>) {
    return (state: PmEditorState): boolean => {
        let something = false;
        for (let i = 0; i < updates.length; i++) {
            const up: boolean = updates[i](state);
            if(nodes[i]) {
                nodes[i].style.display = up ? '' : 'none';
                if (up) {
                    something = true;
                }
            }
        }
        return something;
    };
}
