import type {Mark, PmNode, TagParseRule} from '@type-editor/model';

import {ViewDescType} from '../../../view/ViewDescType';
import type {ViewDirtyState} from '../../../view/ViewDirtyState';
import type {DecorationSource} from '../decoration/DecorationSource';
import type {PmDecoration} from '../decoration/PmDecoration';
import type {PmEditorView} from '../PmEditorView';
import type {ViewMutationRecord} from './ViewMutationRecord';


export interface PmViewDesc {
    dirty: ViewDirtyState;
    readonly node: PmNode;
    parent: PmViewDesc;
    children: Array<PmViewDesc>;
    readonly dom: Node;
    readonly contentDOM: HTMLElement;
    readonly domAtom: boolean;
    readonly ignoreForCoords: boolean;
    readonly ignoreForSelection: boolean;
    readonly contentLost: boolean;
    readonly posBefore: number;
    readonly posAtStart: number;
    readonly posAfter: number;
    readonly posAtEnd: number;
    readonly size: number;
    readonly border: number;
    readonly side: number;
    readonly nodeDOM: Node | null

    getType(): ViewDescType;

    /**
     * Checks if this description matches a given widget decoration.
     *
     * @param _widget - The widget decoration to check against
     * @returns True if this description represents the given widget
     */
    matchesWidget(_widget: PmDecoration): boolean;

    /**
     * Checks if this description matches a given mark.
     *
     * @param _mark - The mark to check against
     * @returns True if this description represents the given mark
     */
    matchesMark(_mark: Mark): boolean;

    /**
     * Checks if this description matches a given node with decorations.
     *
     * @param _node - The node to check against
     * @param _outerDeco - The outer decorations to check
     * @param _innerDeco - The inner decoration source to check
     * @returns True if this description represents the given node with matching decorations
     */
    matchesNode(_node: PmNode, _outerDeco: ReadonlyArray<PmDecoration>, _innerDeco: DecorationSource): boolean;

    /**
     * Checks if this description matches a hack node with a specific name.
     *
     * @param _nodeName - The node name to check against
     * @returns True if this is a hack node with the given name
     */
    matchesHack(_nodeName: string): boolean;

    /**
     * When parsing in-editor content (in domchange.js), we allow
     * descriptions to determine the parse rules that should be used to
     * parse them.
     */
    parseRule(): Omit<TagParseRule, 'tag'> | null;

    /**
     * Used by the editor's event handler to ignore events that come
     * from certain descs.
     *
     * @param _event - The DOM event to check
     * @returns True if the event should be stopped/ignored
     */
    stopEvent(_event: Event): boolean;

    /**
     * Destroys this view description and all its children, cleaning up references.
     *
     * This method ensures proper cleanup even if exceptions occur during child destruction.
     */
    destroy(): void;

    /**
     * Calculates the document position just before a given child view.
     *
     * @param child - The child view to locate
     * @returns The document position before the child
     */
    posBeforeChild(child: PmViewDesc): number;

    /**
     * Converts a DOM position within this view to a document position.
     *
     * Uses two strategies:
     * 1. If position is inside contentDOM: scans through children to find nearest view desc
     * 2. If position is outside contentDOM: uses heuristics based on DOM structure
     *
     * @param dom - The DOM node where the position is
     * @param offset - The offset within the DOM node
     * @param bias - Direction bias for ambiguous positions (-1 for before, 1 for after)
     * @returns The document position corresponding to the DOM position
     */
    localPosFromDOM(dom: Node, offset: number, bias: number): number;

    /**
     * Gets a view description from a DOM node if it's a descendant of this description.
     *
     * @param dom - The DOM node to check
     * @returns The view description if it's a descendant, undefined otherwise
     */
    getDesc(dom: Node): PmViewDesc | undefined;

    /**
     * Converts a DOM position to a document position.
     *
     * @param dom - The DOM node containing the position
     * @param offset - The offset within the DOM node
     * @param bias - Direction bias for ambiguous positions
     * @returns The document position, or -1 if not found
     */
    posFromDOM(dom: Node, offset: number, bias: number): number;

    /**
     * Find the desc for the node after the given pos, if any. (When a
     * parent node overrode rendering, there might not be one.)
     *
     * @param pos - The document position to search for
     * @returns The view description at that position, or undefined
     */
    descAt(pos: number): PmViewDesc | undefined;

    /**
     * Converts a document position to a DOM position.
     *
     * The algorithm:
     * 1. For leaf nodes: return the DOM node itself with atom marker
     * 2. For container nodes: find which child contains the position
     * 3. If inside a child: recurse into that child
     * 4. If at boundary: adjust for zero-width widgets and find DOM position
     *
     * @param pos - The document position (relative to this view's start)
     * @param side - Direction to favor (-1 for before, 0 for neutral, 1 for after)
     * @returns Object containing the DOM node, offset, and optionally an atom marker
     */
    domFromPos(pos: number,
               side: number): { node: Node, offset: number, atom?: number; };

    /**
     * Finds a DOM range in a single parent for a given changed range.
     *
     * This method maps document positions to DOM child indices, which is needed
     * for parsing changed content. It tries to optimize by recursing into a single
     * child when the entire range fits inside it.
     *
     * @param from - Start position of the range
     * @param to - End position of the range
     * @param base - Base offset for position calculations (default: 0)
     * @returns Object containing the DOM node and offsets for the range
     */
    parseRange(from: number,
               to: number,
               base?: number): { node: Node, from: number, to: number, fromOffset: number, toOffset: number };

    /**
     * Checks if there's an empty child at the start or end of this view.
     *
     * @param side - Direction to check (-1 for start, 1 for end)
     * @returns True if there's an empty child at the specified side
     */
    emptyChildAt(side: number): boolean;

    /**
     * Gets the DOM node immediately after a given document position.
     *
     * @param pos - The document position
     * @returns The DOM node after the position
     * @throws RangeError if there's no node after the position
     */
    domAfterPos(pos: number): Node;

    /**
     * Sets a selection within this view description or delegates to a child.
     *
     * View descs are responsible for setting selections that fall entirely inside them,
     * allowing custom node views to implement specialized selection behavior.
     *
     * Strategy:
     * 1. If selection is entirely within a child → delegate to that child
     * 2. Otherwise → convert positions to DOM and apply selection
     *
     * @param anchor - The anchor position of the selection
     * @param head - The head position of the selection
     * @param view - The editor view
     * @param force - Whether to force the selection update even if it appears unchanged
     */
    setSelection(anchor: number,
                 head: number,
                 view: PmEditorView,
                 force?: boolean): void;

    /**
     * Determines if a mutation can be safely ignored.
     *
     * @param mutation - The mutation record to check
     * @returns True if the mutation can be ignored, false if it needs processing
     */
    ignoreMutation(mutation: ViewMutationRecord): boolean;

    /**
     * Marks a subtree that has been touched by a DOM change for redrawing.
     *
     * The algorithm walks through children to find which ones overlap with
     * the dirty range, then either:
     * - Recursively marks the child if range is fully contained
     * - Marks the child for full recreation if range partially overlaps
     *
     * @param from - Start position of the dirty range
     * @param to - End position of the dirty range
     */
    markDirty(from: number, to: number): void;

    /**
     * Checks if this view represents text with a specific content.
     *
     * @param _text - The text content to check against
     * @returns True if this is a text view with the given content
     */
    isText(_text: string): boolean;

    /**
     * Marks this description and its parents as dirty, propagating the dirty state up the tree.
     * Sets the dirty level to CONTENT_DIRTY for the immediate parent and CHILD_DIRTY for ancestors.
     */
    markParentsDirty(): void;
}
