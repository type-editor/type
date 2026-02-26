import { isUndefinedOrNull } from '@type-editor/commons';
import type { PmEditorState } from '@type-editor/editor-types';
import type { Attrs, NodeType, PmNode } from '@type-editor/model';

import { findParent } from './find-parent';
import type { FindParentResult } from './types/FindParentResult';

export function isInNodeType(state: PmEditorState, nodeType: NodeType, attrs?: Attrs): boolean {
    const findResult: FindParentResult | null = findParent(state.selection, (node: PmNode): boolean => {
        if(node.type !== nodeType) {
            return false;
        }
        if(isUndefinedOrNull(attrs)) {
            return true;
        }
        for(const attrKey of Object.keys(attrs)) {
            if(String(node.attrs[attrKey]) !== String(attrs[attrKey])) {
                return false;
            }
        }
        return true;
    });

    return !isUndefinedOrNull(findResult);
}
