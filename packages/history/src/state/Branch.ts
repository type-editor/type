import {isUndefinedOrNull} from '@type-editor/commons';
import type {
    PmEditorState,
    PmMapping,
    PmStep,
    PmStepMap, PmTransaction,
    SelectionBookmark,
    TransformDocument,
} from '@type-editor/editor-types';
import type { Transaction } from '@type-editor/state';
import {Mapping, type StepMap} from '@type-editor/transform';

import type {HistoryEventState} from '../types/HistoryEventState';
import type {HistoryOptions} from '../types/HistoryOptions';
import type {RopeSequence} from '../types/RopeSequence';
import {createRopeSequence, EMPTY_ROPESEQUENCE} from './create-rope-sequence';


/**
 * Represents a single item in the history branch.
 *
 * An item can contain a step (an actual change), a position map (for tracking position changes),
 * and optionally a selection bookmark (marking the start of an event).
 */
export class Item {

    private readonly _map: PmStepMap;
    private readonly _step?: PmStep;
    private readonly _selection?: SelectionBookmark;
    private readonly _mirrorOffset?: number;

    /**
     * Creates a new history item.
     * @param map - The (forward) step map for this item
     * @param step - The inverted step (optional)
     * @param selection - If non-null, this item is the start of a group, and this selection
     *                   is the starting selection for the group (the one that was active before
     *                   the first step was applied)
     * @param mirrorOffset - If this item is the inverse of a previous mapping on the stack,
     *                      this points at the inverse's offset
     */
    constructor(map: PmStepMap,
                step?: PmStep,
                selection?: SelectionBookmark,
                mirrorOffset?: number) {
        this._map = map;
        this._step = step;
        this._selection = selection;
        this._mirrorOffset = mirrorOffset;
    }

    /**
     * Gets the position map for this item.
     */
    get map(): StepMap {
        return this._map as StepMap;
    }

    /**
     * Gets the step (change) for this item, if any.
     */
    get step(): PmStep | undefined {
        return this._step;
    }

    /**
     * Gets the selection bookmark for this item, if any.
     */
    get selection(): SelectionBookmark | undefined {
        return this._selection;
    }

    /**
     * Gets the mirror offset for this item, if any.
     */
    get mirrorOffset(): number | undefined {
        return this._mirrorOffset;
    }

    /**
     * Attempts to merge this item with another item.
     *
     * Two items can be merged if both have steps, and the other item doesn't mark
     * the start of a new event (no selection).
     *
     * @param other - The item to merge with
     * @returns A new merged item, or undefined if merging is not possible
     */
    public merge(other: Item): Item | undefined {
        if (this._step && other._step && !other._selection) {
            const mergedStep: PmStep = other._step.merge(this._step);
            if (mergedStep) {
                return new Item((mergedStep.getMap() as PmStepMap).invert(), mergedStep, this._selection);
            }
        }
    }
}

/**
 * Represents a branch in the history tree (either undo or redo history).
 *
 * A branch maintains a sequence of items that represent the history of changes,
 * where each item can contain a step (an actual change) and/or a position map
 * (for transforming positions through the change).
 */
export class Branch {

    public static readonly empty = new Branch(EMPTY_ROPESEQUENCE, 0);
    /** Maximum number of empty (map-only) items before compression is triggered */

    private static readonly MAX_EMPTY_ITEMS = 500;
    /** Threshold for removing old events when depth is exceeded */
    private static readonly DEPTH_OVERFLOW = 20;

    private readonly items: RopeSequence<Item>;
    private readonly _eventCount: number;

    /**
     * Creates a new branch.
     * @internal
     * @param items - The sequence of history items
     * @param eventCount - The number of events (groups of changes) in this branch
     */
    constructor(items: RopeSequence<Item>, eventCount: number) {
        this.items = items;
        this._eventCount = eventCount || 0;
    }

    /**
     * Gets the number of events in this branch.
     */
    get eventCount(): number {
        return this._eventCount;
    }

