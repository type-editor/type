import {describe, it, expect, beforeEach, vi} from 'vitest';
import {coordsAtPos} from '@src/dom-coords/coords-at-pos';
import type {PmEditorView} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

/**
 * Tests for coordsAtPos function, especially for zero-sized rect handling.
 * 
 * Recent changes (lines 46-52 and 107-140) added handling for:
 * 1. Zero-sized rects at end of text after newline (lines 46-52)
 * 2. Zero-sized rects from text nodes ending with newline (lines 109-128)
 * 3. Zero-height rects from elements like unloaded images (lines 136-141)
 */
describe('coordsAtPos', () => {
    describe('zero-sized rect handling', () => {
        let mockView: PmEditorView;
        let mockNode: Text;
        let mockContainer: HTMLElement;

        beforeEach(() => {
            // Create a text node and container
            mockContainer = document.createElement('div');
            mockNode = document.createTextNode('test\n');
            mockContainer.appendChild(mockNode);
            document.body.appendChild(mockContainer);

            // Create a basic mock view
            mockView = {
                docView: {
                    domFromPos: vi.fn(),
                },
                state: {
                    doc: {
                        resolve: vi.fn(),
                    },
                },
            } as any;
        });

        it('should handle zero-sized rect after newline by querying previous character', () => {
            // Mock domFromPos to return text node at position after newline
            (mockView.docView.domFromPos as any).mockReturnValue({
                node: mockNode,
                offset: 5, // Position after 'test\n'
                atom: null,
            });

            // Mock Range.getBoundingClientRect to return zero-sized rect for empty range
            const originalTextRange = Range.prototype.getBoundingClientRect;
            let callCount = 0;
            Range.prototype.getBoundingClientRect = function() {
                callCount++;
                // First call: empty range at end returns zero-sized rect
                if (callCount === 1) {
                    return new DOMRect(100, 0, 0, 0); // zero-sized
                }
                // Second call: range with previous character returns proper rect
                return new DOMRect(100, 50, 10, 20);
            };

            const rect = coordsAtPos(mockView, 5, 1);

            // Should have fallen back to querying previous character.
            // flattenV(rect, false) uses rect.right as the cursor x-coordinate.
            // DOMRect(100, 50, 10, 20) has right = 100 + 10 = 110.
            expect(rect.top).toBe(50);
            expect(rect.bottom).toBe(70);
            expect(rect.left).toBe(110);

            Range.prototype.getBoundingClientRect = originalTextRange;
        });

        it('should estimate next line position when last character is newline', () => {
            // Create text node ending with newline
            const textNode = document.createTextNode('line1\n');
            mockContainer.appendChild(textNode);

            (mockView.docView.domFromPos as any).mockReturnValue({
                node: mockContainer,
                offset: 1, // After the text node
                atom: null,
            });

            const mockResolvedPos: Partial<ResolvedPos> = {
                parent: {
                    inlineContent: true,
                } as any,
            };
            (mockView.state.doc.resolve as any).mockReturnValue(mockResolvedPos);

            // Mock Range.getClientRects and getBoundingClientRect to simulate behavior
            let getBoundingCallCount = 0;
            const originalGetBoundingClientRect = Range.prototype.getBoundingClientRect;
            const originalGetClientRects = Range.prototype.getClientRects;
            
            Range.prototype.getClientRects = function() {
                // Return empty rects to force use of getBoundingClientRect
                return [] as any;
            };
            
            Range.prototype.getBoundingClientRect = function() {
                getBoundingCallCount++;
                // First call: empty range at end returns zero-sized rect (top=0, bottom=0)
                if (getBoundingCallCount === 1) {
                    return new DOMRect(100, 0, 0, 0); // zero-sized triggers fallback
                }
                // Second call: range with last character (the newline)
                if (getBoundingCallCount === 2) {
                    return new DOMRect(50, 100, 10, 20);
                }
                // Third call: start of line for left coordinate
                return new DOMRect(10, 100, 10, 20);
            };

            const rect = coordsAtPos(mockView, 5, -1);

            // Should estimate next line position at start of line
            expect(rect.top).toBe(120); // previous bottom
            expect(rect.bottom).toBe(140); // previous bottom + line height
            expect(rect.left).toBe(10); // start of line

            Range.prototype.getBoundingClientRect = originalGetBoundingClientRect;
            Range.prototype.getClientRects = originalGetClientRects;
        });

        it('documents zero-height element handling (lines 136-141)', () => {
            /**
             * This test documents the behavior added in lines 136-141 for handling
             * zero-height rects from elements (e.g., unloaded images, BR elements).
             * 
             * The code checks:
             * - if (rect.top === rect.bottom && before.nodeType === ELEMENT_NODE)
             * 
             * When detected, it calls getBoundingClientRect() directly on the element,
             * which may return better dimensions than getClientRects().
             * 
             * This is difficult to test with a mock ProseMirror view, but the logic
             * is exercised in real editor usage when:
             * - Images haven't loaded yet
             * - BR elements are used as trailing hack
             * - Other elements temporarily have zero height
             */
            
            // At minimum verify the function handles basic cases without crashing
            (mockView.docView.domFromPos as any).mockReturnValue({
                node: mockNode,
                offset: 0,
                atom: null,
            });

            const rect = coordsAtPos(mockView, 0, 1);
            
            // Should return a valid rect structure
            expect(typeof rect.top).toBe('number');
            expect(typeof rect.bottom).toBe('number');
            expect(typeof rect.left).toBe('number');
            expect(typeof rect.right).toBe('number');
        });

        it('should not fall back to previous character when offset is 0', () => {
            (mockView.docView.domFromPos as any).mockReturnValue({
                node: mockNode,
                offset: 0, // At start
                atom: null,
            });

            // Mock to return zero-sized rect
            Range.prototype.getBoundingClientRect = function() {
                return new DOMRect(100, 0, 0, 0); // zero-sized
            };

            const rect = coordsAtPos(mockView, 0, 1);

            // Should return the zero-sized rect without trying to query previous character
            // (since offset is 0, there's no previous character)
            expect(rect.top).toBe(0);
            expect(rect.bottom).toBe(0);

            Range.prototype.getBoundingClientRect = (Range.prototype.getBoundingClientRect as any).__original || (() => new DOMRect());
        });
    });

    describe('text node handling', () => {
        let mockView: PmEditorView;
        let mockNode: Text;

        beforeEach(() => {
            mockNode = document.createTextNode('hello world');
            document.body.appendChild(mockNode);

            mockView = {
                docView: {
                    domFromPos: vi.fn(),
                },
                state: {
                    doc: {
                        resolve: vi.fn(),
                    },
                },
            } as any;
        });

        it('should handle text node with normal sized rect', () => {
            (mockView.docView.domFromPos as any).mockReturnValue({
                node: mockNode,
                offset: 5,
                atom: null,
            });

            Range.prototype.getBoundingClientRect = function() {
                return new DOMRect(50, 100, 10, 20); // Normal sized rect
            };

            const rect = coordsAtPos(mockView, 5, 1);

            expect(rect.top).toBe(100);
            expect(rect.bottom).toBe(120);
            expect(typeof rect.left).toBe('number');
            expect(typeof rect.right).toBe('number');

            Range.prototype.getBoundingClientRect = (Range.prototype.getBoundingClientRect as any).__original || (() => new DOMRect());
        });
    });
});
