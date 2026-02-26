import {describe, it, expect, beforeEach} from 'vitest';
import {scrollStack} from '@src/dom-coords/util/scroll-stack';
import {restoreScrollStack} from '@src/dom-coords/util/restore-scroll-stack';
import type {ScrollPos} from '@src/types/dom-coords/ScrollPos';

describe("scrollStack", () => {
    describe("basic functionality", () => {
        it("returns an array of scroll positions", () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            const stack = scrollStack(element);

            expect(Array.isArray(stack)).toBe(true);
            expect(stack.length).toBeGreaterThan(0);
        });

        it("includes scroll positions for the element itself", () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            const stack = scrollStack(element);

            expect(stack[0].dom).toBe(element);
            expect(typeof stack[0].top).toBe('number');
            expect(typeof stack[0].left).toBe('number');
        });

        it("captures zero scroll positions for non-scrolled elements", () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            const stack = scrollStack(element);

            expect(stack[0].top).toBe(0);
            expect(stack[0].left).toBe(0);
        });
    });

    describe("scrolled elements", () => {
        it("captures non-zero scroll positions", () => {
            const container = document.createElement('div');
            container.style.width = '100px';
            container.style.height = '100px';
            container.style.overflow = 'scroll';

            const content = document.createElement('div');
            content.style.width = '200px';
            content.style.height = '200px';
            container.appendChild(content);
            document.body.appendChild(container);

            container.scrollTop = 50;
            container.scrollLeft = 25;

            const stack = scrollStack(content);

            const containerEntry = stack.find(item => item.dom === container);
            expect(containerEntry).toBeDefined();
            expect(containerEntry?.top).toBe(50);
            expect(containerEntry?.left).toBe(25);
        });
    });

    describe("ancestor traversal", () => {
        it("includes parent elements in stack", () => {
            const parent = document.createElement('div');
            const child = document.createElement('div');
            parent.appendChild(child);
            document.body.appendChild(parent);

            const stack = scrollStack(child);

            expect(stack.some(item => item.dom === child)).toBe(true);
            expect(stack.some(item => item.dom === parent)).toBe(true);
        });

        it("stops at document", () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            const stack = scrollStack(element);

            // Stack should not continue beyond document
            const lastItem = stack[stack.length - 1];
            expect(
                lastItem.dom === document as any ||
                lastItem.dom === document.documentElement
            ).toBe(true);
        });

        it("handles nested elements", () => {
            const grandparent = document.createElement('div');
            const parent = document.createElement('div');
            const child = document.createElement('div');

            grandparent.appendChild(parent);
            parent.appendChild(child);
            document.body.appendChild(grandparent);

            const stack = scrollStack(child);

            expect(stack.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe("edge cases", () => {
        it("handles text nodes", () => {
            const container = document.createElement('div');
            container.textContent = 'Test';
            document.body.appendChild(container);

            const textNode = container.firstChild!;
            const stack = scrollStack(textNode);

            expect(Array.isArray(stack)).toBe(true);
            expect(stack.length).toBeGreaterThan(0);
        });

        it("handles elements not in document", () => {
            const element = document.createElement('div');

            const stack = scrollStack(element);

            expect(Array.isArray(stack)).toBe(true);
        });
    });
});

describe("restoreScrollStack", () => {
    describe("basic restoration", () => {
        it("restores scroll positions from stack", () => {
            const element = document.createElement('div');
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.overflow = 'scroll';

            const content = document.createElement('div');
            content.style.width = '200px';
            content.style.height = '200px';
            element.appendChild(content);
            document.body.appendChild(element);

            element.scrollTop = 50;
            element.scrollLeft = 25;

            const stack: ScrollPos[] = [{
                dom: element,
                top: 50,
                left: 25
            }];

            // Change scroll position
            element.scrollTop = 0;
            element.scrollLeft = 0;

            // Restore
            restoreScrollStack(stack, 0);

            expect(element.scrollTop).toBe(50);
            expect(element.scrollLeft).toBe(25);
        });

        it("applies deltaTop adjustment", () => {
            const element = document.createElement('div');
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.overflow = 'scroll';

            const content = document.createElement('div');
            content.style.width = '200px';
            content.style.height = '200px';
            element.appendChild(content);
            document.body.appendChild(element);

            const stack: ScrollPos[] = [{
                dom: element,
                top: 50,
                left: 25
            }];

            restoreScrollStack(stack, 10);

            expect(element.scrollTop).toBe(60); // 50 + 10
            expect(element.scrollLeft).toBe(25);
        });

        it("handles negative deltaTop", () => {
            const element = document.createElement('div');
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.overflow = 'scroll';

            const content = document.createElement('div');
            content.style.width = '200px';
            content.style.height = '200px';
            element.appendChild(content);
            document.body.appendChild(element);

            const stack: ScrollPos[] = [{
                dom: element,
                top: 50,
                left: 25
            }];

            restoreScrollStack(stack, -20);

            expect(element.scrollTop).toBe(30); // 50 - 20
            expect(element.scrollLeft).toBe(25);
        });
    });

    describe("optimization", () => {
        it("only updates changed scroll positions", () => {
            const element = document.createElement('div');
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.overflow = 'scroll';

            const content = document.createElement('div');
            content.style.width = '200px';
            content.style.height = '200px';
            element.appendChild(content);
            document.body.appendChild(element);

            element.scrollTop = 50;
            element.scrollLeft = 25;

            const stack: ScrollPos[] = [{
                dom: element,
                top: 50,
                left: 25
            }];

            // Restore with same values - should still work
            restoreScrollStack(stack, 0);

            expect(element.scrollTop).toBe(50);
            expect(element.scrollLeft).toBe(25);
        });
    });

    describe("multiple elements", () => {
        it("restores scroll positions for multiple elements", () => {
            const parent = document.createElement('div');
            parent.style.width = '100px';
            parent.style.height = '100px';
            parent.style.overflow = 'scroll';

            const child = document.createElement('div');
            child.style.width = '100px';
            child.style.height = '100px';
            child.style.overflow = 'scroll';

            const content = document.createElement('div');
            content.style.width = '200px';
            content.style.height = '200px';

            child.appendChild(content);
            parent.appendChild(child);
            document.body.appendChild(parent);

            const stack: ScrollPos[] = [
                { dom: child, top: 30, left: 15 },
                { dom: parent, top: 50, left: 25 }
            ];

            restoreScrollStack(stack, 0);

            expect(child.scrollTop).toBe(30);
            expect(child.scrollLeft).toBe(15);
            expect(parent.scrollTop).toBe(50);
            expect(parent.scrollLeft).toBe(25);
        });

        it("applies deltaTop to all elements", () => {
            const elem1 = document.createElement('div');
            const elem2 = document.createElement('div');

            const stack: ScrollPos[] = [
                { dom: elem1, top: 10, left: 5 },
                { dom: elem2, top: 20, left: 10 }
            ];

            restoreScrollStack(stack, 5);

            expect(elem1.scrollTop).toBe(15);
            expect(elem2.scrollTop).toBe(25);
        });
    });

    describe("edge cases", () => {
        it("handles empty stack", () => {
            const stack: ScrollPos[] = [];

            expect(() => restoreScrollStack(stack, 0)).not.toThrow();
        });

        it("handles zero deltaTop", () => {
            const element = document.createElement('div');
            const stack: ScrollPos[] = [{
                dom: element,
                top: 50,
                left: 25
            }];

            restoreScrollStack(stack, 0);

            expect(element.scrollTop).toBe(50);
            expect(element.scrollLeft).toBe(25);
        });

        it("handles elements with no scroll capability", () => {
            const element = document.createElement('div');
            const stack: ScrollPos[] = [{
                dom: element,
                top: 50,
                left: 25
            }];

            expect(() => restoreScrollStack(stack, 0)).not.toThrow();
        });
    });
});