    /**
     * Pops the latest event off the branch's history and applies it to a document transform.
     *
     * This method retrieves the most recent history event, applies its steps in reverse
     * to the current state, and returns the modified state along with the remaining history.
     *
     * @param state - The current editor state
     * @param preserveItems - Whether to preserve items for rebasing (needed for collaboration)
     * @returns The history event state with remaining branch, transform, and selection, or null if no events exist
     */
    public popEvent(state: PmEditorState, preserveItems: boolean): HistoryEventState | null {
        if (this._eventCount === 0) {
            return null;
        }

        const end: number = this.findEventEnd();
        let remap: Mapping | undefined;
        let mapFrom: number | undefined;

        if (preserveItems) {
            remap = this.remapping(end, this.items.length);
            mapFrom = remap.maps.length;
        }

        const transform: PmTransaction = state.transaction;
        let selection: SelectionBookmark | undefined;
        let remaining: Branch | undefined;
        const addAfter: Array<Item> = [];
        const addBefore: Array<Item> = [];

        this.items.forEach((item: Item, i: number): boolean | undefined => {

            if (!item.step) {
                const result = this.handleMapOnlyItem(item, end, i, addBefore, remap, mapFrom);
                remap = result.remap;
                mapFrom = result.mapFrom;
                return;
            }

            if (remap) {
                const result = this.handleItemWithRemapping(item, transform, remap, mapFrom, addBefore, addAfter);
                remap = result.remap;
                mapFrom = result.mapFrom;
            } else {
                transform.maybeStep(item.step);
            }

            if (item.selection) {
                selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
                // Optimize: build addBefore in reverse order to avoid reversing later
                const rebasedItems: Array<Item> = addBefore.length > 0
                    ? [...addBefore].reverse().concat(addAfter)
                    : addAfter;
                remaining = new Branch(
                    this.items.slice(0, end).append(rebasedItems),
                    this._eventCount - 1
                );
                return false;
            }
        }, this.items.length, 0);

        // If we reach here without finding a selection, this indicates a corrupted history state
        // This should not happen if eventCount is accurate
        if (!remaining || !selection) {
            return null;
        }

        return {remaining, transform: transform as Transaction, selection};
    }

    /**
     * Creates a new branch with the given transform added to the history.
     *
     * This method processes all steps in the transform, inverts them for undo,
     * and attempts to merge consecutive items when possible to save memory.
     *
     * @param transform - The transform containing the steps to add
     * @param selection - The selection bookmark marking the start of a new event (optional)
     * @param histOptions - History configuration options (depth and delay)
     * @param preserveItems - Whether to preserve items exactly for rebasing
     * @returns A new branch with the transform added
     */
    public addTransform(transform: TransformDocument,
                        selection: SelectionBookmark | undefined,
                        histOptions: Required<HistoryOptions>,
                        preserveItems: boolean): Branch {
        const newItems: Array<Item> = [];
        let eventCount: number = this._eventCount;
        let oldItems: RopeSequence<Item> = this.items;
        let lastItem: Item | null = this.getLastItemForMerging(preserveItems, oldItems);

        for (let i = 0; i < transform.steps.length; i++) {
            const invertedStep: PmStep = transform.steps[i].invert(transform.docs[i]);
            let item: Item = new Item(transform.mapping.maps[i], invertedStep, selection);

            const merged: Item = lastItem?.merge(item);
            if (merged) {
                item = merged;
                if (i > 0) {
                    newItems.pop();
                } else {
                    oldItems = oldItems.slice(0, oldItems.length - 1);
                }
            }

            newItems.push(item);
            if (selection) {
                eventCount++;
                selection = undefined;
            }
            if (!preserveItems) {
                lastItem = item;
            }
        }

        const overflow: number = eventCount - histOptions.depth;
        if (overflow > Branch.DEPTH_OVERFLOW) {
            oldItems = this.cutOffEvents(oldItems, overflow);
            eventCount -= overflow;
        }

        return new Branch(oldItems.append(newItems), eventCount);
    }

    /**
     * Adds position maps to the branch without associated steps.
     *
     * This is used when changes occur that don't need to be undoable
     * but still need to be tracked for position mapping.
     *
     * @param maps - Array of step maps to add
     * @returns A new branch with the maps added, or this branch if it has no events
     */
    public addMaps(maps: ReadonlyArray<PmStepMap>): Branch {
        if (this._eventCount === 0) {
            return this;
        }
        const newItems: RopeSequence<Item> = this.items.append(maps.map((map) => new Item(map)));
        return new Branch(newItems, this._eventCount);
    }

