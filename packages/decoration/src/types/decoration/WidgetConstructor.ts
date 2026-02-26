import type {PmEditorView} from '@type-editor/editor-types';

/**
 * A function or DOM node used to construct a widget decoration.
 *
 * When a function, it will be called each time the widget needs to be
 * rendered, receiving:
 * - `view`: The editor view instance
 * - `getPos`: A function that returns the widget's current position in the
 *   document, or undefined if the widget is no longer in the document
 *
 * Using a function is recommended as it allows the widget to be recreated
 * when needed and provides access to the current editor state.
 *
 * Alternatively, you can pass a DOM node directly, but this is less flexible
 * as the node cannot be updated based on current state.
 *
 * @example
 * ```typescript
 * // Function constructor (recommended)
 * const widgetConstructor = (view: EditorView, getPos: () => number | undefined) => {
 *   const button = document.createElement("button");
 *   button.textContent = "Click me";
 *   button.onclick = () => {
 *     const pos = getPos();
 *     if (pos !== undefined) {
 *       // Do something with the position
 *     }
 *   };
 *   return button;
 * };
 *
 * // Direct DOM node (less flexible)
 * const node = document.createElement("span");
 * node.textContent = "Static widget";
 * ```
 */
export type WidgetConstructor = ((view?: PmEditorView, getPos?: () => number | undefined) => Node) | Node;
