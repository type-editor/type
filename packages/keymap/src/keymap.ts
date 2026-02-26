import { browser, hasOwnProperty } from '@type-editor/commons';
import type { Command, PmEditorView } from '@type-editor/editor-types';
import { Plugin } from '@type-editor/state';
import { base, keyName } from 'w3c-keyname';


/**
 * Creates a keymap plugin for the given set of key bindings.
 *
 * Bindings should map key names to [command](#commands)-style functions, which will be called
 * with `(EditorState, dispatch, EditorView)` arguments, and should return `true` when they've
 * handled the key. Note that the view argument isn't part of the command protocol, but can be
 * used as an escape hatch if a binding needs to directly interact with the UI.
 *
 * Key names may be strings like `"Shift-Ctrl-Enter"`—a key identifier prefixed with zero or
 * more modifiers. Key identifiers are based on the strings that can appear in
 * [`KeyEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
 * Use lowercase letters to refer to letter keys (or uppercase letters if you want shift to
 * be held). You may use `"Space"` as an alias for the `" "` name.
 *
 * Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or `a-`), `Ctrl-` (or
 * `c-` or `Control-`) and `Cmd-` (or `m-` or `Meta-`) are recognized. For characters that
 * are created by holding shift, the `Shift-` prefix is implied, and should not be added
 * explicitly.
 *
 * You can use `Mod-` as a shorthand for `Cmd-` on Mac and `Ctrl-` on other platforms.
 *
 * You can add multiple keymap plugins to an editor. The order in which they appear determines
 * their precedence (the ones early in the array get to dispatch first).
 *
 * @param bindings - A record mapping key name strings to command functions that handle those keys
 * @returns A plugin instance that handles keydown events according to the provided bindings
 *
 * @example
 * ```typescript
 * const myKeymap = keymap({
 *   "Mod-Enter": insertHardBreak,
 *   "Ctrl-b": toggleBold,
 *   "Alt-ArrowUp": joinUp
 * });
 * ```
 */
export function keymap(bindings: Record<string, Command>): Plugin {
  return new Plugin({props: {handleKeyDown: keydownHandler(bindings)}});
}

/**
 * Creates a keydown handler function from a set of key bindings.
 *
 * Given a set of bindings (using the same format as {@link keymap}), this function returns
 * a [keydown handler](#view.EditorProps.handleKeyDown) that handles them. The handler will
 * attempt to match the keydown event against the bindings, trying multiple strategies:
 *
 * 1. Direct match with modifiers
 * 2. For single-character keys with Shift, try without Shift modifier
 * 3. For keys with modifiers, fall back to keyCode-based matching (handles keyboard layout differences)
 *
 * The function handles platform-specific edge cases, such as Ctrl-Alt on Windows (used for AltGr).
 *
 * @param bindings - A record mapping key name strings to command functions
 * @returns A keydown event handler function that can be used in EditorProps
 *
 * @example
 * ```typescript
 * const handler = keydownHandler({
 *   "Enter": insertParagraph,
 *   "Mod-b": toggleBold
 * });
 * // Use in EditorProps: { handleKeyDown: handler }
 * ```
 */
export function keydownHandler(bindings: Record<string, Command>): (view: PmEditorView, event: KeyboardEvent) => boolean {
    const map: Record<string, Command> = normalize(bindings);

    return function(view: PmEditorView, event: KeyboardEvent): boolean {
        const name: string = keyName(event);

        // Helper to try executing a command
        const tryCommand = (command: Command | undefined): boolean => {
            // eslint-disable-next-line @typescript-eslint/unbound-method -- view.dispatch is bound in EditorView constructor
            return command ? command(view.state, view.dispatch, view) : false;
        };

        // Strategy 1: Try direct match with modifiers
        const directCommand = map[modifiers(name, event)];
        if (tryCommand(directCommand)) {
            return true;
        }

        // Only continue for single character keys
        if (!isSingleCharacterKey(name)) {
            return false;
        }

        // Strategy 2: For shifted character keys, try without Shift modifier
        if (event.shiftKey) {
            const noShiftCommand = map[modifiers(name, event, false)];
            if (tryCommand(noShiftCommand)) {
                return true;
            }
        }

        // Strategy 3: Fall back to keyCode-based matching for modified keys
        // This handles keyboard layout differences (see #668, #1060, #1529)
        if (hasModifierKeys(event) && !isWindowsAltGr(event)) {
            const baseName = base[event.keyCode];

            if (baseName && baseName !== name) {
                const fromCodeCommand = map[modifiers(baseName, event)];
                if (tryCommand(fromCodeCommand)) {
                    return true;
                }
            }
        }

        return false;
    };
}


