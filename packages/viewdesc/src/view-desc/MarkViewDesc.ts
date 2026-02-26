import type {MarkView, MarkViewConstructor, PmEditorView, ViewMutationRecord} from '@type-editor/editor-types';
import {DOMSerializer, type Mark} from '@type-editor/model';

import {replaceNodes} from './util/replace-nodes';
import {ViewDesc} from './ViewDesc';
import {ViewDescType} from './ViewDescType';
import {ViewDirtyState} from './ViewDirtyState';


/**
 * A mark desc represents a mark. May have multiple children,
 * depending on how the mark is split. Note that marks are drawn using
 * a fixed nesting order, for simplicity and predictability, so in
 * some cases they will be split more often than would appear
 * necessary.
 *
 * Marks wrap inline content to apply styling or semantic meaning (e.g., bold, italic, links).
 * A mark view desc can contain both text nodes and other mark view descs (for nested marks).
 */
export class MarkViewDesc extends ViewDesc {

    private readonly mark: Mark;
    private readonly spec: MarkView;

    /**
     * Creates a new MarkViewDesc.
     *
     * @param parent - The parent view description
     * @param mark - The ProseMirror mark this represents
     * @param dom - The outer DOM element for this mark
     * @param contentDOM - The DOM element that holds the mark's content
     * @param spec - The mark view specification (may include custom handlers)
     */
    constructor(parent: ViewDesc,
                mark: Mark,
                dom: Node,
                contentDOM: HTMLElement,
                spec: MarkView) {
        super(parent, [], dom, contentDOM);
        this.mark = mark;
        this.spec = spec;
    }

    /**
     * Creates a mark view description, using custom mark views if available.
     *
     * @param parent - The parent view description
     * @param mark - The mark to create a view for
     * @param inline - Whether the mark is in inline content
     * @param view - The editor view
     * @returns A new MarkViewDesc instance
     */
    public static create(parent: ViewDesc, mark: Mark, inline: boolean, view: PmEditorView): MarkViewDesc {
        const custom: MarkViewConstructor = view.nodeViews[mark.type.name] as MarkViewConstructor;

        let spec: { dom: HTMLElement, contentDOM?: HTMLElement; } | undefined;

        if (custom && typeof custom === 'function') {
            spec = custom(mark, view, inline) as { dom: HTMLElement, contentDOM?: HTMLElement; };
        }

    if (!spec?.dom) {
        spec = DOMSerializer.renderSpec(document, mark.type.spec.toDOM(mark, inline), null) as {
            dom: HTMLElement,
            contentDOM?: HTMLElement;
        };
    }

        return new MarkViewDesc(parent, mark, spec.dom, spec.contentDOM || spec.dom, spec);
    }

    /**
     * Returns a parse rule for this mark, or null if it should be reparsed.
     *
     * @returns Parse rule with mark info, or null if dirty or needs reparsing
     */
    parseRule() {
        if ((this._dirty & ViewDirtyState.NODE_DIRTY) || this.mark.type.spec.reparseInView) {
            return null;
        }

        return {
            mark: this.mark.type.name,
            attrs: this.mark.attrs,
            contentElement: this._contentDOM
        };
    }

    /**
     * Checks if this mark view matches a given mark.
     *
     * @param mark - The mark to check against
     * @returns True if not dirty and marks are equal
     */
    matchesMark(mark: Mark): boolean {
        return this._dirty !== ViewDirtyState.NODE_DIRTY && this.mark.eq(mark);
    }

    /**
     * Marks a range as dirty and propagates to parent node view.
     * Mark views don't maintain their own dirty state - it's moved to the nearest node view.
     *
     * @param from - Start position of the dirty range
     * @param to - End position of the dirty range
     */
    markDirty(from: number, to: number): void {
        super.markDirty(from, to);

        // Move dirty info to nearest node view
        if (this._dirty !== ViewDirtyState.NOT_DIRTY) {
            let parent: ViewDesc = this._parent;
            while (!parent.node) {
                parent = parent.parent;
            }

            if (parent.dirty < this._dirty) {
                parent.dirty = this._dirty;
            }
            this._dirty = ViewDirtyState.NOT_DIRTY;
        }
    }

    /**
     * Creates a sliced copy of this mark view with a subset of its children.
     *
     * @param from - Start position of the slice
     * @param to - End position of the slice
     * @param view - The editor view
     * @returns A new MarkViewDesc with sliced children
     */
    public slice(from: number,
                 to: number,
                 view: PmEditorView): MarkViewDesc {
        const copy: MarkViewDesc = MarkViewDesc.create(this._parent, this.mark, true, view);
        let nodes: Array<ViewDesc> = this._children;
        const size: number = this.size;

        if (to < size) {
            nodes = replaceNodes(nodes, to, size, view);
        }

        if (from > 0) {
            nodes = replaceNodes(nodes, 0, from, view);
        }

        for (const item of nodes) {
            item.parent = copy;
        }

        copy.children = nodes;
        return copy;
    }

    /**
     * Delegates mutation handling to custom spec if available, otherwise uses default behavior.
     *
     * @param mutation - The mutation to check
     * @returns True if the mutation should be ignored
     */
    ignoreMutation(mutation: ViewMutationRecord): boolean {
        return this.spec.ignoreMutation ? this.spec.ignoreMutation(mutation) : super.ignoreMutation(mutation);
    }

    /**
     * Cleans up this mark view by calling custom destroy handler if defined.
     */
    destroy(): void {
        if (this.spec.destroy) {
            this.spec.destroy();
        }
        super.destroy();
    }

    getType(): ViewDescType {
        return ViewDescType.MARK;
    }
}
