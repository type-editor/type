/**
 * Helper utilities for creating a ProseMirror schema that supports tables.
 *
 * This module provides functions to generate node specifications for table-related
 * nodes (table, row, cell, header) and utilities for working with table node types.
 *
 * @module schema
 */

import type {AttributeSpec, Attrs, NodeSpec, NodeType, PmNode, Schema} from '@type-editor/model';

import type {CellAttrs} from './types/CellAttrs';
import type {MutableAttrs} from './types/MutableAttrs';

/**
 * Regular expression pattern to validate column width attribute format.
 * Matches comma-separated positive integers (e.g., "100,200,150").
 */
const COLWIDTH_PATTERN = /^\d+(,\d+)*$/;

/**
 * Parses the column width attribute from a DOM element.
 *
 * @param dom - The DOM element to extract the column width from.
 * @param colspan - The colspan value to validate against.
 * @returns An array of column widths, or null if invalid or not present.
 */
function parseColWidthAttribute(dom: HTMLElement, colspan: number): Array<number> | null {
    const widthAttr: string | null = dom.getAttribute('data-colwidth');

    if (!widthAttr || !COLWIDTH_PATTERN.test(widthAttr)) {
        return null;
    }

    const widths: Array<number> = widthAttr.split(',').map((s: string): number => Number(s));

    // Only return widths if the count matches the colspan
    return widths.length === colspan ? widths : null;
}

/**
 * Extracts cell attributes from a DOM element.
 *
 * This function is used during parsing to read table cell attributes from HTML.
 * It handles the standard colspan, rowspan, and colwidth attributes, as well as
 * any custom attributes defined in the schema options.
 *
 * @param dom - The DOM element to extract attributes from, or a string (tag name only).
 * @param extraAttrs - Additional custom attributes defined in the schema options.
 * @returns The extracted cell attributes object.
 */
function getCellAttrs(dom: HTMLElement | string, extraAttrs: Record<string, CellAttributes>): Attrs {
    // When called with just a tag name string, return empty attributes
    if (typeof dom === 'string') {
        return {};
    }

    const colspan = Number(dom.getAttribute('colspan') || 1);
    const rowspan = Number(dom.getAttribute('rowspan') || 1);
    const colwidth: Array<number> | null = parseColWidthAttribute(dom, colspan);

    const result: MutableAttrs = {
        colspan,
        rowspan,
        colwidth,
    } satisfies CellAttrs;

    // Extract custom attributes using their getFromDOM functions
    for (const prop in extraAttrs) {
        const getter: getFromDOM | undefined = extraAttrs[prop].getFromDOM;
        if (getter) {
            const value: unknown = getter(dom);
            if (value !== null) {
                result[prop] = value;
            }
        }
    }

    return result;
}

/**
 * Converts cell node attributes to DOM attributes for rendering.
 *
 * This function is used during serialization to write table cell attributes to HTML.
 * It only includes attributes that differ from their defaults (colspan=1, rowspan=1).
 *
 * @param node - The cell node to extract attributes from.
 * @param extraAttrs - Additional custom attributes defined in the schema options.
 * @returns An object containing the DOM attributes to set.
 */
function setCellAttrs(node: PmNode, extraAttrs: Record<string, CellAttributes>): Attrs {
    const attrs: MutableAttrs = {};

    // Only include colspan if not the default value
    if (node.attrs.colspan !== 1) {
        attrs.colspan = node.attrs.colspan;
    }

    // Only include rowspan if not the default value
    if (node.attrs.rowspan !== 1) {
        attrs.rowspan = node.attrs.rowspan;
    }

    // Serialize colwidth as comma-separated string
    if (node.attrs.colwidth) {
        attrs['data-colwidth'] = (node.attrs.colwidth as Array<number>).join(',');
    }

    // Apply custom attribute serializers
    for (const prop in extraAttrs) {
        const setter: setDOMAttr | undefined = extraAttrs[prop].setDOMAttr;
        if (setter) {
            setter(node.attrs[prop], attrs);
        }
    }

    return attrs;
}

