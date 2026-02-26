/**
 * @type-editor-compat/schema
 *
 * Compatibility layer for @type-editor/schema.
 * Re-exports schema-basic and schema-list functionality with compat types.
 */

import type {Attrs, NodeRange} from '@type-editor/model';
import type {NodeType} from '@type-editor-compat/model';
import {
    liftListItem as baseLiftListItem,
    sinkListItem as baseSinkListItem,
    splitListItem as baseSplitListItem,
    splitListItemKeepMarks as baseSplitListItemKeepMarks,
    wrapInList as baseWrapInList,
    wrapRangeInList as baseWrapRangeInList,
} from '@type-editor/schema';
import type {Command, Transaction} from '@type-editor-compat/commands';

// Re-export everything else directly
export {
    addListNodes,
    bulletList,
    listItem,
    marks,
    nodes,
    orderedList,
    schema
} from '@type-editor/schema';

// Re-export non-command types
export * from '@type-editor/schema';

// ============================================================================
// List Command Factory Types - Concrete type signatures
// ============================================================================

/**
 * Type for liftListItem command factory with compat types.
 */
type LiftListItemFactory = (itemType: NodeType) => Command;

/**
 * Type for sinkListItem command factory with compat types.
 */
type SinkListItemFactory = (itemType: NodeType) => Command;

/**
 * Type for splitListItem command factory with compat types.
 */
type SplitListItemFactory = (itemType: NodeType, itemAttrs?: Attrs) => Command;

/**
 * Type for wrapInList command factory with compat types.
 */
type WrapInListFactory = (listType: NodeType, attrs?: Attrs | null) => Command;

/**
 * Type for wrapRangeInList function with compat types.
 * Note: This is not a command factory, but operates on Transaction directly.
 */
type WrapRangeInListFn = (
    transaction: Transaction | null,
    range: NodeRange,
    listType: NodeType,
    attrs?: Attrs | null
) => boolean;

// ============================================================================
// Re-exported List Commands with Compat Types
// ============================================================================

/**
 * Create a command to lift the list item around the selection up into a wrapping list.
 */
export const liftListItem: LiftListItemFactory = baseLiftListItem as unknown as LiftListItemFactory;

/**
 * Creates a command to sink (indent) the list item around the selection down into an inner nested list.
 */
export const sinkListItem: SinkListItemFactory = baseSinkListItem as unknown as SinkListItemFactory;

/**
 * Build a command that splits a list item at the current selection position.
 */
export const splitListItem: SplitListItemFactory = baseSplitListItem as unknown as SplitListItemFactory;

/**
 * Build a command that splits a list item, preserving marks on the new item.
 */
export const splitListItemKeepMarks: SplitListItemFactory = baseSplitListItemKeepMarks as unknown as SplitListItemFactory;

/**
 * Returns a command function that wraps the selection in a list with the given type and attributes.
 */
export const wrapInList: WrapInListFactory = baseWrapInList as unknown as WrapInListFactory;

/**
 * Attempts to wrap the given node range in a list of the specified type.
 */
export const wrapRangeInList: WrapRangeInListFn = baseWrapRangeInList as unknown as WrapRangeInListFn;

