import type {PmEditorView} from '@type-editor/editor-types';
import type {EditorState} from '@type-editor/state';

import {cssClassProsemirrorMenu} from '../../css-classes';
import type { DropdownMenuOptions } from '../../types/DropdownMenuOptions';
import type {MenuElement} from '../../types/MenuElement';
import {combineUpdates} from '../util/combine-updates';
import {createHtmlElement} from '../util/create-html-element';

/**
 * Tracks the last menu event to determine if a click originated from a menu.
 * This is used to prevent menus from closing when clicking within them.
 */
interface LastMenuEvent {
    /** Timestamp of the last menu event in milliseconds */
    time: number;
    /** The DOM node that was the target of the last menu event */
    node: null | Node;
}


export class AbstractDropdownMenu {

    private static readonly MENU_EVENT_WINDOW_MS: number = 100;

    private static readonly LAST_MENU_EVENT: LastMenuEvent = {
        time: 0,
        node: null
    };

    protected readonly items: ReadonlyArray<MenuElement>;

    protected constructor(items: ReadonlyArray<MenuElement>) {
        this.items = items;
    }

    /**
     * Renders an array of menu elements as dropdown items.
     *
     * @param view - The editor view instance
     * @param options - Configuration options for the dropdown appearance and behavior
     * @param isLegacy - Backward compatibility mode
     * @returns An object containing rendered DOM elements and a combined update function
     */
    protected renderDropdownItems(view: PmEditorView,
                                  options: DropdownMenuOptions = {},
                                  isLegacy = false) {
        const rendered: Array<HTMLElement> = [];
        const subMenuItems: Array<HTMLElement> = [];
        const dropdownList: HTMLElement = createHtmlElement('ul', {
            role: 'menu',
            tabindex: -1,
            class: cssClassProsemirrorMenu + '-dropdown-menu ' + (options.class || '')
        });
        const updates: Array<(state: EditorState) => boolean> = [];

        for (const item of this.items) {
            const {dom, update} = item.render(view, options.showLabel, isLegacy);
            subMenuItems.push(dom);

            // Create dropdown using html list (<ul>)
            if(!isLegacy) {
                const dropdownListItem: HTMLElement = createHtmlElement('li', {
                    class: cssClassProsemirrorMenu + '-dropdown-item',
                    tabindex: -1,
                    role: 'menuitem'
                }, dom);
                dropdownList.appendChild(dropdownListItem);
                rendered.push(dropdownListItem);
            }
            // Backward compatibility using divs
            else {
                rendered.push(createHtmlElement('div', {class: cssClassProsemirrorMenu + '-dropdown-item'}, dom));
            }

            updates.push(update);
        }

        return {
            dom: isLegacy  ? rendered : dropdownList,
            update: combineUpdates(updates, rendered),
            domList: subMenuItems
        };
    }

    /**
     * Checks if a recent event originated from within a menu wrapper.
     * Events are considered "recent" if they occurred within the last 100ms.
     *
     * @param wrapper - The menu wrapper element to check against
     * @returns true if a recent event originated from within the wrapper
     */
    protected isMenuEvent(wrapper: HTMLElement): boolean {
        const timeSinceLastEvent: number = Date.now() - AbstractDropdownMenu.LAST_MENU_EVENT.time;
        return timeSinceLastEvent < AbstractDropdownMenu.MENU_EVENT_WINDOW_MS
            && AbstractDropdownMenu.LAST_MENU_EVENT.node !== null
            && wrapper.contains(AbstractDropdownMenu.LAST_MENU_EVENT.node);
    }

    /**
     * Marks an event as a menu event by recording its timestamp and target node.
     *
     * @param e - The event to mark
     */
    protected markMenuEvent(e: Event): void {
        AbstractDropdownMenu.LAST_MENU_EVENT.time = Date.now();
        AbstractDropdownMenu.LAST_MENU_EVENT.node = e.target as Node;
    }
}
