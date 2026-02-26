import type { PmEditorView } from '@type-editor/editor-types';
import type { EditorState } from '@type-editor/state';

import { cssClassProsemirrorMenu } from '../../css-classes';
import type { MenuElement } from '../../types/MenuElement';
import type { SubMenuOptions } from '../../types/SubMenuOptions';
import { translate } from '../../util/translate';
import { createHtmlElement } from '../util/create-html-element';
import { AbstractDropdownMenu } from './AbstractDropdownMenu';


/**
 * Represents a submenu wrapping a group of elements that start
 * hidden and expand to the right when hovered over or tapped.
 */
export class DropdownSubmenu extends AbstractDropdownMenu implements MenuElement {

    private readonly _options: SubMenuOptions;

    /**
     * Creates a submenu for the given group of menu elements.
     *
     * @param content - A single menu element or array of menu elements to display in the submenu
     * @param options - Configuration options for the submenu appearance
     */
    constructor(content: ReadonlyArray<MenuElement> | MenuElement,
                options: SubMenuOptions = {}) {
        super(Array.isArray(content) ? content : [content]);
        this._options = options;
    }

    get content(): ReadonlyArray<MenuElement> {
        return this.items;
    }

    get options(): SubMenuOptions {
        return this._options;
    }

    /**
     * Renders the submenu.
     *
     * @param view - The editor view instance
     * @returns An object containing the DOM element and an update function
     */
    public render(view: PmEditorView) {
        const items = this.renderDropdownItems(view);
        const win: Window = view.dom.ownerDocument.defaultView || window;

        const label: HTMLElement = createHtmlElement(
            'div',
            {
                class: `${cssClassProsemirrorMenu}-submenu-label`
            },
            translate(view, this._options.label || ''));

        const innerElement: HTMLElement = createHtmlElement(
            'div',
            {
                class: `${cssClassProsemirrorMenu}-submenu`
            },
            items.dom);

        const wrap: HTMLElement = createHtmlElement(
            'div',
            {
                class: `${cssClassProsemirrorMenu}-submenu-wrap`
            },
            label,
            innerElement);

        let listeningOnClose: ((this: Window, ev: MouseEvent) => void) | null = null;

        label.addEventListener('click', (mouseEvent: MouseEvent): void => {
            mouseEvent.preventDefault();
            this.markMenuEvent(mouseEvent);

            if (!listeningOnClose) {
                // Activate the submenu
                wrap.classList.add(`${cssClassProsemirrorMenu}-submenu-wrap-active`);

                listeningOnClose = (): void => {
                    if (!this.isMenuEvent(wrap)) {
                        wrap.classList.remove(`${cssClassProsemirrorMenu}-submenu-wrap-active`);
                        if (listeningOnClose) {
                            win.removeEventListener('click', listeningOnClose);
                            listeningOnClose = null;
                        }
                    }
                };
                win.addEventListener('click', listeningOnClose);
            } else {
                // Deactivate the submenu
                wrap.classList.remove(`${cssClassProsemirrorMenu}-submenu-wrap-active`);
                if (listeningOnClose) {
                    win.removeEventListener('click', listeningOnClose);
                    listeningOnClose = null;
                }
            }
        });

        const update = (state: EditorState): boolean => {
            const inner: boolean = items.update(state);
            wrap.style.display = inner ? '' : 'none';
            return inner;
        };

        return {
            dom: wrap,
            update
        };
    }
}
