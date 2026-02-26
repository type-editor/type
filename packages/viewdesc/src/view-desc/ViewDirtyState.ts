/**
 * Dirty state constants - used to track which parts of the view need redrawing
 */
export enum ViewDirtyState {
    NOT_DIRTY = 0,       // View is clean, no redraw needed
    CHILD_DIRTY = 1,     // One or more children need redrawing
    CONTENT_DIRTY = 2,   // Content has changed, needs partial redraw
    NODE_DIRTY = 3       // Entire node needs to be recreated
}
