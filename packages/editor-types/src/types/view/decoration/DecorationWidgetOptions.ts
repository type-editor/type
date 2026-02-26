import type {Mark} from '@type-editor/model';

export interface DecorationWidgetOptions {

    /**
     * Controls which side of the document position this widget is
     * associated with. When negative, it is drawn before a cursor
     * at its position, and content inserted at that position ends
     * up after the widget. When zero (the default) or positive, the
     * widget is drawn after the cursor and content inserted there
     * ends up before the widget.
     *
     * When there are multiple widgets at a given position, their
     * `side` values determine the order in which they appear. Those
     * with lower values appear first. The ordering of widgets with
     * the same `side` value is unspecified.
     *
     * When `marks` is null, `side` also determines the marks that
     * the widget is wrapped in—those of the node before when
     * negative, those of the node after when positive.
     */
    side?: number;

    /**
     * By default, the cursor, when at the position of the widget,
     * will be strictly kept on the side indicated by
     * [`side`](#view.Decoration^widget^spec.side). Set this to true
     * to allow the DOM selection to stay on the other side if the
     * client sets it there.
     *
     * **Note**: Mapping of this decoration, which decides on which
     * side insertions at its position appear, will still happen
     * according to `side`, and keyboard cursor motion will not,
     * without further custom handling, visit both sides of the
     * widget.
     */
    relaxedSide?: boolean;

    /**
     * The precise set of marks to draw around the widget.
     */
    marks?: ReadonlyArray<Mark>;

    /**
     * Can be used to control which DOM events, when they bubble out
     * of this widget, the editor view should ignore.
     *
     * Return `true` to indicate that ProseMirror should ignore the event,
     * preventing it from triggering editor behavior. Return `false` or
     * `undefined` to let ProseMirror handle the event normally.
     *
     * @param event - The DOM event that bubbled out of the widget
     * @returns `true` if the editor should ignore the event, `false` otherwise
     *
     * @example
     * ```typescript
     * stopEvent: (event) => {
     *   // Ignore all mousedown events in the widget
     *   return event.type === "mousedown";
     * }
     * ```
     */
    stopEvent?: (event: Event) => boolean;

    /**
     * When set (defaults to false), selection changes inside the
     * widget are ignored, and don't cause ProseMirror to try and
     * re-sync the selection with its selection state.
     */
    ignoreSelection?: boolean;

    /**
     * When comparing decorations of this type (in order to decide
     * whether it needs to be redrawn), ProseMirror will by default
     * compare the widget DOM node by identity. If you pass a key,
     * that key will be compared instead, which can be useful when
     * you generate decorations on the fly and don't want to store
     * and reuse DOM nodes. Make sure that any widgets with the same
     * key are interchangeable—if widgets differ in, for example,
     * the behavior of some event handler, they should get
     * different keys.
     */
    key?: string;

    /**
     * Called when the widget decoration is removed or the editor is
     * destroyed.
     *
     * Use this to clean up any resources, event listeners, or timers
     * associated with the widget to prevent memory leaks.
     *
     * @param node - The DOM node that was used for the widget
     *
     * @example
     * ```typescript
     * destroy: (node) => {
     *   // Clean up event listeners or other resources
     *   node.removeEventListener("click", handleClick);
     *   clearInterval(updateInterval);
     * }
     * ```
     */
    destroy?: (node: Node) => void;

    /**
     * Specs allow arbitrary additional properties.
     */
    [key: string]: unknown;
}
