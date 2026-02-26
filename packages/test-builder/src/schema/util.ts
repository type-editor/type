import type {OrderedMap} from '@type-editor/commons';
import type {NodeSpec} from '@type-editor/model';

import {bulletList, listItem, orderedList} from './schema-list';


/**
 * Merges two objects, with properties from the second object overriding the first.
 */
function mergeNodeSpec(base: NodeSpec, overrides: Partial<NodeSpec>): NodeSpec {
    return { ...base, ...overrides };
}


/**
 * Convenience function for adding list-related node types to a map
 * specifying the nodes for a schema. Adds
 * [`orderedList`](#schema-list.orderedList) as `'ordered_list'`,
 * [`bulletList`](#schema-list.bulletList) as `'bullet_list'`, and
 * [`listItem`](#schema-list.listItem) as `'list_item'`.
 *
 * `itemContent` determines the content expression for the list items.
 * If you want the commands defined in this module to apply to your
 * list structure, it should have a shape like `'paragraph block*'` or
 * `'paragraph (ordered_list | bullet_list)*'`. `listGroup` can be
 * given to assign a group name to the list node types, for example
 * `'block'`.
 *
 * @param nodes
 * @param itemContent
 * @param listGroup
 */
export function addListNodes(nodes: OrderedMap<NodeSpec>,
                             itemContent: string,
                             listGroup?: string): OrderedMap<NodeSpec> {
    return nodes.append({
        ordered_list: mergeNodeSpec(orderedList, { content: 'list_item+', group: listGroup }),
        bullet_list: mergeNodeSpec(bulletList, { content: 'list_item+', group: listGroup }),
        list_item: mergeNodeSpec(listItem, { content: itemContent }),
    });
}
