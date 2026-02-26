
/**
 * Configuration options for receiving transactions from the central authority.
 */
export interface ReceiveTransactionOptions {
    /**
     * When enabled (the default is `false`), if the current
     * selection is a {@link TextSelection}, its sides are mapped
     * with a negative bias for this transaction, so that content
     * inserted at the cursor ends up after the cursor.
     * Users usually prefer this, but it isn't done by default for
     * reasons of backwards compatibility.
     */
    mapSelectionBackward?: boolean;
}
