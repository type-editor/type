import { setBlockType } from '@type-editor/commands';
import type { Command, PmEditorState } from '@type-editor/editor-types';
import type { Attrs, NodeType } from '@type-editor/model';

import { MenuItem } from '../../menubar/MenuItem';
import type { MenuItemSpec } from '../../types/MenuItemSpec';


/**
 * Build a menu item for changing the type of the textblock around the
 * selection to the given type. Provides `run`, `active`, and `select`
 * properties. Others must be given in `options`. `options.attrs` may
 * be an object to provide the attributes for the textblock node.
 *
 * @param nodeType - The node type to change the textblock to
 * @param options - Additional menu item options and node attributes
 * @returns A new MenuItem instance configured for block type changes
 */
export function blockTypeItem(nodeType: NodeType,
                              options: Partial<MenuItemSpec> & { attrs?: Attrs | null; }): MenuItem {
    const command: Command = setBlockType(nodeType, options.attrs);

    const passedOptions: Partial<MenuItemSpec> = {
        run: command,
        enable(state: PmEditorState): boolean {
            return command(state);
        },
        active(state: PmEditorState): boolean {
            const { $from, to, node } = state.selection;
            if (node) {
                return node.hasMarkup(nodeType, options.attrs);
            }
            return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs);
        }
    };

    // Copy only own properties from options, avoiding inherited properties and 'attrs'
    for (const prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop) && prop !== 'attrs') {
            const value = options[prop as keyof MenuItemSpec];
            if (value !== undefined) {
                (passedOptions as Record<string, unknown>)[prop] = value;
            }
        }
    }

    return new MenuItem(passedOptions as MenuItemSpec);
}
