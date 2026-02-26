import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';

import {cssClassProsemirrorMenu} from '../css-classes';
import type {MenuElement} from '../types/MenuElement';
import {combineUpdates} from './util/combine-updates';
import {createHtmlElement} from './util/create-html-element';


/**
 * Render the given, possibly nested, array of menu elements into a
 * document fragment, placing separators between them (and ensuring no
 * superfluous separators appear when some of the groups turn out to
 * be empty).
 *
 * @param view - The editor view instance
 * @param content - A nested array of menu element groups to render
 * @param showLabel - Whether to show labels for menu items (if applicable, e.g. in DropdownMenu)
 * @param isLegacy - Backward compatibility mode
 * @returns An object containing the document fragment and an update function
 */
export function renderGrouped(view: PmEditorView,
                              content: ReadonlyArray<ReadonlyArray<MenuElement>>,
                              showLabel = false,
                              isLegacy = false) {
    const result: DocumentFragment = document.createDocumentFragment();

    const updates: Array<(state: PmEditorState) => boolean> = [];
    const menuItems: Array<HTMLElement> = [];
    const separators: Array<HTMLElement> = [];
    let countItems = 0;

    for (let i = 0; i < content.length; i++) {
        let countSubItems = 0;
        const items: ReadonlyArray<MenuElement> = content[i];
        const localNodes: Array<HTMLElement> = [];
        const localUpdates: Array<(state: PmEditorState) => boolean> = [];

        let menuGroup: HTMLElement;
        // Create menu group container
        if(!isLegacy) {
            menuGroup = createHtmlElement(
                'div',
                {
                    class: `${cssClassProsemirrorMenu}group ${cssClassProsemirrorMenu}item`,
                    role: 'group'
                });
        }

        for (const item of items) {
            const {dom, update} = item.render(view, showLabel, isLegacy);

            // Skip invalid menu items
            if (!dom) {
                continue;
            }

            countItems++;
            countSubItems++;
            menuItems.push(dom);

            // Backward compatibility
            if(isLegacy) {
                const span: HTMLElement = createHtmlElement(
                    'span',
                    {
                        class: cssClassProsemirrorMenu + 'item',
                        tabindex: -1
                    },
                    dom);

                result.appendChild(span);
                localNodes.push(span);
            } else {
                menuGroup.appendChild(dom);
                localNodes.push(dom);
            }

            localUpdates.push(update);
        }

        if(!isLegacy && countSubItems) {
            result.appendChild(menuGroup);
        }

        if (localUpdates.length) {
            updates.push(combineUpdates(localUpdates, localNodes));
            // Backward compatibility
            if(isLegacy) {
                if (i < content.length - 1) {
                    separators.push(result.appendChild(separator()));
                }
            }
        }
    }

    const update = (state: PmEditorState): boolean => {
        void Promise.resolve().then((): void => {
            let needSep = false;

            for (let i = 0; i < updates.length; i++) {
                const hasContent: boolean = updates[i](state);
                // Backward compatibility
                if(isLegacy) {
                    if (i) {
                        separators[i - 1].style.display = needSep && hasContent ? '' : 'none';
                    }
                }

                needSep = hasContent;
            }
        });

        return true;
    };

    return countItems ? {
        dom: result,
        update,
        menuItems
    } : null;
}

/**
 * Creates a separator element for menu groups.
 *
 * @returns A span element styled as a menu separator
 */
function separator(): HTMLElement {
    return createHtmlElement(
        'span',
        {
            class: cssClassProsemirrorMenu + 'separator'
        });
}
