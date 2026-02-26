import {describe, it, expect} from 'vitest';
import {shouldAdjustChangeStartToSelection} from '@src/dom-change/parse-change/should-adjust-change-start-to-selection';
import {shouldAdjustChangeEndToSelection} from '@src/dom-change/parse-change/should-adjust-change-end-to-selection';
import type {DocumentChange} from '@src/dom-change/types/dom-change/DocumentChange';
import {EditorState, SelectionFactory} from '@type-editor/state';
import {schema, doc, p} from '@type-editor/test-builder';

describe("shouldAdjustChangeStartToSelection", () => {
    const testDoc = doc(p("hello world"));

    it("returns true when change starts after selection within threshold", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 0);
        expect(result).toBe(true);
    });

    it("returns false when change starts at selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 1,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 0);
        expect(result).toBe(false);
    });

    it("returns false when change starts before selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 0,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 0);
        expect(result).toBe(false);
    });

    it("returns false when change starts too far after selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 8,
            endA: 10,
            endB: 11
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 0);
        expect(result).toBe(false);
    });

    it("returns false when selection is before parse range", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 10);
        expect(result).toBe(false);
    });

    it("handles change within 1 position", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 2,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 0);
        expect(result).toBe(true);
    });

    it("handles change exactly at threshold (2 positions)", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 5)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeStartToSelection(change, state.selection, 0);
        expect(result).toBe(true);
    });
});

describe("shouldAdjustChangeEndToSelection", () => {
    const testDoc = doc(p("hello world"));

    it("returns true when change ends before selection within threshold", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 9,
            endB: 10
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(true);
    });

    it("returns false when change ends at selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 10,
            endB: 11
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(false);
    });

    it("returns false when change ends after selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 12,
            endB: 13
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(false);
    });

    it("returns false when change ends too far before selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 6,
            endB: 7
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(false);
    });

    it("returns false when selection is after parse range", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 9,
            endB: 10
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 8);
        expect(result).toBe(false);
    });

    it("handles change within 1 position", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 9,
            endB: 10
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(true);
    });

    it("handles change exactly at threshold (2 positions)", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 1, 10)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 8,
            endB: 9
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(true);
    });

    it("handles collapsed selection", () => {
        const state = EditorState.create({
            doc: testDoc,
            selection: SelectionFactory.createTextSelection(testDoc, 5)
        });

        const change: DocumentChange = {
            start: 3,
            endA: 4,
            endB: 5
        };

        const result = shouldAdjustChangeEndToSelection(change, state.selection, 15);
        expect(result).toBe(true);
    });
});

