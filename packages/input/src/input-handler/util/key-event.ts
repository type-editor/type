/**
 * Creates a synthetic keyboard event for testing or programmatic key simulation.
 *
 * @param keyCode - The numeric key code for the keyboard event
 * @param key - The key value (e.g., 'Enter', 'a', 'ArrowLeft')
 * @returns A KeyboardEvent object configured as a keydown event
 *
 * @example
 * ```typescript
 * const enterEvent = keyEvent(13, 'Enter');
 * element.dispatchEvent(enterEvent);
 * ```
 */
export function keyEvent(keyCode: number, key: string): KeyboardEvent {
    return new KeyboardEvent('keydown', {
        key: key,
        code: key,
        keyCode: keyCode,
        bubbles: true,
        cancelable: true
    });
}
