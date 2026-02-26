import type {DOMParser, PmNode} from '@type-editor/model';
import {DOMSerializer, type ResolvedPos, type Slice} from '@type-editor/model';

import type {PmEditorState, PmSelection, PmTransaction} from '../../state';
import type {DecorationSource} from '../decoration/DecorationSource';
import type {PmEditorView} from '../PmEditorView';
import type {MarkViewConstructor} from '../view-desc/MarkViewConstructor';
import type {NodeViewConstructor} from '../view-desc/NodeViewConstructor';
import type {DOMEventMap} from './DOMEventMap';


/**
 * Props are configuration values that can be passed to an editor view
 * or included in a plugin. This interface lists the supported props.
 *
 * The various event-handling functions may all return `true` to
 * indicate that they handled the given event. The view will then take
 * care to call `preventDefault` on the event, except with
 * `handleDOMEvents`, where the handler itself is responsible for that.
 *
 * How a prop is resolved depends on the prop. Handler functions are
 * called one at a time, starting with the base props and then
 * searching through the plugins (in order of appearance) until one of
 * them returns true. For some props, the first plugin that yields a
 * value gets precedence.
 *
 * The optional type parameter refers to the type of `this` in prop
 * functions, and is used to pass in the plugin type when defining a
 * [plugin](#state.Plugin).
 */
export interface EditorProps<P = any> {
    /**
     * Can be an object mapping DOM event type names to functions that
     * handle them. Such functions will be called before any handling
     * ProseMirror does of events fired on the editable DOM element.
     * Contrary to the other event handling props, when returning true
     * from such a function, you are responsible for calling
     * `preventDefault` yourself (or not, if you want to allow the
     * default behavior).
     */
    handleDOMEvents?: {
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        [event in keyof DOMEventMap]?: (this: P, view: PmEditorView, event: DOMEventMap[event]) => boolean | void
    };

    /**
     * Called when the editor receives a `keydown` event.
     */
    handleKeyDown?: (this: P, view: PmEditorView, event: KeyboardEvent) => boolean;

    /**
     * Handler for `keypress` events.
     */
    handleKeyPress?: (this: P, view: PmEditorView, event: KeyboardEvent) => boolean;

    /**
     * Whenever the user directly input text, this handler is called
     * before the input is applied. If it returns `true`, the default
     * behavior of actually inserting the text is suppressed.
     */
    handleTextInput?: (this: P, view: PmEditorView, from: number, to: number, text: string, deflt: () => PmTransaction) => boolean;

    /**
     * Called for each node around a click, from the inside out. The
     * `direct` flag will be true for the inner node.
     */
    handleClickOn?: (this: P, view: PmEditorView, pos: number, node: PmNode, nodePos: number, event: MouseEvent, direct: boolean) => boolean;

    /**
     * Called when the editor is clicked, after `handleClickOn` handlers
     * have been called.
     */
    handleClick?: (this: P, view: PmEditorView, pos: number, event: MouseEvent) => boolean;

    /**
     * Called for each node around a double click.
     */
    handleDoubleClickOn?: (this: P, view: PmEditorView, pos: number, node: PmNode, nodePos: number, event: MouseEvent, direct: boolean) => boolean;

    /**
     * Called when the editor is double-clicked, after `handleDoubleClickOn`.
     */
    handleDoubleClick?: (this: P, view: PmEditorView, pos: number, event: MouseEvent) => boolean;

    /**
     * Called for each node around a triple click.
     */
    handleTripleClickOn?: (this: P, view: PmEditorView, pos: number, node: PmNode, nodePos: number, event: MouseEvent, direct: boolean) => boolean;

    /**
     * Called when the editor is triple-clicked, after `handleTripleClickOn`.
     */
    handleTripleClick?: (this: P, view: PmEditorView, pos: number, event: MouseEvent) => boolean;

    /**
     * Can be used to override the behavior of pasting. `slice` is the
     * pasted content parsed by the editor, but you can directly access
     * the event to get at the raw content.
     */
    handlePaste?: (this: P, view: PmEditorView, event: ClipboardEvent, slice: Slice) => boolean;

    /**
     * Called when something is dropped on the editor. `moved` will be
     * true if this drop moves from the current selection (which should
     * thus be deleted).
     */
    handleDrop?: (this: P, view: PmEditorView, event: DragEvent, slice: Slice, moved: boolean, data: Map<string, any>) => boolean;

    /**
     * Called when drop operation successfully completed.
     */
    handleDropFinished?: (this: P, view: PmEditorView, event: DragEvent, slice: Slice, moved: boolean, insertPosition: number, transaction: PmTransaction, data: Map<string, any>) => boolean;


    /**
     * Called when the view, after updating its state, tries to scroll
     * the selection into view. A handler function may return false to
     * indicate that it did not handle the scrolling and further
     * handlers or the default behavior should be tried.
     */
    handleScrollToSelection?: (this: P, view: PmEditorView) => boolean;

    /**
     * Determines whether an in-editor drag event should copy or move
     * the selection. When not given, the event's `altKey` property is
     * used on macOS, `ctrlKey` on other platforms.
     */
    dragCopies?: (event: DragEvent) => boolean;

    /**
     * Can be used to override the way a selection is created when
     * reading a DOM selection between the given anchor and head.
     */
    createSelectionBetween?: (this: P, view: PmEditorView, anchor: ResolvedPos, head: ResolvedPos) => PmSelection | null;

