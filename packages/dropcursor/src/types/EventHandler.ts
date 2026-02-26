/**
 * Event handler mapping for drag-and-drop events.
 */
export interface EventHandler {
    name: string;
    handler: (event: Event) => void;
}