/**
 * Modifier key state tracking.
 * @internal
 */
interface ModifierState {
    alt: boolean;
    ctrl: boolean;
    shift: boolean;
    meta: boolean;
}

/**
 * Cached regex patterns for modifier key parsing (performance optimization).
 * @internal
 */
const MODIFIER_PATTERNS = {
    meta: /^(cmd|meta|m)$/i,
    alt: /^a(lt)?$/i,
    ctrl: /^(c|ctrl|control)$/i,
    shift: /^s(hift)?$/i,
    mod: /^mod$/i
};

/**
 * Parses a single modifier key string and updates the modifier state.
 *
 * @param modifierKey - The modifier key string to parse (e.g., "Ctrl", "Mod", "Alt")
 * @param state - The current modifier state to update
 * @throws {Error} If the modifier key is not recognized
 *
 * @internal
 */
function parseModifier(modifierKey: string, state: ModifierState): void {
    if (MODIFIER_PATTERNS.meta.test(modifierKey)) {
        state.meta = true;
    } else if (MODIFIER_PATTERNS.alt.test(modifierKey)) {
        state.alt = true;
    } else if (MODIFIER_PATTERNS.ctrl.test(modifierKey)) {
        state.ctrl = true;
    } else if (MODIFIER_PATTERNS.shift.test(modifierKey)) {
        state.shift = true;
    } else if (MODIFIER_PATTERNS.mod.test(modifierKey)) {
        // "Mod" is platform-aware: Cmd on Mac, Ctrl elsewhere
        if (browser.mac) {
            state.meta = true;
        } else {
            state.ctrl = true;
        }
    } else {
        throw new Error(`Unrecognized modifier name: ${modifierKey}`);
    }
}

/**
 * Builds a normalized key name from the base key and modifier state.
 *
 * Modifiers are prepended in reverse alphabetical order (Shift, Meta, Ctrl, Alt)
 * so that when reading left-to-right, they appear in alphabetical order.
 *
 * @param baseKey - The base key name (e.g., "Enter", "a", " ")
 * @param state - The modifier state
 * @returns The normalized key name with modifiers (e.g., "Ctrl-Enter", "Alt-Ctrl-Meta-Shift-A")
 *
 * @internal
 */
function buildNormalizedKeyName(baseKey: string, state: ModifierState): string {
    let result: string = baseKey;

    // Apply modifiers in reverse alphabetical order (they get prepended)
    // This ensures the final result has modifiers in alphabetical order when read left-to-right
    if (state.shift) {
        result = `Shift-${result}`;
    }
    if (state.meta) {
        result = `Meta-${result}`;
    }
    if (state.ctrl) {
        result = `Ctrl-${result}`;
    }
    if (state.alt) {
        result = `Alt-${result}`;
    }

    return result;
}

/**
 * Normalizes a key name by parsing modifiers and converting them to a standardized format.
 *
 * This function parses key names like "Shift-Ctrl-Enter" and normalizes them to a consistent
 * format with modifiers in alphabetical order. The "Space" key is converted to " ".
 * The "Mod" modifier is platform-aware (Meta on Mac, Ctrl on other platforms).
 *
 * @param name - The key name string to normalize (e.g., "Shift-Ctrl-Enter" or "Mod-s")
 * @returns The normalized key name with modifiers in alphabetical order
 * @throws {Error} If an unrecognized modifier name is encountered
 *
 * @example
 * ```typescript
 * normalizeKeyName("Mod-s") // Returns "Meta-s" on Mac, "Ctrl-s" on Windows/Linux
 * normalizeKeyName("Space") // Returns " "
 * ```
 */
