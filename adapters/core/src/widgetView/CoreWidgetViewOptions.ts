import type {WidgetConstructor} from '@type-editor/decoration';
import type {DecorationWidgetOptions, PmDecoration} from '@type-editor/editor-types';

/** Creates a ProseMirror widget decoration at the given position. */
export type WidgetDecoration = (pos: number, toDOM: WidgetConstructor, spec?: DecorationWidgetOptions) => PmDecoration;

/** The options/spec attached to a widget decoration. */
export type WidgetDecorationSpec = DecorationWidgetOptions;

/**
 * A convenience factory that creates a fully configured widget decoration
 * (including DOM construction) for a given position and optional spec.
 */
export type WidgetDecorationFactory = (pos: number, spec?: WidgetDecorationSpec) => PmDecoration;

/**
 * User-facing configuration for a core widget view.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CoreWidgetViewUserOptions<Component> {
    /** The root DOM element (or tag name) for the widget. */
    as: string | HTMLElement
    /** The framework component to render inside this widget view. */
    component: Component
}

/**
 * Internal specification object passed to the {@link CoreWidgetView} constructor.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CoreWidgetViewSpec<Component> {
    /** The document position of the widget. */
    pos: number
    /** Optional decoration options for the widget. */
    spec?: WidgetDecorationSpec
    /** User-supplied configuration. */
    options: CoreWidgetViewUserOptions<Component>
}
