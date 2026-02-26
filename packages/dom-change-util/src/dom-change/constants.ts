/**
 * Time threshold (in milliseconds) for considering a selection change to be recent.
 * Used to determine if the selection origin should be preserved.
 */
export const SELECTION_TIME_THRESHOLD = 50;

/**
 * Time threshold (in milliseconds) for detecting iOS Enter key events.
 * iOS has specific timing-based detection for Enter key presses.
 */
export const IOS_ENTER_TIME_THRESHOLD = 225;

/**
 * Time threshold (in milliseconds) for detecting Chrome delete operations.
 * Chrome occasionally deletes and re-inserts content during composition.
 */
export const CHROME_DELETE_TIME_THRESHOLD = 100;
