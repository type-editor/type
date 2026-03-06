import type { Attrs, NodeRange } from '@type-editor/model';
import type { Command } from '@type-editor-compat/commands';
import type { NodeType } from '@type-editor-compat/model';
import type { Transaction } from '@type-editor-compat/state';

import { liftListItem as baseLiftListItem } from './list-commands/lift-list-item';
import { sinkListItem as baseSinkListItem } from './list-commands/sink-list-item';
import { splitListItem as baseSplitListItem } from './list-commands/split-list-item';
import { splitListItemKeepMarks as baseSplitListItemKeepMarks } from './list-commands/split-list-item-keep-marks';
import { wrapInList as baseWrapInList } from './list-commands/wrap-in-list';
import { wrapRangeInList as baseWrapRangeInList } from './list-commands/wrap-range-in-list';

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


export {bulletList, listItem, orderedList} from './schema-list';
export {addListNodes} from './util';
