/**
 * A ViewMutationRecord represents a DOM
 * [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
 * or a selection change happens within the view. When the change is
 * a selection change, the record will have a `type` property of
 * `'selection'` (which doesn't occur for native mutation records).
 */
export type ViewMutationRecord = MutationRecord | { type: 'selection', target: Node; };
