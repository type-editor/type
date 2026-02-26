import {
    selectHorizontallyBackward,
    selectHorizontallyForward,
    selectVerticallyDown,
    selectVerticallyUp,
    skipIgnoredNodesAfter,
    skipIgnoredNodesBefore,
    stopNativeHorizontalDeleteBackward,
    stopNativeHorizontalDeleteForward
} from '@type-editor/commands';
import {browser, Direction} from '@type-editor/commons';
import type {PmEditorView, PmInputState, PmTransaction} from '@type-editor/editor-types';
import type {EditorState} from '@type-editor/state';

import {
    COMPOSITION_KEY_CODE,
    ENTER_KEY_CODE,
    KEY_ALT,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
    KEY_CONTROL,
    KEY_ENTER,
    KEY_ESCAPE,
    KEY_META,
    KEY_SHIFT
} from '../key-codes';
import {keyEvent} from '../util/key-event';
import {setSelectionOrigin} from '../util/set-selection-origin';
import {safariDownArrowBug} from './browser-hacks/safari-down-arrow-bug';
import {isBackspaceKey} from './keys/is-backspace-key';
import {isDeleteKey} from './keys/is-delete-key';
import {isDownArrowKey} from './keys/is-down-arrow-key';
import {isFormattingShortcut} from './keys/is-formatting-shortcut';
import {isLeftArrowKey} from './keys/is-left-arrow-key';
import {isRightArrowKey} from './keys/is-right-arrow-key';
import {isUpArrowKey} from './keys/is-up-arrow-key';
import {findDirection} from './util/find-direction';
import {inOrNearComposition} from './util/in-or-near-composition';


// Delay for iOS Enter key fallback handling (ms)
const IOS_ENTER_FALLBACK_DELAY = 200;

/**
 * Handles keydown events in the editor. Manages composition state, platform-specific
 * quirks (iOS Enter handling, Chrome Android composition), and delegates to custom
 * handlers or built-in command handlers.
 */
export function keyDownHandler(view: PmEditorView, event: KeyboardEvent): boolean {
    setMods(event, view.input);

    // Don't handle key events during or immediately after composition
    // to avoid interfering with IME input
    if (inOrNearComposition(view, event)) {
        return false;
    }

    view.input.lastKeyCode = event.keyCode;
    view.input.lastKey = event.key;
    view.input.lastKeyCodeTime = Date.now();

    // Chrome Android has a bug where Enter keys during composition get fired separately
    // from the composition events, causing double input. Suppress them here.
    if (browser.android && browser.chrome && event.key === KEY_ENTER) {
        return false;
    }

    // Flush pending DOM changes before handling the key, unless it's a composition key
    // (key code 229 on some browsers indicates IME composition is active)
    if (!event.isComposing || event.keyCode !== COMPOSITION_KEY_CODE) {
        view.domObserver.forceFlush();
    }

    // On iOS, if we preventDefault enter key presses, the virtual
    // keyboard gets confused. So the hack here is to set a flag that
    // makes the DOM change code recognize that what just happens should
    // be replaced by whatever the Enter key handlers do.
    // iOS has a special handling for Enter key: we can't preventDefault on it
    // because it would break the virtual keyboard, but we still need to handle it.
    // Set a fallback timeout that will trigger if the key isn't handled by DOM changes.
    if (browser.ios
        && event.key === KEY_ENTER
        && !event.ctrlKey
        && !event.altKey
        && !event.metaKey) {

        const now = Date.now();
        view.input.lastIOSEnter = now;

        // Schedule a fallback that triggers handleKeyDown if the Enter key
        // doesn't produce DOM changes that get handled normally
        view.input.lastIOSEnterFallbackTimeout = window.setTimeout(() => {
            if (view.input.lastIOSEnter === now) {
                view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, keyEvent(ENTER_KEY_CODE, 'Enter')));
                view.input.lastIOSEnter = 0;
            }
        }, IOS_ENTER_FALLBACK_DELAY);

    } else if (view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, event))) {
        event.preventDefault();
        return true;
    } else if(captureKeyDown(view, event)) {
        event.preventDefault();
        return true;
    } else {
        setSelectionOrigin(view, 'key');
    }
    return false;
}


