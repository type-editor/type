import {browser} from '@type-editor/commons';
import type {TagParseRule} from '@type-editor/model';


/**
 * Handles parsing rules for BR nodes, working around Safari quirks.
 *
 * Safari has several quirks related to BR elements that require special handling:
 *
 * 1. **List/Table Cell Deletion (issues #708, #862):**
 *    When deleting the last character in a list item or table cell, Safari
 *    replaces the list item/cell with a BR directly in the parent list/table node.
 *    This creates invalid HTML structure (BR as direct child of UL/OL) that needs
 *    to be corrected during parsing by wrapping it in a proper list item.
 *
 * 2. **Trailing BR in Tables:**
 *    Safari sometimes adds trailing BR elements in table rows/cells that should
 *    be ignored during parsing as they're artifacts of the contentEditable behavior.
 *
 * The function examines the parent node to determine which quirk is occurring
 * and returns the appropriate parse rule to handle it correctly.
 *
 * @param dom - The BR DOM node that needs special handling. Must have a parentNode
 *              for any of the special cases to apply.
 * @returns A parse rule for the BR node:
 *          - For Safari list quirk: Returns a skipDiv rule that wraps the BR in a list item structure
 *          - For trailing BRs or Safari table quirk: Returns an ignore rule to skip the BR
 *          - Otherwise: Returns null for default BR handling
 *
 * @see https://github.com/ProseMirror/prosemirror/issues/708
 * @see https://github.com/ProseMirror/prosemirror/issues/862
 */
export function handleBRNodeRule(dom: DOMNode): Omit<TagParseRule, 'tag'> | null {
    const parent = dom.parentNode;

    if (!parent) {
        return null;
    }

    // Safari list quirk
    if (browser.safari && /^(ul|ol)$/i.test(parent.nodeName)) {
        const skipDiv: HTMLDivElement = document.createElement('div');
        skipDiv.appendChild(document.createElement('li'));
        return { skipDiv } as any;
    }

    // Safari table quirk or trailing BR
    if (parent.lastChild === dom || (browser.safari && /^(tr|table)$/i.test(parent.nodeName))) {
        return { ignore: true };
    }

    return null;
}
