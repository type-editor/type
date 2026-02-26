/**
 * Helper type that maps event names to event object types, but
 * includes events that TypeScript's HTMLElementEventMap doesn't know
 * about.
 */
export interface DOMEventMap extends HTMLElementEventMap, Record<string, any> {
}