/**
 * Captures and handles key down events in the editor, intercepting certain key combinations
 * to provide custom behavior for navigation, deletion, and selection operations.
 *
 * This function acts as the main entry point for keyboard event handling, delegating to
 * specialized functions based on the key pressed and active modifiers.
 *
 * @param view - The EditorView instance
 * @param event - The keyboard event to handle
 * @returns True if the event was handled and should be prevented from default behavior
 */
export function captureKeyDown(view: PmEditorView, event: KeyboardEvent): boolean {
    const key: string = event.key;
    // get modifier keys like Ctrl, Alt, Shift, Meta
    // const mods: string = getMods(event);

    const dispatchFunction = (tr: PmTransaction) => { view.dispatch(tr); };
    const editorState = view.state as EditorState;

    // Handle backspace and Mac Ctrl-h
    if (isBackspaceKey(key, event, view.input)) {
        return stopNativeHorizontalDeleteBackward(editorState, dispatchFunction, view) ||
            skipIgnoredNodesBefore(view.state as EditorState, dispatchFunction, view);
    }

    // Handle delete and Mac Ctrl-d
    if (isDeleteKey(key, event, view.input)) {
        return stopNativeHorizontalDeleteForward(editorState, dispatchFunction, view) ||
            skipIgnoredNodesAfter(editorState, dispatchFunction, view);
    }

    // Let Enter and Escape pass through to browser default behavior
    // if not handled by handleKeyDown (keymap plugins)
    if (key === KEY_ENTER || key === KEY_ESCAPE) {
        return false;
    }

    // Cache selection position for arrow key handling
    const selectionFrom = view.state.selection.from;

    let direction: Direction;

    // Handle left arrow and Mac Ctrl-b
    if (isLeftArrowKey(key, view.input)) {
        direction = key === KEY_ARROW_LEFT
            ? (findDirection(view, selectionFrom) === 'ltr' ? Direction.Backward : Direction.Forward)
            : Direction.Backward;
    } else if (isRightArrowKey(key, view.input)) {
        direction = key === KEY_ARROW_RIGHT
            ? (findDirection(view, selectionFrom) === 'ltr' ? Direction.Forward : Direction.Backward)
            : Direction.Forward;
    }

    if(direction  === Direction.Backward) {
        const result = selectHorizontallyBackward(editorState, dispatchFunction, view);
        return result || skipIgnoredNodesBefore(editorState, dispatchFunction, view);
    }

    if(direction === Direction.Forward) {
        const result = selectHorizontallyForward(editorState, dispatchFunction, view);
        return result || skipIgnoredNodesAfter(editorState, dispatchFunction, view);
    }

    // Handle up arrow and Mac Ctrl-p
    if (isUpArrowKey(key, view.input)) {
        return selectVerticallyUp(editorState, dispatchFunction, view)
            || skipIgnoredNodesBefore(editorState, dispatchFunction, view);
    }

    // Handle down arrow and Mac Ctrl-n
    if (isDownArrowKey(key, view.input)) {
        return safariDownArrowBug(view)
            || selectVerticallyDown(editorState, dispatchFunction, view)
            || skipIgnoredNodesAfter(editorState, dispatchFunction, view);
    }

    // Handle formatting shortcuts (Mod-B/I/Y/Z)
    return isFormattingShortcut(key, view.input);
}

function setMods(event: KeyboardEvent, inputState: PmInputState): void {
    inputState.ctlKey = event.key === KEY_CONTROL || event.ctrlKey;
    inputState.metaKey = event.key === KEY_META || event.metaKey;
    inputState.altKey = event.key === KEY_ALT || event.altKey;
    inputState.shiftKey = event.key === KEY_SHIFT || event.shiftKey;
}