    /**
     * The [parser](#model.DOMParser) to use when reading editor changes
     * from the DOM. Defaults to calling
     * [`DOMParser.fromSchema`](#model.DOMParser^fromSchema) on the
     * editor's schema.
     */
    domParser?: DOMParser;

    /**
     * Can be used to transform pasted HTML text, _before_ it is parsed,
     * for example to clean it up.
     */
    transformPastedHTML?: (this: P, html: string, view: PmEditorView) => string;

    /**
     * The [parser](#model.DOMParser) to use when reading content from
     * the clipboard. When not given, the value of the
     * [`domParser`](#view.EditorProps.domParser) prop is used.
     */
    clipboardParser?: DOMParser;

    /**
     * Transform pasted plain text. The `plain` flag will be true when
     * the text is pasted as plain text.
     */
    transformPastedText?: (this: P, text: string, plain: boolean, view: PmEditorView) => string;

    /**
     * A function to parse text from the clipboard into a document
     * slice. Called after
     * [`transformPastedText`](#view.EditorProps.transformPastedText).
     * The default behavior is to split the text into lines, wrap them
     * in `<p>` tags, and call
     * [`clipboardParser`](#view.EditorProps.clipboardParser) on it.
     * The `plain` flag will be true when the text is pasted as plain text.
     */
    clipboardTextParser?: (this: P, text: string, $context: ResolvedPos, plain: boolean, view: PmEditorView) => Slice;

    /**
     * Can be used to transform pasted or dragged-and-dropped content
     * before it is applied to the document. The `plain` flag will be
     * true when the text is pasted as plain text.
     */
    transformPasted?: (this: P, slice: Slice, view: PmEditorView, plain: boolean) => Slice;

    /**
     * Can be used to transform copied or cut content before it is
     * serialized to the clipboard.
     */
    transformCopied?: (this: P, slice: Slice, view: PmEditorView) => Slice;

    /**
     * Allows you to pass custom rendering and behavior logic for
     * nodes. Should map node names to constructor functions that
     * produce a [`NodeView`](#view.NodeView) object implementing the
     * node's display behavior. The third argument `getPos` is a
     * function that can be called to get the node's current position,
     * which can be useful when creating transactions to update it.
     * Note that if the node is not in the document, the position
     * returned by this function will be `undefined`.
     *
     * `decorations` is an array of node or inline decorations that are
     * active around the node. They are automatically drawn in the
     * normal way, and you will usually just want to ignore this, but
     * they can also be used as a way to provide context information to
     * the node view without adding it to the document itself.
     *
     * `innerDecorations` holds the decorations for the node's content.
     * You can safely ignore this if your view has no content or a
     * `contentDOM` property, since the editor will draw the decorations
     * on the content. But if you, for example, want to create a nested
     * editor with the content, it may make sense to provide it with the
     * inner decorations.
     *
     * (For backwards compatibility reasons, [mark
     * views](#view.EditorProps.markViews) can also be included in this
     * object.)
     */
    nodeViews?: Record<string, NodeViewConstructor>;

    /**
     * Pass custom mark rendering functions. Note that these cannot
     * provide the kind of dynamic behavior that [node
     * views](#view.NodeView) can—they just provide custom rendering
     * logic. The third argument indicates whether the mark's content
     * is inline.
     */
    markViews?: Record<string, MarkViewConstructor>;

    /**
     * The DOM serializer to use when putting content onto the
     * clipboard. If not given, the result of
     * [`DOMSerializer.fromSchema`](#model.DOMSerializer^fromSchema)
     * will be used. This object will only have its
     * [`serializeFragment`](#model.DOMSerializer.serializeFragment)
     * method called, and you may provide an alternative object type
     * implementing a compatible method.
     */
    clipboardSerializer?: DOMSerializer;

    /**
     * A function that will be called to get the text for the current
     * selection when copying text to the clipboard. By default, the
     * editor will use [`textBetween`](#model.Node.textBetween) on the
     * selected range.
     */
    clipboardTextSerializer?: (this: P, content: Slice, view: PmEditorView) => string;

    /**
     * A set of [document decorations](#view.Decoration) to show in the
     * view.
     */
    decorations?: (this: P, state: PmEditorState) => DecorationSource | null | undefined;

    /**
     * When this returns false, the content of the view is not directly
     * editable.
     */
    editable?: (this: P, state: PmEditorState) => boolean;

    /**
     * Control the DOM attributes of the editable element. May be either
     * an object or a function going from an editor state to an object.
     * By default, the element will get a class `'ProseMirror'`, and
     * will have its `contentEditable` attribute determined by the
     * [`editable` prop](#view.EditorProps.editable). Additional classes
     * provided here will be added to the class. For other attributes,
     * the value provided first (as in
     * [`someProp`](#view.EditorView.someProp)) will be used.
     */
    attributes?: Record<string, string> | ((state: PmEditorState) => Record<string, string>);

    /**
     * Determines the distance (in pixels) between the cursor and the
     * end of the visible viewport at which point, when scrolling the
     * cursor into view, scrolling takes place. Defaults to 0.
     */
    scrollThreshold?: number | { top: number, right: number, bottom: number, left: number; };

    /**
     * Determines the extra space (in pixels) that is left above or
     * below the cursor when it is scrolled into view. Defaults to 5.
     */
    scrollMargin?: number | { top: number, right: number, bottom: number, left: number; };
}
