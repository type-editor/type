import { Decoration, DecorationSet } from '@type-editor/decoration';
import type {
    Command,
    DispatchFunction,
    PmEditorState,
    PmEditorView,
    PmSelection,
    PmTransaction,
} from '@type-editor/editor-types';
import { keydownHandler } from '@type-editor/keymap';
import { Fragment, type NodeType, type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import { Plugin, Selection } from '@type-editor/state';

import { GapCursor } from './GapCursor';

/**
 * Create a gap cursor plugin. When enabled, this will capture clicks
 * near and arrow-key-motion past places that don't have a normally
 * selectable position nearby, and create a gap cursor selection for
 * them. The cursor is drawn as an element with class
 * `ProseMirror-gapcursor`. You can either include
 * `style/gapcursor.css` from the package's directory or add your own
 * styles to make it visible.
 */
/**
 * Creates a gap cursor plugin for the editor.
 *
 * When enabled, this plugin will:
 * - Capture clicks near positions that don't have a normally selectable position
 * - Create gap cursor selections for such positions
 * - Handle composition input to avoid IME conflicts
 * - Render the gap cursor with the 'ProseMirror-gapcursor' CSS class
 *
 * @returns A configured Plugin instance.
 */
export function gapCursor(): Plugin {
    return new Plugin({
        props: {
            decorations: drawGapCursor,

            createSelectionBetween(_view: PmEditorView, $anchor: ResolvedPos, $head: ResolvedPos): PmSelection | null {
                return $anchor.pos === $head.pos && GapCursor.valid($head) ? new GapCursor($head) : null;
            },

            handleClick,
            // Note: keyboard navigation is currently disabled
            handleKeyDown,
            handleDOMEvents: {
                // Type assertion needed due to InputEvent vs Event type mismatch in ProseMirror types
                beforeinput: beforeinput as (view: PmEditorView, event: Event) => boolean
            }
        }
    });
}

// Keyboard navigation functionality (currently disabled)
// Uncomment and use with keydownHandler if arrow key navigation is desired
const handleKeyDown = keydownHandler(
    {
        'ArrowLeft': arrow('horiz', -1),
        'ArrowRight': arrow('horiz', 1),
        'ArrowUp': arrow('vert', -1),
        'ArrowDown': arrow('vert', 1)
    }
);

function arrow(axis: 'vert' | 'horiz', dir: number): Command {
    const dirStr = axis === 'vert'
        ? (dir > 0 ? 'down' : 'up')
        : (dir > 0 ? 'right' : 'left');

    return function (state: PmEditorState, dispatch: DispatchFunction, view: PmEditorView): boolean {
        const selection: PmSelection = state.selection;
        let $start: ResolvedPos = dir > 0 ? selection.$to : selection.$from;
        let mustMove: boolean = selection.empty;

        if (selection.isTextSelection()) {
            if (!view.endOfTextblock(dirStr) || $start.depth === 0) {
                return false;
            }

            mustMove = false;
            $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before());
        }

        const $found: ResolvedPos = GapCursor.findGapCursorFrom($start, dir, mustMove);
        if (!$found) {
            return false;
        }

        if (dispatch) {
            dispatch(state.transaction.setSelection(new GapCursor($found)));
        }
        return true;
    };
}

/**
 * Handles click events to create gap cursor selections at valid positions.
 *
 * @param view The editor view.
 * @param pos The position where the click occurred.
 * @param event The mouse event.
 * @returns True if the click was handled, false otherwise.
 */
function handleClick(view: PmEditorView, pos: number, event: MouseEvent): boolean {
    if (!view?.editable) {
        return false;
    }

    const $pos: ResolvedPos = view.state.doc.resolve(pos);
    if (!GapCursor.valid($pos)) {
        return false;
    }

    const clickPos = view.posAtCoords({left: event.clientX, top: event.clientY});
    if (clickPos && clickPos.inside > -1) {
        const node: PmNode = view.state.doc.nodeAt(clickPos.inside);
        if (node && Selection.isNodeSelectable(node)) {
            return false;
        }
    }

    view.dispatch(view.state.transaction.setSelection(new GapCursor($pos)));
    return true;
}

/**
 * This is a hack that, when a composition starts while a gap cursor
 * is active, quickly creates an inline context for the composition to
 * happen in, to avoid it being aborted by the DOM selection being
 * moved into a valid position.
 *
 * @param view The editor view.
 * @param event The input event.
 * @returns False to allow default handling.
 */
function beforeinput(view: PmEditorView, event: InputEvent): boolean {
    if (event.inputType !== 'insertCompositionText' || !(view.state.selection instanceof GapCursor)) {
        return false;
    }

    const {$from} = view.state.selection;
    const textNode: NodeType = view.state.schema.nodes.text;

    // Bug fix: Check if text node exists in schema
    if (!textNode) {
        return false;
    }

    const insert: ReadonlyArray<NodeType> = $from.parent.contentMatchAt($from.index()).findWrapping(textNode);
    if (!insert) {
        return false;
    }

    let fragment: Fragment = Fragment.empty;
    for (let i = insert.length - 1; i >= 0; i--) {
        fragment = Fragment.from(insert[i].createAndFill(null, fragment));
    }
    const transaction: PmTransaction = view.state.transaction.replace($from.pos, $from.pos, new Slice(fragment, 0, 0));
    transaction.setSelection(Selection.near(transaction.doc.resolve($from.pos + 1)));
    view.dispatch(transaction);
    return false;
}

// Performance optimization: Cache the gap cursor widget element to avoid recreating it on every render
let gapCursorWidget: HTMLDivElement | null = null;

/**
 * Creates decorations to render the gap cursor in the editor.
 *
 * @param state The editor state.
 * @returns A decoration set containing the gap cursor widget, or null if not applicable.
 */
function drawGapCursor(state: PmEditorState): DecorationSet | null {
    if (!(state.selection instanceof GapCursor)) {
        return null;
    }

    // Performance: Reuse the same DOM element instead of creating a new one every time
    if (!gapCursorWidget) {
        gapCursorWidget = document.createElement('div');
        gapCursorWidget.className = 'ProseMirror-gapcursor';
    }

    return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, gapCursorWidget, {key: 'gapcursor'})]);
}
