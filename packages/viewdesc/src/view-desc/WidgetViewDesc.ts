import { ELEMENT_NODE } from '@type-editor/commons';
import type { WidgetConstructor, WidgetType } from '@type-editor/decoration';
import type {
    DecorationWidgetOptions,
    PmDecoration,
    PmEditorView,
    ViewMutationRecord
} from '@type-editor/editor-types';

import { ViewDesc } from './ViewDesc';
import { ViewDescType } from './ViewDescType';
import { ViewDirtyState } from './ViewDirtyState';


/**
 * A widget desc represents a widget decoration, which is a DOM node
 * drawn between the document nodes. Widgets are typically used for things like:
 * - Placeholders
 * - UI decorations (e.g., line numbers, breakpoints)
 * - Non-editable inline content
 *
 * Widgets are atomic and cannot contain children.
 */
export class WidgetViewDesc extends ViewDesc {

    private readonly _domAtom = true;
    private readonly _widget: PmDecoration;

    /**
     * Creates a new WidgetViewDesc.
     *
     * @param parent - The parent view description in the tree hierarchy
     * @param widget - The widget decoration to render
     * @param view - The editor view that owns this widget
     * @param pos - The document position where this widget appears
     */
    constructor(parent: ViewDesc,
                widget: PmDecoration,
                view: PmEditorView,
                pos: number) {
        super(parent, [], null, null);
        // Set dom node after calling super to avoid issues with
        // accessing 'this' before 'super'
        super.setDomNode(this.getDomNode(widget, view, pos));
        this._widget = widget;
    }

    get widget(): PmDecoration {
        return this._widget;
    }

    /**
     * Indicates that widgets are atomic DOM nodes that should be treated as single units.
     */
    get domAtom(): boolean {
        return this._domAtom;
    }

    /**
     * Indicates if this widget should be ignored for selection purposes.
     * Returns true if the widget has a relaxed side, allowing selections to pass through it.
     */
    get ignoreForSelection(): boolean {
        return !!this._widget.type.spec.relaxedSide;
    }

    /**
     * Gets the side value of this widget, which determines its position relative to content.
     * Negative values position the widget before content, positive values after.
     */
    get side(): number {
        return (this._widget.type as WidgetType).side;
    }

    /**
     * Checks if this widget matches the given decoration.
     * Widgets match if they're not dirty and have equivalent decoration types.
     *
     * @param widget - The widget decoration to check against
     * @returns True if this widget matches the given decoration
     */
    matchesWidget(widget: PmDecoration): boolean {
        return this._dirty === ViewDirtyState.NOT_DIRTY && widget.type.eq(this._widget.type);
    }

    /**
     * Returns a parse rule indicating that this widget should be ignored during parsing.
     * Widgets are not part of the document content and shouldn't be parsed.
     *
     * @returns A rule with ignore flag set to true
     */
    parseRule(): { ignore: boolean } {
        return {ignore: true};
    }

    /**
     * Delegates event handling to the widget's stopEvent handler if defined.
     *
     * @param event - The DOM event to check
     * @returns True if the event should be stopped, false otherwise
     */
    stopEvent(event: Event): boolean {
        const stop: (event: Event) => boolean = (this._widget.spec as DecorationWidgetOptions).stopEvent;
        return stop ? stop(event) : false;
    }

    /**
     * Determines if a mutation should be ignored for this widget.
     * Selection changes are ignored if the widget specifies ignoreSelection.
     * Other mutations are always ignored since widgets are atomic.
     *
     * @param mutation - The mutation or selection change to check
     * @returns True if the mutation should be ignored
     */
    ignoreMutation(mutation: ViewMutationRecord): boolean {
        return mutation.type !== 'selection' || (this._widget.spec as DecorationWidgetOptions).ignoreSelection;
    }

    /**
     * Cleans up this widget by calling its destroy handler and then calling parent cleanup.
     */
    destroy(): void {
        this._widget.type.destroy(this._dom);
        super.destroy();
    }

    getType(): ViewDescType {
        return ViewDescType.WIDGET;
    }

    /**
     * Creates the DOM node for the widget decoration.
     *
     * @param widget - The widget decoration
     * @param view - The editor view
     * @param pos - The document position
     * @returns The created DOM node
     */
    private getDomNode(widget: PmDecoration, view: PmEditorView, pos: number): Node {
        let self: WidgetViewDesc;
        let dom: WidgetConstructor = (widget.type as WidgetType).toDOM;

        // If toDOM is a function, call it with a getPos callback
        if (typeof dom === 'function') {
            dom = dom(view, (): number => {
                // Lazy position calculation - if called during construction, use provided pos
                if (!self) {
                    return pos;
                }
                // After construction, calculate position from parent
                if (self.parent) {
                    return self.parent.posBeforeChild(self);
                }
            });
        }

        // Unless marked as 'raw', wrap and mark the widget appropriately
        if (!widget.type.spec.raw) {
            // Text nodes and other non-element nodes need to be wrapped in a span
            if (dom.nodeType !== ELEMENT_NODE) {
                const wrap: HTMLSpanElement = document.createElement('span');
                wrap.appendChild(dom);
                dom = wrap;
            }

            // Mark widget as non-editable and add identifying class
            (dom as HTMLElement).contentEditable = 'false';
            (dom as HTMLElement).classList.add('ProseMirror-widget');
        }

        return dom;
    }
}
