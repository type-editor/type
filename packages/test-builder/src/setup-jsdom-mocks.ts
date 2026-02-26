/**
 * Test setup file for vitest
 *
 * This file mocks DOM methods that are not available in JSDOM but are required
 * by the @type-editor/dom-coords-util package (used by EditorView.endOfTextblock).
 *
 * JSDOM doesn't implement layout-related methods like getClientRects() since it
 * doesn't render CSS layouts. These mocks provide minimal implementations to
 * allow tests to run without errors.
 */

import {
    afterAll,
    beforeAll,
} from 'vitest';

// Store original Range for cleanup
const OriginalRange = globalThis.Range;

export function setupJSDOMMocks() {
    beforeAll(() => {
        // Mock Range.prototype methods that JSDOM doesn't implement
        if (typeof Range !== 'undefined' && !Range.prototype.getClientRects) {
            Range.prototype.getClientRects = function () {
                const rect = this.getBoundingClientRect?.() ?? {
                    left: 0,
                    top: 0,
                    right: 100,
                    bottom: 20,
                    width: 100,
                    height: 20,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                };
                // Return a DOMRectList-like array
                const rects = [rect] as Array<DOMRect> & { item: (index: number) => DOMRect | null };
                rects.item = (index: number) => rects[index] ?? null;
                return rects as DOMRectList;
            };
        }

        if (typeof Range !== 'undefined' && !Range.prototype.getBoundingClientRect) {
            Range.prototype.getBoundingClientRect = function () {
                return {
                    left: 0,
                    top: 0,
                    right: 100,
                    bottom: 20,
                    width: 100,
                    height: 20,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                } as DOMRect;
            };
        }

        // Also mock Element.prototype.getClientRects if not present
        if (typeof Element !== 'undefined' && !Element.prototype.getClientRects) {
            Element.prototype.getClientRects = function () {
                const rect = this.getBoundingClientRect?.() ?? {
                    left: 0,
                    top: 0,
                    right: 100,
                    bottom: 20,
                    width: 100,
                    height: 20,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                };
                const rects = [rect] as Array<DOMRect> & { item: (index: number) => DOMRect | null };
                rects.item = (index: number) => rects[index] ?? null;
                return rects as DOMRectList;
            };
        }
    });

    afterAll(() => {
        // Restore original Range if needed
        if (OriginalRange && globalThis.Range !== OriginalRange) {
            globalThis.Range = OriginalRange;
        }
    });
}


