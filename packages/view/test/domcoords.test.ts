import {afterEach, beforeEach, describe, expect, it,} from 'vitest';
import {JSDOM} from "jsdom";
import {schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';
import {EditorView} from '@src/EditorView';
import {
    coordsAtPos,
    focusPreventScroll,
    posAtCoords,
    resetScrollPos,
    scrollRectIntoView,
    storeScrollPos
} from '@type-editor/dom-coords-util';

describe("domcoords - Bug Fixes and Edge Cases", () => {
    let dom: JSDOM;
    let document: Document;
    let container: HTMLElement;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html lang="en"><body><div id="editor"></div></body></html>', {
            url: 'http://localhost',
            pretendToBeVisual: true
        });
        document = dom.window.document;
        container = document.getElementById('editor');
        global.document = document as any;
        global.window = dom.window as any;
        global.Node = dom.window.Node as any;
        global.Range = dom.window.Range as any;
        global.Selection = dom.window.Selection as any;
        global.getComputedStyle = dom.window.getComputedStyle as any;

        // Mock elementFromPoint which JSDOM doesn't implement
        if (!document.elementFromPoint) {
            document.elementFromPoint = function(_x: number, _y: number) {
                return container;
            } as any;
        }

        // Mock getBoundingClientRect for all elements
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = function(tagName: string) {
            const el = originalCreateElement(tagName);
            if (!el.getBoundingClientRect) {
                el.getBoundingClientRect = function() {
                    return {
                        left: 0, top: 0, right: 100, bottom: 20,
                        width: 100, height: 20, x: 0, y: 0,
                        toJSON: () => ({})
                    };
                };
            }
            if (!el.getClientRects) {
                el.getClientRects = function() {
                    const rect = this.getBoundingClientRect();
                    return [rect] as any;
                };
            }
            return el;
        } as any;

        // Mock Range methods
        const OriginalRange = dom.window.Range;
        dom.window.Range = class MockRange extends OriginalRange {
            getBoundingClientRect() {
                return {
                    left: 0, top: 0, right: 100, bottom: 20,
                    width: 100, height: 20, x: 0, y: 0,
                    toJSON: () => ({})
                } as DOMRect;
            }
            getClientRects() {
                const rect = this.getBoundingClientRect();
                return [rect] as any as DOMRectList;
            }
        } as any;
        global.Range = dom.window.Range as any;
    });

    afterEach(() => {
        if (container) {
            container.innerHTML = '';
        }
    });

    describe("Bug Fix: Detached Documents", () => {
        it("should handle detached document without crashing in scrollRectIntoView", () => {
            const detachedDoc = document.implementation.createHTMLDocument('test');
            const editorDiv = detachedDoc.createElement('div');
            editorDiv.textContent = 'Test content';
            detachedDoc.body.appendChild(editorDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Hello world')])
                ])
            });

            const view = new EditorView(editorDiv, {state});

            const rect = {left: 10, right: 100, top: 10, bottom: 30};

            // Should not crash even with detached document
            expect(() => {
                scrollRectIntoView(view, rect, editorDiv);
            }).not.toThrow();

            view.destroy();
        });

        it("should handle document with removed documentElement in windowRect", () => {
            const detachedDoc = document.implementation.createHTMLDocument('test');
            const editorDiv = detachedDoc.createElement('div');
            detachedDoc.body.appendChild(editorDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Test')])
                ])
            });

            const view = new EditorView(editorDiv, {state});

            // Remove documentElement to test edge case
            detachedDoc.documentElement.remove();

            const rect = {left: 0, right: 100, top: 0, bottom: 50};

            // Should not crash
            expect(() => {
                scrollRectIntoView(view, rect, editorDiv);
            }).not.toThrow();

            view.destroy();
        });

        it("should handle resetScrollPos with disconnected refDOM", () => {
            const refDOM = document.createElement('div');
            refDOM.textContent = 'Reference';
            // Don't append to document - leave it disconnected

            const stack = [{
                dom: document.createElement('div'),
                top: 0,
                left: 0
            }];

            // Should not crash with disconnected element
            expect(() => {
                resetScrollPos({refDOM, refTop: 10, stack});
            }).not.toThrow();
        });

        it("should handle resetScrollPos with undefined refDOM", () => {
            const stack = [{
                dom: document.createElement('div'),
                top: 0,
                left: 0
            }];

            // Should not crash with undefined refDOM
            expect(() => {
                resetScrollPos({refDOM: undefined as any, refTop: 10, stack});
            }).not.toThrow();
        });
    });

    describe("Bug Fix: Very Long Text Nodes (Performance Test)", () => {
        it("should handle text nodes with 1000+ characters efficiently", () => {
            const longText = 'a'.repeat(1000);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text(longText)])
                ])
            });

            const view = new EditorView(container, {state});

            const startTime = performance.now();

            // Test coordinate lookup in long text
            const coords = {left: 50, top: 10};
            const result = posAtCoords(view, coords);

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete in reasonable time (< 100ms for 1000 chars)
            expect(duration).toBeLessThan(100);
            expect(result).toBeDefined();

            view.destroy();
        });

        it("should handle text nodes with 10000+ characters using binary search", () => {
            const veryLongText = 'x'.repeat(10000);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text(veryLongText)])
                ])
            });

            const view = new EditorView(container, {state});

            const startTime = performance.now();

            const coords = {left: 100, top: 10};
            const result = posAtCoords(view, coords);

            const endTime = performance.now();
            const duration = endTime - startTime;

            // With binary search, should still be fast even for 10k chars
            expect(duration).toBeLessThan(200);
            expect(result).toBeDefined();

            view.destroy();
        });

        it("should handle short text nodes with linear search", () => {
            const shortText = 'Short';

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text(shortText)])
                ])
            });

            const view = new EditorView(container, {state});

            const coords = {left: 20, top: 10};
            const result = posAtCoords(view, coords);

            // Should work correctly for short text
            expect(result).toBeDefined();

            view.destroy();
        });
    });

    describe("Bug Fix: Documents with No lastChild", () => {
        it("should handle posAtCoords when node has no lastChild", () => {
            const emptyDiv = document.createElement('div');
            container.appendChild(emptyDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph')  // Empty paragraph, no text node
                ])
            });

            const view = new EditorView(emptyDiv, {state});

            const coords = {left: 10, top: 100};

            // Should not crash with empty document
            expect(() => {
                posAtCoords(view, coords);
            }).not.toThrow();

            view.destroy();
        });

        it("should handle empty document in coordsAtPos", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph')
                ])
            });

            const view = new EditorView(container, {state});

            // Should not crash on empty paragraph
            expect(() => {
                coordsAtPos(view, 1, 1);
            }).not.toThrow();

            view.destroy();
        });
    });

    describe("Bug Fix: Zero-Width/Height Elements", () => {
        it("should handle elements with zero width", () => {
            const zeroWidthDiv = document.createElement('div');
            zeroWidthDiv.style.width = '0px';
            zeroWidthDiv.style.height = '20px';
            container.appendChild(zeroWidthDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Test')])
                ])
            });

            const view = new EditorView(zeroWidthDiv, {state});

            // Should not crash or produce NaN/Infinity
            expect(() => {
                const rect = {left: 0, right: 0, top: 0, bottom: 20};
                scrollRectIntoView(view, rect, zeroWidthDiv);
            }).not.toThrow();

            view.destroy();
        });
    });

    describe("Bug Fix: Transform Scale Zero", () => {
        it("should handle elements with transform: scale(0)", () => {
            const scaledDiv = document.createElement('div');
            scaledDiv.style.transform = 'scale(0)';
            scaledDiv.style.width = '100px';
            scaledDiv.style.height = '100px';
            container.appendChild(scaledDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Scaled content')])
                ])
            });

            const view = new EditorView(scaledDiv, {state});

            // Should handle scale(0) without division by zero
            expect(() => {
                const rect = {left: 0, right: 0, top: 0, bottom: 0};
                scrollRectIntoView(view, rect, scaledDiv);
            }).not.toThrow();

            view.destroy();
        });
    });

    describe("Bug Fix: Empty Documents", () => {
        it("should handle completely empty document", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph')
                ])
            });

            const view = new EditorView(container, {state});

            expect(() => {
                coordsAtPos(view, 0, 1);
            }).not.toThrow();

            expect(() => {
                const coords = {left: 0, top: 0};
                posAtCoords(view, coords);
            }).not.toThrow();

            view.destroy();
        });

        it("should handle storeScrollPos with empty document", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph')
                ])
            });

            const view = new EditorView(container, {state});

            expect(() => {
                const scrollPos = storeScrollPos(view);
                expect(scrollPos).toBeDefined();
                expect(scrollPos.stack).toBeDefined();
            }).not.toThrow();

            view.destroy();
        });
    });

    describe("Bug Fix: Scroll Stack Infinite Loop Prevention", () => {
        it("should not create infinite loop in scrollStack", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Test content')])
                ])
            });

            const view = new EditorView(container, {state});

            const startTime = performance.now();

            // Should complete quickly without infinite loop
            expect(() => {
                const scrollPos = storeScrollPos(view);
                expect(scrollPos.stack.length).toBeGreaterThan(0);
            }).not.toThrow();

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete almost instantly (< 10ms)
            expect(duration).toBeLessThan(10);

            view.destroy();
        });

        it("should properly terminate at document element", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Content')])
                ])
            });

            const view = new EditorView(container, {state});

            const scrollPos = storeScrollPos(view);

            // Stack should have finite length
            expect(scrollPos.stack.length).toBeLessThan(100);
            expect(scrollPos.stack.length).toBeGreaterThan(0);

            view.destroy();
        });
    });

    describe("Bug Fix: Focus Without Scroll", () => {
        it("should handle focusPreventScroll with standard element", () => {
            const focusableDiv = document.createElement('div');
            focusableDiv.tabIndex = 0;
            container.appendChild(focusableDiv);

            expect(() => {
                focusPreventScroll(focusableDiv);
            }).not.toThrow();
        });

        it("should handle focusPreventScroll when element cannot be focused", () => {
            const nonFocusableDiv = document.createElement('div');
            container.appendChild(nonFocusableDiv);

            // Should not crash even if element can't receive focus
            expect(() => {
                focusPreventScroll(nonFocusableDiv);
            }).not.toThrow();
        });

        it("should handle focusPreventScroll on detached element", () => {
            const detachedDiv = document.createElement('div');
            detachedDiv.tabIndex = 0;

            // Should not crash with detached element
            expect(() => {
                focusPreventScroll(detachedDiv);
            }).not.toThrow();
        });
    });

    describe("Edge Case: Nested Scrollable Elements", () => {
        it("should handle multiple nested scrollable containers", () => {
            const outer = document.createElement('div');
            outer.style.overflow = 'scroll';
            outer.style.height = '200px';

            const middle = document.createElement('div');
            middle.style.overflow = 'scroll';
            middle.style.height = '150px';

            const inner = document.createElement('div');
            inner.style.height = '500px';

            outer.appendChild(middle);
            middle.appendChild(inner);
            container.appendChild(outer);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Nested content')])
                ])
            });

            const view = new EditorView(inner, {state});

            const rect = {left: 10, right: 100, top: 300, bottom: 320};

            // Should handle multiple scroll ancestors
            expect(() => {
                scrollRectIntoView(view, rect, inner);
            }).not.toThrow();

            view.destroy();
        });
    });

    describe("Edge Case: Fixed and Sticky Positioning", () => {
        it("should stop scrolling at fixed positioned elements", () => {
            const fixedDiv = document.createElement('div');
            fixedDiv.style.position = 'fixed';
            fixedDiv.style.top = '0';

            const contentDiv = document.createElement('div');
            fixedDiv.appendChild(contentDiv);
            container.appendChild(fixedDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Fixed content')])
                ])
            });

            const view = new EditorView(contentDiv, {state});

            const rect = {left: 10, right: 100, top: 10, bottom: 30};

            expect(() => {
                scrollRectIntoView(view, rect, contentDiv);
            }).not.toThrow();

            view.destroy();
        });

        it("should stop scrolling at sticky positioned elements", () => {
            const stickyDiv = document.createElement('div');
            stickyDiv.style.position = 'sticky';
            stickyDiv.style.top = '10px';

            const contentDiv = document.createElement('div');
            stickyDiv.appendChild(contentDiv);
            container.appendChild(stickyDiv);

            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Sticky content')])
                ])
            });

            const view = new EditorView(contentDiv, {state});

            const rect = {left: 10, right: 100, top: 10, bottom: 30};

            expect(() => {
                scrollRectIntoView(view, rect, contentDiv);
            }).not.toThrow();

            view.destroy();
        });
    });

    describe("Edge Case: Coordinates at Document Boundaries", () => {
        it("should handle coordinates far outside document bounds", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Content')])
                ])
            });

            const view = new EditorView(container, {state});

            // Way outside bounds
            const coords = {left: -1000, top: -1000};
            const result = posAtCoords(view, coords);

            // Should return null for coordinates outside editor
            expect(result).toBeNull();

            view.destroy();
        });

        it("should handle coordinates at exact document edges", () => {
            const state = EditorState.create({
                doc: schema.node('doc', null, [
                    schema.node('paragraph', null, [schema.text('Edge content')])
                ])
            });

            const view = new EditorView(container, {state});

            const bounds = view.dom.getBoundingClientRect();

            // Test all four corners
            expect(() => {
                posAtCoords(view, {left: bounds.left, top: bounds.top});
                posAtCoords(view, {left: bounds.right, top: bounds.top});
                posAtCoords(view, {left: bounds.left, top: bounds.bottom});
                posAtCoords(view, {left: bounds.right, top: bounds.bottom});
            }).not.toThrow();

            view.destroy();
        });
    });
});

