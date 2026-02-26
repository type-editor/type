import type {PluginView, PmEditorState, PmEditorView} from '@type-editor/editor-types';

import type {CorePluginViewSpec, CorePluginViewUserOptions} from './CorePluginViewOptions';

/**
 * Framework-agnostic base class for custom ProseMirror plugin views.
 *
 * A plugin view is a UI component that is rendered alongside the editor and
 * receives updates whenever the editor state changes.  Subclasses hook into
 * framework-specific rendering pipelines (React portals, Vue teleports, etc.).
 *
 * @typeParam ComponentType - The UI component type used by the concrete
 *   framework adapter.
 */
export class CorePluginView<ComponentType> implements PluginView {

    /** The ProseMirror editor view this plugin view observes. */
    protected view: PmEditorView;

    /** The editor state *before* the most recent transaction. */
    protected prevState?: PmEditorState;

    /** User-supplied configuration for the plugin view. */
    protected readonly options: CorePluginViewUserOptions<ComponentType>;

    /**
     * @param spec - The specification object containing the editor view and
     *   user options.
     */
    constructor(spec: CorePluginViewSpec<ComponentType>) {
        this.view = spec.view;
        this.options = spec.options;
    }

    /** The user-supplied UI component rendered by this plugin view. */
    get component(): ComponentType {
        return this.options.component;
    }

    /**
     * The DOM element the plugin view should be rendered into.
     *
     * If the user-supplied `root` callback returns an element it is used;
     * otherwise the editor's direct parent element is used, falling back to
     * `document.body`.
     */
    get root(): HTMLElement {
        let root: HTMLElement = this.options.root?.(this.view.dom);

        if (!root) {
            root = this.view.dom.parentElement ?? document.body;
        }

        return root;
    }

    /**
     * Called by ProseMirror after every transaction.
     *
     * @param view - The (possibly updated) editor view.
     * @param prevState - The editor state before the transaction.
     */
    public update(view: PmEditorView, prevState: PmEditorState): void {
        this.view = view;
        this.prevState = prevState;
        this.options.update?.(view, prevState);
    }

    /** Tears down the plugin view and invokes the user-supplied `destroy` callback. */
    public destroy(): void {
        this.options.destroy?.();
    }
}
