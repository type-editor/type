import type { PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';

import { cssClassProsemirrorMenu } from '../css-classes';
import type { MenuElement } from '../types/MenuElement';
import type { MenuItemSpec } from '../types/MenuItemSpec';
import type { ParentMenuElement } from '../types/ParentMenuElement';
import { setClass } from '../util/set-class';
import { translate } from '../util/translate';
import { getIcon } from './icons/get-icon';
import { createHtmlElement } from './util/create-html-element';

/**
 * An icon or label that, when clicked, executes a command.
 */
export class MenuItem implements MenuElement {

    private readonly _spec: MenuItemSpec;

    /**
     * Create a menu item.
     * @param spec - The spec used to create this item.
     */
    constructor(spec: MenuItemSpec) {
        this._spec = spec;
    }

    get spec(): MenuItemSpec {
        return this._spec;
    }

    /**
     * Renders the menu element according to its [display
     * spec](#menu.MenuItemSpec.display), and adds an event handler which
     * executes the command when the representation is clicked.
     *
     * @param view - The editor view instance
     * @param showLabel - Whether to show the label (if applicable)
     * @param isLegacy - Backward compatibility mode
     * @param parentMenuElement - The parent menu element to notify of updates of child elements (especially in dropdown menus)
     * @returns An object containing the DOM element and an update function
     */
    public render(view: PmEditorView, showLabel = false, isLegacy = false, parentMenuElement?: ParentMenuElement) {
        if(!this._spec) {
            return null;
        }

        const dom: HTMLElement = this.createDomElement(view, showLabel, isLegacy);
        this.applyTitleAttribute(dom, view);
        this.applyClassAndStyles(dom);
        this.updateEnabledState(dom, view.state);
        this.attachClickHandler(dom, view);
        const update = this.createUpdateFunction(dom, parentMenuElement);

        return {dom, update};
    }

    /**
     * Creates the DOM element for this menu item based on the spec.
     *
     * @param view - The editor view instance
     * @param showLabel - Whether to show the label (if applicable)
     * @param isLegacy - Backward compatibility mode
     * @returns The created DOM element
     * @throws {RangeError} If no icon, label, or render function is provided
     */
    private createDomElement(view: PmEditorView, showLabel = false, isLegacy = false): HTMLElement {
        const spec: MenuItemSpec = this._spec;

        if (spec.render) {
            const htmlElement: HTMLElement | null = spec.render(view);
            if(htmlElement) {
                return htmlElement;
            }
        }

        const title = translate(view, spec.label || (typeof spec.title === 'function' ? spec.title(view.state) : spec.title) || '');

        if (spec.icon) {
            return getIcon(view.root, spec.icon, title, showLabel, isLegacy);
        }

        if (spec.label) {
            return createHtmlElement(isLegacy ? 'div' : 'button', { tabindex: '-1' }, title);
        }

        throw new RangeError('MenuItem without icon or label property');
    }

    /**
     * Applies the title attribute to the DOM element if specified.
     *
     * @param dom - The DOM element to modify
     * @param view - The editor view instance
     */
    private applyTitleAttribute(dom: HTMLElement, view: PmEditorView): void {
        const {title} = this._spec;
        if (!title) {
            return;
        }

        const titleText: string = typeof title === 'function' ? title(view.state) : title;
        dom.setAttribute('title', translate(view, titleText));
        dom.ariaLabel = titleText;
    }

    /**
     * Applies CSS class and inline styles to the DOM element.
     *
     * @param dom - The DOM element to modify
     */
    private applyClassAndStyles(dom: HTMLElement): void {
        const {class: cssClass, css} = this._spec;

        if (cssClass) {
            dom.classList.add(cssClass);
        }

        if (css) {
            dom.style.cssText += css;
        }
    }

    /**
     * Attaches the click event handler to execute the command.
     *
     * @param dom - The DOM element to attach the handler to
     * @param view - The editor view instance
     */
    private attachClickHandler(dom: HTMLElement, view: PmEditorView): void {
        dom.addEventListener('click', (mouseEvent: MouseEvent): void => {
            mouseEvent.preventDefault();

            if (dom.classList.contains(cssClassProsemirrorMenu + '-disabled')) {
                return;
            }

            const dispatch = (transaction: PmTransaction): void => {
                view.dispatch(transaction);
            };

            view.focus();
            setTimeout(() => { this._spec.run(view.state, dispatch, view, mouseEvent); }, 10);
        });
    }

    /**
     * Creates the update function that refreshes the menu item state.
     *
     * @param dom - The DOM element to update
     * @param parentMenuElement
     * @returns A function that updates the element based on editor state
     */
    private createUpdateFunction(dom: HTMLElement,
                                 parentMenuElement?: ParentMenuElement): (state: PmEditorState) => boolean {
        return (state: PmEditorState): boolean => {
            // Check if item should be visible
            if (!this.updateVisibility(dom, state)) {
                return false;
            }

            // Update enabled state
            const enabled = this.updateEnabledState(dom, state);

            // Update active state
            this.updateActiveState(dom, state, enabled, parentMenuElement);

            return true;
        };
    }

    /**
     * Updates the visibility of the menu item.
     *
     * @param dom - The DOM element to update
     * @param state - The current editor state
     * @returns true if the item should be visible, false otherwise
     */
    private updateVisibility(dom: HTMLElement, state: PmEditorState): boolean {
        const {select} = this._spec;
        if (!select) {
            return true;
        }

        const selected = select(state);
        dom.style.display = selected ? '' : 'none';
        return selected;
    }

    /**
     * Updates the enabled state of the menu item.
     *
     * @param dom - The DOM element to update
     * @param state - The current editor state
     * @returns true if the item is enabled, false otherwise
     */
    private updateEnabledState(dom: HTMLElement, state: PmEditorState): boolean {
        const {enable} = this._spec;
        const enabled: boolean = enable ? (enable(state) || false) : true;
        setClass(dom, `${cssClassProsemirrorMenu}-disabled`, !enabled);
        dom.ariaDisabled = !enabled ? 'true' : null;
        return enabled;
    }

    /**
     * Updates the active state of the menu item.
     *
     * @param dom - The DOM element to update
     * @param state - The current editor state
     * @param enabled - Whether the item is currently enabled
     * @param parentMenuElement
     */
    private updateActiveState(dom: HTMLElement,
                              state: PmEditorState,
                              enabled: boolean,
                              parentMenuElement?: ParentMenuElement): void {
        const {active} = this._spec;
        if (!active) {
            return;
        }

        const isActive = enabled && active(state);
        setClass(dom, `${cssClassProsemirrorMenu}-active`, isActive);
        dom.ariaPressed = isActive ? 'true' : 'false';

        if(isActive && parentMenuElement) {
            parentMenuElement.notifySubElementIsActive(this._spec);
        }
    }
}