    /**
     * Adjusts the branch when remote changes are rebased in collaborative editing.
     *
     * When the collaboration module receives remote changes, the history needs to adjust
     * the steps that were rebased on top of those changes and include position maps
     * for the remote changes in its array of items.
     *
     * @param rebasedTransform - The transform containing the rebased changes
     * @param rebasedCount - The number of steps that were rebased
     * @returns A new branch with the rebased adjustments applied
     */
    public rebased(rebasedTransform: TransformDocument, rebasedCount: number): Branch {
        if (!this._eventCount) {
            return this;
        }

        const rebasedItems: Array<Item> = [];
        const start: number = Math.max(0, this.items.length - rebasedCount);
        const mapping: PmMapping = rebasedTransform.mapping;
        let newUntil: number = rebasedTransform.steps.length;
        let eventCount: number = this._eventCount;

        // Count events in the range that will be rebased
        this.items.forEach((item: Item): undefined => {
            if (item.selection) {
                eventCount--;
            }
        }, start);

        let rebasedIndex: number = rebasedCount;
        this.items.forEach((item: Item): undefined => {
            const mirrorPosition: number | undefined = mapping.getMirror(--rebasedIndex);
            if (isUndefinedOrNull(mirrorPosition)) {
                return;
            }
            newUntil = Math.min(newUntil, mirrorPosition);

            const map: PmStepMap = mapping.maps[mirrorPosition];
            if (item.step) {
                const step: PmStep = rebasedTransform.steps[mirrorPosition].invert(rebasedTransform.docs[mirrorPosition]);
                const selection: SelectionBookmark = item.selection?.map(mapping.slice(rebasedIndex + 1, mirrorPosition));
                if (selection) {
                    eventCount++;
                }
                rebasedItems.push(new Item(map, step, selection));
            } else {
                rebasedItems.push(new Item(map));
            }
        }, start);

        const newMaps: Array<Item> = [];
        for (let i = rebasedCount; i < newUntil; i++) {
            newMaps.push(new Item(mapping.maps[i]));
        }

        const items: RopeSequence<Item> = this.items.slice(0, start).append(newMaps).append(rebasedItems);
        let branch: Branch = new Branch(items, eventCount);

        if (branch.emptyItemCount() > Branch.MAX_EMPTY_ITEMS) {
            branch = branch.compress(this.items.length - rebasedItems.length);
        }
        return branch;
    }

    /**
     * Finds the end position of the most recent event in the history.
     * @returns The index marking the end of the event
     */
    private findEventEnd(): number {
        let end: number = this.items.length;
        while (end > 0) {
            const next: Item = this.items.get(end - 1);
            if (next.selection) {
                end--;
                break;
            }
            end--;
        }
        return end;
    }

    /**
     * Handles a map-only item (item without a step) during popEvent.
     * @returns Updated remap and mapFrom values
     */
    private handleMapOnlyItem(item: Item,
                              end: number,
                              index: number,
                              addBefore: Array<Item>,
                              remap: Mapping | undefined,
                              mapFrom: number | undefined): { remap: Mapping; mapFrom: number } {
        let currentRemap: Mapping = remap;
        let currentMapFrom: number = mapFrom;

        if (!currentRemap) {
            currentRemap = this.remapping(end, index + 1);
            currentMapFrom = currentRemap.maps.length;
        }

        addBefore.push(item);
        return {remap: currentRemap, mapFrom: currentMapFrom - 1};
    }

    /**
     * Handles an item with a step during popEvent when remapping is active.
     * @returns Updated remap and mapFrom values
     */
    private handleItemWithRemapping(item: Item,
                                    transform: PmTransaction,
                                    remap: Mapping,
                                    mapFrom: number | undefined,
                                    addBefore: Array<Item>,
                                    addAfter: Array<Item>): { remap: Mapping; mapFrom: number } {
        // mapFrom should always be defined when remap is provided
        if (mapFrom === undefined) {
            throw new Error('Invalid state: mapFrom must be defined when remapping is active');
        }

        addBefore.push(new Item(item.map));
        const step: PmStep = item.step ? item.step.map(remap.slice(mapFrom)) : undefined;
        let map: PmStepMap | undefined;

        if (step && transform.maybeStep(step).doc) {
            const mappingMaps: ReadonlyArray<PmStepMap> = transform.mapping.maps;
            map = mappingMaps[mappingMaps.length - 1];
            addAfter.push(new Item(map, undefined, undefined, addAfter.length + addBefore.length));
        }

        const newMapFrom: number = mapFrom - 1;

        if (map) {
            remap.appendMap(map, newMapFrom);
        }
        return {remap, mapFrom: newMapFrom};
    }

