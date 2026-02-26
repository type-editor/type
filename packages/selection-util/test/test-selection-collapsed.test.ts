import {describe, it, expect, beforeEach} from 'vitest';
import {selectionCollapsed} from '@src/selection/selection-collapsed';
import type {DOMSelectionRange} from '@type-editor/editor-types';

describe("selectionCollapsed", () => {
    describe("collapsed selection", () => {
        it("returns true when focus and anchor are at same position", () => {
            const container = document.createElement('div');
            container.textContent = 'Hello World';
            document.body.appendChild(container);

            const textNode = container.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 5,
                anchorNode: textNode,
                anchorOffset: 5
            };

            expect(selectionCollapsed(domSel)).toBe(true);
        });

        it("returns true when at position 0", () => {
            const container = document.createElement('div');
            container.textContent = 'Test';
            document.body.appendChild(container);

            const textNode = container.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 0,
                anchorNode: textNode,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(true);
        });

        it("returns true when at end of text", () => {
            const container = document.createElement('div');
            container.textContent = 'Test';
            document.body.appendChild(container);

            const textNode = container.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 4,
                anchorNode: textNode,
                anchorOffset: 4
            };

            expect(selectionCollapsed(domSel)).toBe(true);
        });
    });

    describe("non-collapsed selection", () => {
        it("returns false when focus and anchor differ in offset", () => {
            const container = document.createElement('div');
            container.textContent = 'Hello World';
            document.body.appendChild(container);

            const textNode = container.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 5,
                anchorNode: textNode,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });

        it("returns false when selecting multiple characters", () => {
            const container = document.createElement('div');
            container.textContent = 'Hello World';
            document.body.appendChild(container);

            const textNode = container.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 11,
                anchorNode: textNode,
                anchorOffset: 6
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });

        it("returns false when anchor and focus are in different nodes with content between", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span>Hello</span><span>World</span>';
            document.body.appendChild(container);

            const firstNode = container.firstChild!.firstChild!;
            const secondNode = container.lastChild!.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: secondNode,
                focusOffset: 3,
                anchorNode: firstNode,
                anchorOffset: 2
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });
    });

    describe("missing nodes", () => {
        it("returns false when focusNode is missing", () => {
            const domSel: DOMSelectionRange = {
                focusNode: null,
                focusOffset: 0,
                anchorNode: document.createElement('div'),
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });

        it("returns false when anchorNode is missing", () => {
            const domSel: DOMSelectionRange = {
                focusNode: document.createElement('div'),
                focusOffset: 0,
                anchorNode: null,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });

        it("returns false when both nodes are missing", () => {
            const domSel: DOMSelectionRange = {
                focusNode: null,
                focusOffset: 0,
                anchorNode: null,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });
    });

    describe("edge cases", () => {
        it("handles element nodes as focus/anchor", () => {
            const container = document.createElement('div');
            const child = document.createElement('span');
            container.appendChild(child);
            document.body.appendChild(container);

            const domSel: DOMSelectionRange = {
                focusNode: container,
                focusOffset: 0,
                anchorNode: container,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(true);
        });

        it("handles mixed element and text nodes", () => {
            const container = document.createElement('div');
            container.textContent = 'Text';
            document.body.appendChild(container);

            const textNode = container.firstChild!;

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 2,
                anchorNode: container,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(false);
        });

        it("works with empty text nodes", () => {
            const container = document.createElement('div');
            const textNode = document.createTextNode('');
            container.appendChild(textNode);
            document.body.appendChild(container);

            const domSel: DOMSelectionRange = {
                focusNode: textNode,
                focusOffset: 0,
                anchorNode: textNode,
                anchorOffset: 0
            };

            expect(selectionCollapsed(domSel)).toBe(true);
        });
    });
});