function normalizeKeyName(name: string): string {
    // Split by "-" but not at the end (to handle keys like "-" itself)
    const parts: Array<string> = name.split(/-(?!$)/);
    const lastIndex: number = parts.length - 1;

    // The last part is the base key
    let baseKey: string = parts[lastIndex];

    // Convert "Space" alias to actual space character
    if (baseKey === 'Space') {
        baseKey = ' ';
    }

    // Parse all modifiers
    const modifierState: ModifierState = {
        alt: false,
        ctrl: false,
        shift: false,
        meta: false
    };

    for (let i = 0; i < lastIndex; i++) {
        parseModifier(parts[i], modifierState);
    }

    return buildNormalizedKeyName(baseKey, modifierState);
}

/**
 * Normalizes all key bindings in a keymap by converting key names to a standardized format.
 *
 * This function takes a map of key bindings and normalizes all key names using the
 * {@link normalizeKeyName} function. It ensures there are no duplicate bindings after normalization.
 *
 * @param map - A record mapping key name strings to command functions
 * @returns A new record with normalized key names mapped to the same commands
 * @throws {Error} If multiple bindings map to the same normalized key name
 *
 * @internal
 */
function normalize(map: Record<string, Command>): Record<string, Command> {
    const copy: Record<string, Command> = {};

    for (const prop in map) {
        // Only process own properties to avoid prototype pollution
        if (!hasOwnProperty(map, prop)) {
            continue;
        }

        const normalizedKeyName: string = normalizeKeyName(prop);

        if (hasOwnProperty(copy, normalizedKeyName)) {
            throw new Error(`Multiple bindings for key ${normalizedKeyName} in a single keymap`);
        }

        copy[normalizedKeyName] = map[prop];
    }

    return copy;
}

/**
 * Constructs a key name string with modifiers based on the keyboard event's active modifier keys.
 *
 * This function inspects the keyboard event and prepends the appropriate modifier prefixes
 * in reverse alphabetical order (so they appear alphabetically when read left-to-right).
 *
 * @param name - The base key name to which modifiers will be prepended
 * @param event - The keyboard event containing information about which modifier keys are active
 * @param shift - Whether to include the Shift modifier. Defaults to `true`
 * @returns The key name with active modifiers prepended (e.g., "Ctrl-Enter" or "Alt-Ctrl-Meta-Shift-A")
 *
 * @internal
 */
function modifiers(name: string, event: KeyboardEvent, shift = true): string {
    let result = name;

    // Apply modifiers in reverse alphabetical order (they get prepended)
    // This ensures the final result has modifiers in alphabetical order when read left-to-right
    if (shift && event.shiftKey) {
        result = `Shift-${result}`;
    }
    if (event.metaKey) {
        result = `Meta-${result}`;
    }
    if (event.ctrlKey) {
        result = `Ctrl-${result}`;
    }
    if (event.altKey) {
        result = `Alt-${result}`;
    }

    return result;
}

/**
 * Checks if a character is a single printable character (excluding space).
 *
 * @param keyName - The key name to check
 * @returns `true` if the key is a single character (excluding space)
 *
 * @internal
 */
function isSingleCharacterKey(keyName: string): boolean {
  return keyName.length === 1 && keyName !== ' ';
}

/**
 * Checks if the keyboard event has any modifier keys active.
 *
 * @param event - The keyboard event to check
 * @returns `true` if any modifier key (Alt, Meta, Ctrl) is pressed
 *
 * @internal
 */
function hasModifierKeys(event: KeyboardEvent): boolean {
  return event.altKey || event.metaKey || event.ctrlKey;
}

/**
 * Checks if the event represents AltGr on Windows.
 *
 * On Windows, AltGr is represented as Ctrl+Alt, which should not be treated
 * as a regular modifier combination.
 *
 * @param event - The keyboard event to check
 * @returns `true` if this is AltGr on Windows
 *
 * @internal
 */
function isWindowsAltGr(event: KeyboardEvent): boolean {
  return browser.windows && event.ctrlKey && event.altKey;
}