    /**
     * Gets the last item for potential merging, if merging is allowed.
     * @param preserveItems - Whether items should be preserved (prevents merging)
     * @param items - The current items sequence
     * @returns The last item or null if merging is not allowed
     */
    private getLastItemForMerging(preserveItems: boolean, items: RopeSequence<Item>): Item | null {
        return !preserveItems && items.length > 0 ? items.get(items.length - 1) : null;
    }

    /**
     * Compresses the branch by removing map-only items and merging steps where possible.
     *
     * During collaboration, map-only items naturally accumulate because each remote change
     * adds one. This method rewrites the history to remove this "air". The `upto` parameter
     * ensures that only items below a given level are compressed, because `rebased` relies
     * on a clean, untouched set of items to associate old items with rebased steps.
     *
     * @param upto - The index up to which items should be compressed (defaults to all items)
     * @returns A new compressed branch
     */
    private compress(upto: number = this.items.length): Branch {
        const remap: Mapping = this.remapping(0, upto);
        let mapFrom: number = remap.maps.length;
        const items: Array<Item> = [];
        let events = 0;

        this.items.forEach((item: Item, i: number): undefined => {
            if (i >= upto) {
                // Items beyond the compression point are kept as-is
                items.push(item);
                if (item.selection) {
                    events++;
                }
            } else if (item.step) {
                const step: PmStep = item.step.map(remap.slice(mapFrom));
                const map: PmStepMap | undefined = step?.getMap() as PmStepMap;
                mapFrom--;

                if (map) {
                    remap.appendMap(map, mapFrom);
                }

                if (step) {
                    const selection: SelectionBookmark = item.selection?.map(remap.slice(mapFrom));
                    if (selection) {
                        events++;
                    }
                    const newItem = new Item(map.invert(), step, selection);

                    if (items.length > 0) {
                        const lastIndex: number = items.length - 1;
                        const merged: Item = items[lastIndex].merge(newItem);
                        if (merged) {
                            items[lastIndex] = merged;
                        } else {
                            items.push(newItem);
                        }
                    } else {
                        items.push(newItem);
                    }
                }
            } else if (item.map) {
                mapFrom--;
            }
        }, this.items.length, 0);

        return new Branch(createRopeSequence(items.reverse()), events);
    }

    /**
     * Counts the number of map-only items (items without steps) in the branch.
     * @returns The count of empty items
     */
    private emptyItemCount(): number {
        let count = 0;
        this.items.forEach((item: Item): undefined => {
            if (!item.step) {
                count++;
            }
        });
        return count;
    }

    /**
     * Creates a mapping that represents the position transformations through a range of items.
     * @param from - The starting index (inclusive)
     * @param to - The ending index (exclusive)
     * @returns A mapping object containing the combined transformations
     */
    private remapping(from: number, to: number): Mapping {
        const maps = new Mapping();

        this.items.forEach((item: Item, i: number): undefined => {
            const mirrorPos: number = item.mirrorOffset !== null && i - item.mirrorOffset >= from
                ? maps.maps.length - item.mirrorOffset
                : undefined;

            maps.appendMap(item.map, mirrorPos);
        }, from, to);

        return maps;
    }

    /**
     * Removes the specified number of oldest events from the items sequence.
     * @param items - The items sequence to trim
     * @param count - The number of events to remove
     * @returns A new items sequence with the oldest events removed
     */
    private cutOffEvents(items: RopeSequence<Item>, count: number): RopeSequence<Item> {
        let cutPoint: number | undefined;
        let remainingCount: number = count;

        items.forEach((item: Item, i: number): boolean => {
            if (item.selection) {
                if (remainingCount === 0) {
                    cutPoint = i;
                    return false;
                }
                remainingCount--;
            }
        });

        // If cutPoint is undefined, it means we need to remove more events than exist
        // In this case, return an empty sequence
        return cutPoint !== undefined ? items.slice(cutPoint) : items.slice(items.length);
    }
}
