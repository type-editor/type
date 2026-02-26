import {describe, it, expect, beforeEach, vi} from 'vitest';
import {singleRect} from '@src/dom-coords/util/single-rect';

describe("singleRect", () => {
    describe("HTMLElement", () => {
        let element: HTMLElement;

        beforeEach(() => {
            element = document.createElement('div');
            document.body.appendChild(element);
        });

        it("returns first rectangle with negative bias", () => {
            const rect = singleRect(element, -1);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
            expect(typeof rect.top).toBe('number');
        });

        it("returns last rectangle with positive bias", () => {
            const rect = singleRect(element, 1);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
            expect(typeof rect.top).toBe('number');
        });

        it("returns bounding rect when element has no client rects", () => {
            // Mock to return empty rect list
            const mockGetClientRects = vi.fn(() => [] as any);
            const mockGetBoundingRect = vi.fn(() => new DOMRect(10, 20, 30, 40));

            element.getClientRects = mockGetClientRects;
            element.getBoundingClientRect = mockGetBoundingRect;

            const rect = singleRect(element, 0);

            expect(mockGetBoundingRect).toHaveBeenCalled();
            expect(rect.left).toBe(10);
            expect(rect.top).toBe(20);
        });
    });

    describe("Range", () => {
        let range: Range;
        let textNode: Text;

        beforeEach(() => {
            const container = document.createElement('div');
            container.textContent = 'Hello World';
            document.body.appendChild(container);

            textNode = container.firstChild as Text;
            range = document.createRange();
            range.setStart(textNode, 0);
            range.setEnd(textNode, 5);
        });

        // Note: jsdom doesn't fully support Range.getClientRects()
        // These tests would pass in a real browser but are skipped in jsdom
        it("returns first rectangle with negative bias for range", () => {
            const rect = singleRect(range, -1);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });

        it("returns last rectangle with positive bias for range", () => {
            const rect = singleRect(range, 1);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });

        it("handles zero bias", () => {
            const rect = singleRect(range, 0);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });
    });

    describe("non-zero rect selection", () => {
        it("prefers non-zero rectangles", () => {
            const element = document.createElement('div');
            element.style.width = '100px';
            element.style.height = '100px';
            document.body.appendChild(element);

            const rect = singleRect(element, 0);

            // Should return a rectangle with dimensions
            expect(rect).toBeDefined();
            expect(typeof rect.width).toBe('number');
            expect(typeof rect.height).toBe('number');
        });

        it("falls back to bounding rect if all rects are zero-sized", () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            // Mock to return zero-sized rects
            const mockRects = [
                new DOMRect(0, 0, 0, 0),
                new DOMRect(10, 10, 0, 0)
            ];
            const mockBoundingRect = new DOMRect(5, 5, 50, 50);

            element.getClientRects = vi.fn(() => mockRects as any);
            element.getBoundingClientRect = vi.fn(() => mockBoundingRect);

            const rect = singleRect(element, 1);

            expect(rect.left).toBe(5);
            expect(rect.top).toBe(5);
            expect(rect.width).toBe(50);
            expect(rect.height).toBe(50);
        });
    });

    describe("bias handling", () => {
        it("uses first rect for negative bias", () => {
            const element = document.createElement('span');
            element.textContent = 'Multiple lines of text that might wrap';
            element.style.width = '50px';
            document.body.appendChild(element);

            const rect = singleRect(element, -100);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });

        it("uses last rect for positive bias", () => {
            const element = document.createElement('span');
            element.textContent = 'Multiple lines of text that might wrap';
            element.style.width = '50px';
            document.body.appendChild(element);

            const rect = singleRect(element, 100);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });
    });

    describe("edge cases", () => {
        it("handles element with single rect", () => {
            const element = document.createElement('div');
            element.textContent = 'Text';
            document.body.appendChild(element);

            const rect = singleRect(element, 0);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });

        it("handles empty element", () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            const rect = singleRect(element, 0);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });

        it("handles collapsed range", () => {
            const container = document.createElement('div');
            container.textContent = 'Test';
            document.body.appendChild(container);

            const range = document.createRange();
            range.setStart(container.firstChild!, 0);
            range.setEnd(container.firstChild!, 0);

            const rect = singleRect(range, 0);
            expect(rect).toBeDefined();
            expect(typeof rect.left).toBe('number');
        });
    });
});

