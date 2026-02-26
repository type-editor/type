import type {NodeView, ViewMutationRecord} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import {updateColumnsOnResize} from './update-columns-on-resize';


/**
 * Custom NodeView implementation for rendering table nodes with column resizing support.
 *
 * This view creates a wrapper `<div>` containing a `<table>` element with a `<colgroup>`
 * for column width management and a `<tbody>` for the actual table content. The column
 * widths are synchronized with the document's column width attributes.
 *
 * @example
 * ```typescript
 * const tableView = new TableView(tableNode, 100);
 * // tableView.dom returns the wrapper div
 * // tableView.contentDOM returns the tbody where content is rendered
 * ```
 */
export class TableView implements NodeView {

    /**
     * CSS custom property name for the default minimum cell width.
     */
    private static readonly CSS_DEFAULT_CELL_MIN_WIDTH = '--default-cell-min-width';

    /**
     * The outer wrapper element containing the table.
     */
    private readonly _dom: HTMLDivElement;

    /**
     * The table element itself.
     */
    private readonly table: HTMLTableElement;

    /**
     * The colgroup element that manages column widths.
     */
    private readonly colgroup: HTMLTableColElement;

    /**
     * The tbody element where ProseMirror renders the table content.
     */
    private readonly _contentDOM: HTMLTableSectionElement;

    /**
     * The default minimum width for cells without explicit widths.
     */
    private readonly defaultCellMinWidth: number;

    /**
     * The current table node being rendered.
     */
    private node: PmNode;

    /**
     * Creates a new TableView instance.
     *
     * @param node - The table node to render.
     * @param defaultCellMinWidth - The default minimum width in pixels for cells without explicit widths.
     */
    constructor(node: PmNode, defaultCellMinWidth: number) {
        this.node = node;
        this.defaultCellMinWidth = defaultCellMinWidth;

        this._dom = this.createWrapperElement();
        this.table = this.createTableElement(defaultCellMinWidth);
        this.colgroup = this.table.appendChild(document.createElement('colgroup'));
        this._contentDOM = this.table.appendChild(document.createElement('tbody'));

        updateColumnsOnResize(node, this.colgroup, this.table, defaultCellMinWidth);
    }

    /**
     * The outer DOM element for this node view.
     * ProseMirror uses this as the root element for the table.
     */
    get dom(): HTMLDivElement {
        return this._dom;
    }

    /**
     * The DOM element where ProseMirror should render the node's content.
     * For tables, this is the tbody element.
     */
    get contentDOM(): HTMLTableSectionElement {
        return this._contentDOM;
    }

    /**
     * Updates the view when the underlying node changes.
     *
     * @param node - The new table node to render.
     * @returns `true` if the update was handled, `false` if the view should be recreated.
     */
    public update(node: PmNode): boolean {
        if (node.type !== this.node.type) {
            return false;
        }

        this.node = node;
        updateColumnsOnResize(
            node,
            this.colgroup,
            this.table,
            this.defaultCellMinWidth,
        );
        return true;
    }

    /**
     * Determines whether a DOM mutation should be ignored by ProseMirror.
     *
     * Attribute mutations on the table or colgroup elements are ignored because
     * these are managed by the column resizing logic, not by document changes.
     *
     * @param record - The mutation record to evaluate.
     * @returns `true` if the mutation should be ignored, `false` otherwise.
     */
    public ignoreMutation(record: ViewMutationRecord): boolean {
        const isAttributeMutation = record.type === 'attributes';
        const isTableOrColgroupTarget = record.target === this.table
            || this.colgroup.contains(record.target);

        return isAttributeMutation && isTableOrColgroupTarget;
    }

    /**
     * Creates the wrapper div element for the table.
     */
    private createWrapperElement(): HTMLDivElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'tableWrapper';
        return wrapper;
    }

    /**
     * Creates and configures the table element.
     *
     * @param defaultCellMinWidth - The default minimum cell width to set as a CSS custom property.
     */
    private createTableElement(defaultCellMinWidth: number): HTMLTableElement {
        const table: HTMLTableElement = this._dom.appendChild(document.createElement('table'));
        table.style.setProperty(TableView.CSS_DEFAULT_CELL_MIN_WIDTH, `${defaultCellMinWidth}px`);
        return table;
    }
}
