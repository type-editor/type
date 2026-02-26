import {describe, it, beforeEach} from 'vitest';
import ist from 'ist';
import {combineUpdates} from "@src/menubar/util/combine-updates";
import {doc, p, schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';

describe("combineUpdates", () => {
    let state: EditorState;

    beforeEach(() => {
        state = EditorState.create({ doc: doc(p("hello")), schema });
    });

    describe("basic functionality", () => {
        it("should return a function", () => {
            const combined = combineUpdates([], []);
            ist(typeof combined, "function");
        });

        it("should return false when no updates return true", () => {
            const updates = [
                () => false,
                () => false,
            ];
            const nodes = [
                document.createElement('div'),
                document.createElement('div'),
            ];

            const combined = combineUpdates(updates, nodes);
            const result = combined(state);

            ist(result, false);
        });

        it("should return true when at least one update returns true", () => {
            const updates = [
                () => false,
                () => true,
            ];
            const nodes = [
                document.createElement('div'),
                document.createElement('div'),
            ];

            const combined = combineUpdates(updates, nodes);
            const result = combined(state);

            ist(result, true);
        });

        it("should return true when all updates return true", () => {
            const updates = [
                () => true,
                () => true,
            ];
            const nodes = [
                document.createElement('div'),
                document.createElement('div'),
            ];

            const combined = combineUpdates(updates, nodes);
            const result = combined(state);

            ist(result, true);
        });
    });

    describe("visibility management", () => {
        it("should hide nodes when update returns false", () => {
            const node1 = document.createElement('div');
            const node2 = document.createElement('div');

            const updates = [
                () => false,
                () => true,
            ];
            const nodes = [node1, node2];

            const combined = combineUpdates(updates, nodes);
            combined(state);

            ist(node1.style.display, "none");
            ist(node2.style.display, "");
        });

        it("should show nodes when update returns true", () => {
            const node1 = document.createElement('div');
            const node2 = document.createElement('div');
            node1.style.display = 'none';
            node2.style.display = 'none';

            const updates = [
                () => true,
                () => true,
            ];
            const nodes = [node1, node2];

            const combined = combineUpdates(updates, nodes);
            combined(state);

            ist(node1.style.display, "");
            ist(node2.style.display, "");
        });

        it("should handle mixed visibility states", () => {
            const node1 = document.createElement('div');
            const node2 = document.createElement('div');
            const node3 = document.createElement('div');

            const updates = [
                () => true,
                () => false,
                () => true,
            ];
            const nodes = [node1, node2, node3];

            const combined = combineUpdates(updates, nodes);
            combined(state);

            ist(node1.style.display, "");
            ist(node2.style.display, "none");
            ist(node3.style.display, "");
        });
    });

    describe("state passing", () => {
        it("should pass state to each update function", () => {
            const receivedStates: EditorState[] = [];

            const updates = [
                (s: EditorState) => { receivedStates.push(s); return true; },
                (s: EditorState) => { receivedStates.push(s); return true; },
            ];
            const nodes = [
                document.createElement('div'),
                document.createElement('div'),
            ];

            const combined = combineUpdates(updates, nodes);
            combined(state);

            ist(receivedStates.length, 2);
            ist(receivedStates[0], state);
            ist(receivedStates[1], state);
        });
    });

    describe("edge cases", () => {
        it("should handle empty arrays", () => {
            const combined = combineUpdates([], []);
            const result = combined(state);

            ist(result, false);
        });

        it("should handle single update", () => {
            const node = document.createElement('div');
            const updates = [() => true];
            const nodes = [node];

            const combined = combineUpdates(updates, nodes);
            const result = combined(state);

            ist(result, true);
            ist(node.style.display, "");
        });

        it("should handle missing node gracefully", () => {
            const updates = [
                () => true,
                () => false,
            ];
            const nodes: HTMLElement[] = [
                document.createElement('div'),
                // Missing second node (undefined-like scenario via type assertion)
            ];

            // Force an array with a missing element
            (nodes as any)[1] = undefined;

            const combined = combineUpdates(updates, nodes);
            // Should not throw
            const result = combined(state);

            ist(result, true);
        });

        it("should handle many updates efficiently", () => {
            const updates: Array<() => boolean> = [];
            const nodes: HTMLElement[] = [];

            for (let i = 0; i < 100; i++) {
                updates.push(() => i % 2 === 0);
                nodes.push(document.createElement('div'));
            }

            const combined = combineUpdates(updates, nodes);
            const result = combined(state);

            ist(result, true);
            // Check that visibility was set correctly
            for (let i = 0; i < 100; i++) {
                const expectedDisplay = i % 2 === 0 ? "" : "none";
                ist(nodes[i].style.display, expectedDisplay);
            }
        });
    });
});
