import type {PmEditorView} from '@type-editor/editor-types';

import type {CoreWidgetViewSpec, CoreWidgetViewUserOptions, WidgetDecorationSpec} from './CoreWidgetViewOptions';

/**
 * Framework-agnostic base class for custom ProseMirror widget decoration views.
 *
 * Widget views render inline decorations that are not tied to a specific
 * document node.  Subclasses hook into framework-specific rendering pipelines.
 *
 * @typeParam Component - The UI component type used by the concrete framework
 *   adapter.
 */
export class CoreWidgetView<Component> {

    /** The ProseMirror editor view, available after {@link bind} is called. */
    protected view?: PmEditorView;

    /** User-supplied configuration for the widget view. */
    protected readonly options: CoreWidgetViewUserOptions<Component>;

    private readonly _dom: HTMLElement;
    private readonly _pos: number;
    private getPosFunc?: () => number | undefined;

    /**
     * @param widgetViewSpec - The specification object containing the document
     *   position, optional decoration spec, and user options.
     */
    constructor(widgetViewSpec: CoreWidgetViewSpec<Component>) {
        const {pos, spec, options} = widgetViewSpec;
        this._pos = pos;
        this.options = options;
        this._spec = spec;

        this._dom = this.createElement(options.as);
        this._dom.setAttribute('data-widget-view-root', 'true');
    }

    private _spec?: WidgetDecorationSpec;

    /** The decoration spec associated with this widget. */
    get spec(): WidgetDecorationSpec {
        return this._spec;
    }

    set spec(spec: WidgetDecorationSpec) {
        this._spec = spec;
    }

    /** The outer DOM element representing this widget in the document. */
    get dom(): HTMLElement {
        return this._dom;
    }

    /** The document position where this widget was originally created. */
    get pos(): number {
        return this._pos;
    }

    /** The user-supplied UI component rendered by this widget view. */
    get component(): Component {
        return this.options.component;
    }

    /**
     * Associates this widget view with an editor view and a position callback.
     * Called by the widget decoration factory after the widget DOM has been
     * inserted into the document.
     *
     * @param view - The ProseMirror editor view.
     * @param getPos - Callback returning the widget's current document position.
     */
    public bind(view: PmEditorView,
                getPos: () => number | undefined): void {
        this.view = view;
        this.getPosFunc = getPos;
    }

    /**
     * Returns the current document position of this widget, or `undefined` if
     * the widget has not been bound or is no longer part of the document.
     */
    protected getPos(): number | undefined {
        return this.getPosFunc?.();
    }

    /**
     * Creates the widget's root DOM element from the user-supplied `as` option.
     *
     * @param as - Either an existing `HTMLElement` or a tag name string.
     * @returns The created (or supplied) HTML element.
     */
    private createElement(as: string | HTMLElement): HTMLElement {
        return as instanceof HTMLElement ? as : document.createElement(as);
    }

}
