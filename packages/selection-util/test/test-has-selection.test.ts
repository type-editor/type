import {describe, it, expect, vi} from 'vitest';
import {hasSelection} from '@src/selection/has-selection';
import {hasFocusAndSelection} from '@src/selection/has-focus-and-selection';
import type {PmEditorView} from '@type-editor/editor-types';

describe("hasSelection", () => {
    describe("valid selections", () => {
        it("returns true when anchor is within editor", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(true);
        });

        it("returns true for collapsed selection within editor", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 2,
                    focusNode: textNode,
                    focusOffset: 2
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(true);
        });

        it("returns true when anchor parent is within editor", () => {
            const editorDiv = document.createElement('div');
            const span = document.createElement('span');
            const textNode = document.createTextNode('Hello');
            span.appendChild(textNode);
            editorDiv.appendChild(span);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(true);
        });
    });

    describe("invalid selections", () => {
        it("returns false when anchorNode is null", () => {
            const editorDiv = document.createElement('div');

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: null,
                    anchorOffset: 0,
                    focusNode: document.createTextNode('text'),
                    focusOffset: 0
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(false);
        });

        it("returns false when focusNode is null", () => {
            const editorDiv = document.createElement('div');

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: document.createTextNode('text'),
                    anchorOffset: 0,
                    focusNode: null,
                    focusOffset: 0
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(false);
        });

        it("returns false when anchor is outside editor", () => {
            const editorDiv = document.createElement('div');
            const outsideNode = document.createTextNode('outside');
            document.body.appendChild(editorDiv);
            document.body.appendChild(outsideNode);

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: outsideNode,
                    anchorOffset: 0,
                    focusNode: outsideNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(false);
        });
    });

    describe("non-editable views", () => {
        it("requires focus node to be within editor for non-editable views", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            const outsideNode = document.createTextNode('outside');
            document.body.appendChild(editorDiv);
            document.body.appendChild(outsideNode);

            const mockView = {
                dom: editorDiv,
                editable: false,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: outsideNode,
                    focusOffset: 0
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(false);
        });

        it("returns true when both anchor and focus are within editor for non-editable", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: false,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(true);
        });
    });

    describe("error handling", () => {
        it("returns false when accessing node properties throws error", () => {
            const editorDiv = document.createElement('div');

            const problematicNode = {
                get nodeType() {
                    throw new Error('Permission denied');
                }
            };

            const mockView = {
                dom: editorDiv,
                editable: true,
                domSelectionRange: () => ({
                    anchorNode: problematicNode as any,
                    anchorOffset: 0,
                    focusNode: problematicNode as any,
                    focusOffset: 0
                })
            } as unknown as PmEditorView;

            expect(hasSelection(mockView)).toBe(false);
        });
    });
});

describe("hasFocusAndSelection", () => {
    describe("editable view", () => {
        it("returns false when editable view lacks focus", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: true,
                hasFocus: () => false,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasFocusAndSelection(mockView)).toBe(false);
        });

        it("returns true when editable view has focus and selection", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: true,
                hasFocus: () => true,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasFocusAndSelection(mockView)).toBe(true);
        });

        it("returns false when editable view has focus but no selection", () => {
            const editorDiv = document.createElement('div');

            const mockView = {
                dom: editorDiv,
                editable: true,
                hasFocus: () => true,
                domSelectionRange: () => ({
                    anchorNode: null,
                    anchorOffset: 0,
                    focusNode: null,
                    focusOffset: 0
                })
            } as unknown as PmEditorView;

            expect(hasFocusAndSelection(mockView)).toBe(false);
        });
    });

    describe("non-editable view", () => {
        it("returns true when non-editable view has selection (focus not required)", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: false,
                hasFocus: () => false,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            expect(hasFocusAndSelection(mockView)).toBe(true);
        });

        it("returns false when non-editable view has no selection", () => {
            const editorDiv = document.createElement('div');

            const mockView = {
                dom: editorDiv,
                editable: false,
                hasFocus: () => false,
                domSelectionRange: () => ({
                    anchorNode: null,
                    anchorOffset: 0,
                    focusNode: null,
                    focusOffset: 0
                })
            } as unknown as PmEditorView;

            expect(hasFocusAndSelection(mockView)).toBe(false);
        });
    });

    describe("focus check delegation", () => {
        it("calls hasFocus for editable views", () => {
            const hasFocusSpy = vi.fn(() => true);
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: true,
                hasFocus: hasFocusSpy,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            hasFocusAndSelection(mockView);

            expect(hasFocusSpy).toHaveBeenCalled();
        });

        it("does not require hasFocus call for non-editable views", () => {
            const editorDiv = document.createElement('div');
            const textNode = document.createTextNode('Hello');
            editorDiv.appendChild(textNode);
            document.body.appendChild(editorDiv);

            const mockView = {
                dom: editorDiv,
                editable: false,
                domSelectionRange: () => ({
                    anchorNode: textNode,
                    anchorOffset: 0,
                    focusNode: textNode,
                    focusOffset: 5
                })
            } as unknown as PmEditorView;

            // Should not throw even without hasFocus method
            expect(hasFocusAndSelection(mockView)).toBe(true);
        });
    });
});

