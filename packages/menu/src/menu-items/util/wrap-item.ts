import {wrapIn} from '@type-editor/commands';
import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {Attrs, NodeType} from '@type-editor/model';

import {MenuItem} from '../../menubar/MenuItem';
import type {MenuItemSpec} from '../../types/MenuItemSpec';


/**
 * Build a menu item for wrapping the selection in a given node type.
 * Adds `run` and `select` properties to the ones present in
 * `options`. `options.attrs` may be an object that provides
 * attributes for the wrapping node.
 *
 * @param nodeType - The node type to wrap the selection in
 * @param options - Additional menu item options and node attributes
 * @returns A new MenuItem instance configured for wrapping
 */
export function wrapItem(nodeType: NodeType,
                         options: Partial<MenuItemSpec> & { attrs?: Attrs | null; }): MenuItem {
    const passedOptions: Partial<MenuItemSpec> = {
        run(state: PmEditorState, dispatch: (transaction: PmTransaction) => void): boolean {
            return wrapIn(nodeType, options.attrs)(state, dispatch);
        },
        select(state: PmEditorState): boolean {
            return wrapIn(nodeType, options.attrs)(state);
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
