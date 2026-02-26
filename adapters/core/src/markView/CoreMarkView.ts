import {isUndefinedOrNull} from '@type-editor/commons';
import type {MarkView, PmEditorView, ViewMutationRecord} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';

import type {CoreMarkViewSpec, CoreMarkViewUserOptions, MarkViewDOMSpec} from './CoreMarkViewOptions';

/**
 * Framework-agnostic base class for custom ProseMirror mark views.
 *
 * Subclasses (e.g. `ReactMarkView`, `VueMarkView`, `SvelteMarkView`) extend
 * this class and hook into their respective rendering pipelines.
 *
 * @typeParam ComponentType - The UI component type used by the concrete
 *   framework adapter (e.g. a React `ComponentType`, a Vue `DefineComponent`,
 *   or a Svelte component constructor).
 */
export class CoreMarkView<ComponentType> implements MarkView {

    /** User-supplied configuration for the mark view. */
    protected readonly options: CoreMarkViewUserOptions<ComponentType>;

    /** The ProseMirror mark rendered by this view. */
    protected readonly mark: Mark;

    /** The ProseMirror editor view this mark view belongs to. */
    protected readonly view: PmEditorView;

    /** Whether this mark appears in an inline context. */
    private readonly inline: boolean;

    /**
     * @param markViewSpec - The specification object containing the mark, view,
     *   inline flag, and user options.
     */
    constructor(markViewSpec: CoreMarkViewSpec<ComponentType>) {
        const {mark, view, inline, options} = markViewSpec;
        this.mark = mark;
        this.view = view;
        this.inline = inline;
        this.options = options;

        this._dom = this.createElement(options.as);
        this._contentDOM = this.createElement(options.contentAs);
        this._dom.setAttribute('data-mark-view-root', 'true');
        this._contentDOM.setAttribute('data-mark-view-content', 'true');
        this._contentDOM.style.whiteSpace = 'inherit';
    }

    protected _contentDOM: HTMLElement;

    /** The DOM element where ProseMirror places the mark's editable content. */
    get contentDOM(): HTMLElement {
        return this._contentDOM;
    }

    protected _dom: HTMLElement;

    /** The outer DOM element that ProseMirror treats as this mark's representation. */
    get dom(): HTMLElement {
        return this._dom;
    }

    /** The user-supplied UI component rendered by this mark view. */
    get component(): ComponentType {
        return this.options.component;
    }

    /**
     * Called by ProseMirror to decide whether a DOM mutation should be ignored.
     *
     * A user-supplied `ignoreMutation` callback is consulted first.  If it does
     * not return a boolean, {@link shouldIgnoreMutation} provides a sensible
     * default.
     *
     * @param mutation - The observed DOM mutation.
     * @returns `true` if the mutation should be ignored by ProseMirror.
     */
    public ignoreMutation(mutation: ViewMutationRecord): boolean {
        if (!this.dom || !this._contentDOM) {
            return true;
        }

        let result: boolean | undefined;

        const userIgnoreMutation = this.options.ignoreMutation;

        if (userIgnoreMutation) {
            result = userIgnoreMutation(mutation);
        }

        if (typeof result !== 'boolean') {
            result = this.shouldIgnoreMutation(mutation);
        }

        return result;
    }

    /** Removes the mark view's DOM elements and invokes the user-supplied `destroy` callback. */
    public destroy(): void {
        this.options.destroy?.();
        this._dom.remove();
        this._contentDOM.remove();
    }

    /**
     * Default implementation for deciding whether a DOM mutation should be
     * ignored.  Mutations that target the `contentDOM` attributes or fall
     * outside `contentDOM` are ignored; mutations inside `contentDOM` (except
     * selection changes) are forwarded to ProseMirror.
     *
     * @param mutation - The observed DOM mutation.
     * @returns `true` if the mutation should be ignored.
     */
    protected shouldIgnoreMutation(mutation: ViewMutationRecord): boolean {
        if (!this.dom || !this._contentDOM) {
            return true;
        }

        if (mutation.type === 'selection') {
            return false;
        }

        if (this._contentDOM === mutation.target && mutation.type === 'attributes') {
            return true;
        }

        if (this._contentDOM.contains(mutation.target)) {
            return false;
        }

        return true;
    }

    /**
     * Creates an HTML element from a {@link MarkViewDOMSpec}.
     *
     * - `undefined` / `null` → creates a `<span>` (inline) or `<div>` (block).
     * - An `HTMLElement` instance → used as-is.
     * - A function → called with the current mark; must return an element.
     * - A string → used as the tag name for `document.createElement`.
     *
     * @param markViewSpec - The specification describing how to create the element.
     * @returns The created (or supplied) HTML element.
     */
    private createElement(markViewSpec?: MarkViewDOMSpec): HTMLElement {
        const {inline, mark} = this;

        if (isUndefinedOrNull(markViewSpec)) {
            return document.createElement(inline ? 'span' : 'div');
        }

        if (markViewSpec instanceof HTMLElement) {
            return markViewSpec;
        }

        if (typeof markViewSpec === 'function') {
            return markViewSpec(mark);
        }

        return document.createElement(markViewSpec);
    }
}