/**
 * Function type for reading an attribute value from a DOM element.
 *
 * @param dom - The DOM element to read from.
 * @returns The extracted attribute value.
 */
export type getFromDOM = (dom: HTMLElement) => unknown;

/**
 * Function type for setting an attribute value on a DOM attributes object.
 *
 * @param value - The attribute value from the node.
 * @param attrs - The mutable attributes object to modify.
 */
export type setDOMAttr = (value: unknown, attrs: MutableAttrs) => void;

/**
 * Configuration for a custom cell attribute.
 *
 * Custom cell attributes allow extending table cells with additional
 * properties that are persisted in the document and serialized to HTML.
 */
export interface CellAttributes {
    /**
     * The attribute's default value.
     * This value is used when the attribute is not explicitly set.
     */
    default: unknown;

    /**
     * A function or type name used to validate values of this attribute.
     *
     * Can be a string like "number" or "string" for simple type validation,
     * or a function that throws an error if validation fails.
     *
     * @see {@link https://prosemirror.net/docs/ref/#model.AttributeSpec.validate|ProseMirror AttributeSpec.validate}
     */
    validate?: string | ((value: unknown) => void);

    /**
     * A function to read the attribute's value from a DOM element.
     *
     * Called during HTML parsing to extract the attribute value.
     * Should return the parsed value, or null if not present.
     */
    getFromDOM?: getFromDOM;

    /**
     * A function to add the attribute's value to a DOM attributes object.
     *
     * Called during HTML serialization to write the attribute.
     * Should modify the attrs object in place.
     */
    setDOMAttr?: setDOMAttr;
}

/**
 * Options for configuring table node specifications.
 */
export interface TableNodesOptions {
    /**
     * A group name to add to the table node type.
     *
     * This allows the table to be included in content expressions.
     * Common values include "block" to allow tables where block content is expected.
     *
     * @example "block"
     */
    tableGroup?: string;

    /**
     * The content expression for table cells.
     *
     * Defines what content is allowed inside table cells.
     *
     * @example "block+" - One or more block elements
     * @example "paragraph+" - One or more paragraphs
     */
    cellContent: string;

    /**
     * Additional custom attributes to add to cell nodes.
     *
     * Maps attribute names to their configuration objects.
     * These attributes will be available on both table_cell and table_header nodes.
     *
     * @example
     * ```typescript
     * {
     *   background: {
     *     default: null,
     *     getFromDOM: (dom) => dom.style.backgroundColor || null,
     *     setDOMAttr: (value, attrs) => { if (value) attrs.style = `background-color: ${value}`; }
     *   }
     * }
     * ```
     */
    cellAttributes: Record<string, CellAttributes>;
}

/**
 * Record type for the table node specifications.
 *
 * Contains node specs for all four table-related node types.
 */
export type TableNodes = Record<
    'table' | 'table_row' | 'table_cell' | 'table_header',
    NodeSpec
>;

/**
 * Validates that a colwidth value is either null or an array of numbers.
 *
 * @param value - The value to validate.
 * @throws {TypeError} If the value is not null or an array of numbers.
 */
function validateColWidth(value: unknown): void {
    if (value === null) {
        return;
    }

    if (!Array.isArray(value)) {
        throw new TypeError('colwidth must be null or an array');
    }

    for (const item of value) {
        if (typeof item !== 'number') {
            throw new TypeError('colwidth must be null or an array of numbers');
        }
    }
}

/**
 * Builds the cell attribute specifications from custom attributes configuration.
 *
 * @param extraAttrs - The custom cell attributes configuration.
 * @returns A record of attribute specifications for use in node specs.
 */
function buildCellAttributeSpecs(extraAttrs: Record<string, CellAttributes>): Record<string, AttributeSpec> {
    const cellAttrs: Record<string, AttributeSpec> = {
        colspan: {default: 1, validate: 'number'},
        rowspan: {default: 1, validate: 'number'},
        colwidth: {default: null, validate: validateColWidth},
    };

    for (const prop in extraAttrs) {
        cellAttrs[prop] = {
            default: extraAttrs[prop].default,
            validate: extraAttrs[prop].validate,
        };
    }

    return cellAttrs;
}

