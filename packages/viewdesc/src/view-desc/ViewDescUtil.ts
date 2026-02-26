import {ELEMENT_NODE} from '@type-editor/commons';
import type {PmViewDesc} from '@type-editor/editor-types';

import type {NodeViewDesc} from './NodeViewDesc';
import type {ViewDesc} from './ViewDesc';


export class ViewDescUtil {

    /**
     * Scan up the DOM tree to find the first view description that is a descendant of this one.
     *
     * @param viewDesc
     * @param dom - The DOM node to start from
     * @returns The nearest view description, or undefined if none found
     */
    public static nearestViewDesc(viewDesc: PmViewDesc, dom: Node): ViewDesc | undefined {
        return ViewDescUtil.nearestDesc(viewDesc, dom, false) as ViewDesc | undefined;
    }

    /**
     * Scan up the DOM tree to find the first node view description that is a descendant of this one.
     *
     * @param viewDesc
     * @param dom - The DOM node to start from
     * @returns The nearest node view description, or undefined if none found
     */
    public static nearestNodeViewDesc(viewDesc: PmViewDesc, dom: Node): NodeViewDesc | undefined {
        return ViewDescUtil.nearestDesc(viewDesc, dom, true) as NodeViewDesc | undefined;
    }

    private static nearestDesc(viewDesc: PmViewDesc, dom: Node, onlyNodes: boolean): PmViewDesc | undefined {
        let first = true;
        for (let cur: Node | null = dom; cur; cur = cur.parentNode) {
            const desc: PmViewDesc = viewDesc.getDesc(cur);
            let nodeDOM: Node;

            if (desc && (!onlyNodes || desc.node)) {
                // If dom is outside of this desc's nodeDOM, don't count it.
                if (first
                    && (nodeDOM = desc.nodeDOM)
                    && !(nodeDOM.nodeType === ELEMENT_NODE ? nodeDOM.contains(dom.nodeType === ELEMENT_NODE ? dom : dom.parentNode) : nodeDOM === dom)) {
                    first = false;
                } else {
                    return desc;
                }
            }
        }
    }


}
