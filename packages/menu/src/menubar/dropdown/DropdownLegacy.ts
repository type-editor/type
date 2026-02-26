import type {PmEditorView} from '@type-editor/editor-types';
import type {EditorState} from '@type-editor/state';

import {cssClassProsemirrorMenu} from '../../css-classes';
import type {DropdownMenuOptions} from '../../types/DropdownMenuOptions';
import type {MenuElement} from '../../types/MenuElement';
import {createHtmlElement} from '../util/create-html-element';
import {translate} from '../../util/translate';
import {AbstractDropdownMenu} from './AbstractDropdownMenu';

/**
 * A drop-down menu, displayed as a label with a downwards-pointing
 * triangle to the right of it.
 *
 * @deprecated
 */
export class DropdownLegacy extends AbstractDropdownMenu implements MenuElement {

    private readonly _options: DropdownMenuOptions;

    /**
     * Create a dropdown wrapping the elements.
     *
     * @param content - A single menu element or array of menu elements to display in the dropdown
     * @param options - Configuration options for the dropdown appearance and behavior
     */
    constructor(content: ReadonlyArray<MenuElement> | MenuElement,
                options: DropdownMenuOptions = {}) {
        super(Array.isArray(content) ? content : [content]);
        this._options = options;
    }

    get content(): ReadonlyArray<MenuElement> {
        return this.items;
    }

    get options(): DropdownMenuOptions {
        return this._options;
    }

    /**
     * Render the dropdown menu and sub-items.
     *
     * @param view - The editor view instance
     * @returns An object containing the DOM element and an update function
     */
    public render(view: PmEditorView) {
        const content = this.renderDropdownItems(view);
        const win: Window = view.dom.ownerDocument.defaultView || window;

        const label: HTMLElement = createHtmlElement(
            'div',
            {
                class: cssClassProsemirrorMenu + '-dropdown ' + (this._options.class || ''),
                style: this._options.css
            },
            translate(view, this._options.label || ''));

        if (this._options.title) {
            label.setAttribute('title', translate(view, this._options.title));
        }

        const wrap: HTMLElement = createHtmlElement(
            'div',
            {
                class: cssClassProsemirrorMenu + '-dropdown-wrap'
            },
            label);

        let open: {
            close: () => boolean,
            node: HTMLElement;
        } | null = null;

        let listeningOnClose: ((this: Window, ev: MouseEvent) => void) | null = null;

        const close = () => {
            if (open?.close()) {
                open = null;
            }
            if (listeningOnClose) {
                win.removeEventListener('click', listeningOnClose);
                listeningOnClose = null;
            }
        };

        label.addEventListener('click', (mouseEvent: MouseEvent) => {
            mouseEvent.preventDefault();
            this.markMenuEvent(mouseEvent);

            if (open) {
                close();
            } else {
                open = this.expand(wrap, content.dom as ReadonlyArray<HTMLElement>);
                listeningOnClose = (): void => {
                    if (!this.isMenuEvent(wrap)) {
                        close();
                    }
                };
                win.addEventListener('click', listeningOnClose);
            }
        });

        const update = (state: EditorState): boolean => {
            const inner: boolean = content.update(state);
            wrap.style.display = inner ? '' : 'none';
            return inner;
        };

        return {
            dom: wrap,
            update
        };
    }

    /**
     * Expands the dropdown menu by appending menu items to the DOM.
     *
     * @internal
     * @param dom - The DOM element to append the menu to
     * @param items - Array of menu item nodes to display
     * @returns An object with a close function and the menu DOM node
     */
    private expand(dom: HTMLElement, items: ReadonlyArray<Node>) {
        const menuDOM: HTMLElement = createHtmlElement('div', {class: cssClassProsemirrorMenu + '-dropdown-menu ' + (this._options.class || '')}, items);

        let done = false;

        function close(): boolean {
            if (done) {return false;}
            done = true;

            // Safety check: only remove if menuDOM is still a child of dom
            if (menuDOM.parentNode === dom) {
                try {
                    dom.removeChild(menuDOM);
                } catch (e) {
                    // Menu already removed - ignore error
                    console.warn('Menu DOM element already removed', e);
                }
            }
            return true;
        }

        dom.appendChild(menuDOM);
        return {close, node: menuDOM};
    }
}