/**
 * Creates node specifications for table-related nodes.
 *
 * This function generates a set of {@link https://prosemirror.net/docs/ref/#model.NodeSpec|NodeSpec}
 * objects for `table`, `table_row`, `table_cell`, and `table_header` node types.
 * The result can be spread into your schema's nodes when creating a new schema.
 *
 * @param options - Configuration options for the table nodes.
 * @returns An object containing node specifications for all table-related nodes.
 *
 * @example
 * ```typescript
 * import { Schema } from 'prosemirror-model';
 * import { tableNodes } from './schema';
 *
 * const schema = new Schema({
 *   nodes: {
 *     doc: { content: 'block+' },
 *     paragraph: { group: 'block', content: 'text*' },
 *     text: {},
 *     ...tableNodes({
 *       tableGroup: 'block',
 *       cellContent: 'paragraph+',
 *       cellAttributes: {}
 *     })
 *   }
 * });
 * ```
 */
export function tableNodes(options: TableNodesOptions): TableNodes {
    const extraAttrs: Record<string, CellAttributes> = options.cellAttributes || {};
    const cellAttrs: Record<string, AttributeSpec> = buildCellAttributeSpecs(extraAttrs);

    return {
        table: {
            content: 'table_row+',
            tableRole: 'table',
            isolating: true,
            group: options.tableGroup,
            parseDOM: [{tag: 'table'}],
            toDOM() {
                return ['table', ['tbody', 0]];
            },
        },

        table_row: {
            content: '(table_cell | table_header)*',
            tableRole: 'row',
            parseDOM: [{tag: 'tr'}],
            toDOM() {
                return ['tr', 0];
            },
        },

        table_cell: {
            content: options.cellContent,
            attrs: cellAttrs,
            tableRole: 'cell',
            isolating: true,
            parseDOM: [
                {tag: 'td', getAttrs: (dom: HTMLElement): Attrs => getCellAttrs(dom, extraAttrs)},
            ],
            toDOM(node: PmNode) {
                return ['td', setCellAttrs(node, extraAttrs), 0];
            },
        },

        table_header: {
            content: options.cellContent,
            attrs: cellAttrs,
            tableRole: 'header_cell',
            isolating: true,
            parseDOM: [
                {tag: 'th', getAttrs: (dom: HTMLElement): Attrs => getCellAttrs(dom, extraAttrs)},
            ],
            toDOM(node: PmNode) {
                return ['th', setCellAttrs(node, extraAttrs), 0];
            },
        },
    };
}

/**
 * Identifies the role of a node within a table structure.
 *
 * - `'table'`: The root table node
 * - `'row'`: A table row node
 * - `'cell'`: A regular table cell (td)
 * - `'header_cell'`: A header table cell (th)
 */
export type TableRole = 'table' | 'row' | 'cell' | 'header_cell';

/**
 * Cache key for storing table node types on the schema.
 */
const TABLE_NODE_TYPES_CACHE_KEY = 'tableNodeTypes';

/**
 * Retrieves the table-related node types from a schema.
 *
 * This function returns a mapping from table roles to their corresponding
 * NodeType objects. Results are cached on the schema for performance.
 *
 * @param schema - The ProseMirror schema to extract node types from.
 * @returns A record mapping table roles to their NodeType objects.
 *
 * @example
 * ```typescript
 * const types = tableNodeTypes(schema);
 * const cellType = types.cell;
 * const headerType = types.header_cell;
 * ```
 */
export function tableNodeTypes(schema: Schema): Record<TableRole, NodeType> {
    let result: Record<TableRole, NodeType> = schema.cached[TABLE_NODE_TYPES_CACHE_KEY] as Record<TableRole, NodeType>;

    if (!result) {
        result = {} as Record<TableRole, NodeType>;

        for (const name in schema.nodes) {
            const type: NodeType = schema.nodes[name];
            const role: TableRole | undefined = type.spec.tableRole as TableRole | undefined;

            if (role) {
                result[role] = type;
            }
        }

        schema.cached[TABLE_NODE_TYPES_CACHE_KEY] = result;
    }

    return result;
}
