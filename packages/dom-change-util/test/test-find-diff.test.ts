import {describe, it, expect} from 'vitest';
import {Fragment} from '@type-editor/model';
import {findDiff} from '@src/dom-change/parse-change/find-diff';
import {schema} from '@type-editor/test-builder';

describe("findDiff", () => {
    describe("identical fragments", () => {
        it("returns null for identical text", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("hello"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');
            expect(diff).toBeNull();
        });

        it("returns null for identical complex fragments", () => {
            const oldFrag = Fragment.from([
                schema.text("hello "),
                schema.text("world", [schema.marks.em.create()])
            ]);
            const newFrag = Fragment.from([
                schema.text("hello "),
                schema.text("world", [schema.marks.em.create()])
            ]);

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');
            expect(diff).toBeNull();
        });
    });

    describe("insertions", () => {
        it("detects text insertion at start", () => {
            const oldFrag = Fragment.from(schema.text("world"));
            const newFrag = Fragment.from(schema.text("hello world"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(0);
            expect(diff?.endA).toBe(0);
            expect(diff?.endB).toBe(6);
        });

        it("detects text insertion at end", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("hello world"));

            const diff = findDiff(oldFrag, newFrag, 0, 6, 'end');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(5);
            expect(diff?.endA).toBe(5);
            expect(diff?.endB).toBe(11);
        });

        it("detects text insertion in middle", () => {
            const oldFrag = Fragment.from(schema.text("hllo"));
            const newFrag = Fragment.from(schema.text("hello"));

            const diff = findDiff(oldFrag, newFrag, 0, 2, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBeLessThanOrEqual(2);
            expect(diff?.endB).toBeGreaterThan(diff?.endA!);
        });

        it("detects insertion of single character", () => {
            const oldFrag = Fragment.from(schema.text("ab"));
            const newFrag = Fragment.from(schema.text("acb"));

            const diff = findDiff(oldFrag, newFrag, 0, 1, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.endB).toBe(diff?.endA! + 1);
        });
    });

    describe("deletions", () => {
        it("detects text deletion at start", () => {
            const oldFrag = Fragment.from(schema.text("hello world"));
            const newFrag = Fragment.from(schema.text("world"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(0);
            expect(diff?.endA).toBe(6);
            expect(diff?.endB).toBe(0);
        });

        it("detects text deletion at end", () => {
            const oldFrag = Fragment.from(schema.text("hello world"));
            const newFrag = Fragment.from(schema.text("hello"));

            const diff = findDiff(oldFrag, newFrag, 0, 6, 'end');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(5);
            expect(diff?.endA).toBe(11);
            expect(diff?.endB).toBe(5);
        });

        it("detects text deletion in middle", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("hllo"));

            const diff = findDiff(oldFrag, newFrag, 0, 2, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.endA).toBeGreaterThan(diff?.endB!);
        });

        it("detects deletion of all text", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.empty;

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(0);
            expect(diff?.endA).toBe(5);
            expect(diff?.endB).toBe(0);
        });
    });

    describe("replacements", () => {
        it("detects text replacement", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("world"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(0);
        });

        it("detects partial replacement", () => {
            const oldFrag = Fragment.from(schema.text("hello world"));
            const newFrag = Fragment.from(schema.text("hello there"));

            const diff = findDiff(oldFrag, newFrag, 0, 6, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(6);
        });
    });

    describe("preferred position handling", () => {
        it("biases diff toward preferred position with 'start' side", () => {
            const oldFrag = Fragment.from(schema.text("aaa"));
            const newFrag = Fragment.from(schema.text("aaaa"));

            // Preferred position at start
            const diffStart = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diffStart).not.toBeNull();
            expect(diffStart?.start).toBe(0);
        });

        it("biases diff toward preferred position with 'end' side", () => {
            const oldFrag = Fragment.from(schema.text("aaa"));
            const newFrag = Fragment.from(schema.text("aaaa"));

            // Preferred position at end
            const diffEnd = findDiff(oldFrag, newFrag, 0, 3, 'end');

            expect(diffEnd).not.toBeNull();
        });

        it("handles preferred position in middle of change", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("hXello"));

            const diff = findDiff(oldFrag, newFrag, 0, 2, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBeLessThanOrEqual(2);
        });
    });

    describe("position offset", () => {
        it("applies position offset to diff results", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("world"));

            const offset = 10;
            const diff = findDiff(oldFrag, newFrag, offset, offset, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBeGreaterThanOrEqual(offset);
        });

        it("maintains offset across complex changes", () => {
            const oldFrag = Fragment.from(schema.text("ab"));
            const newFrag = Fragment.from(schema.text("abc"));

            const offset = 5;
            const diff = findDiff(oldFrag, newFrag, offset, offset + 2, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBeGreaterThanOrEqual(offset);
        });
    });

    describe("emoji and surrogate pairs", () => {
        it("handles emoji insertion", () => {
            const oldFrag = Fragment.from(schema.text("hello"));
            const newFrag = Fragment.from(schema.text("hello😀"));

            const diff = findDiff(oldFrag, newFrag, 0, 5, 'end');

            expect(diff).not.toBeNull();
            // Emoji are represented as surrogate pairs
            expect(diff?.start).toBe(5);
        });

        it("handles emoji deletion", () => {
            const oldFrag = Fragment.from(schema.text("hello😀"));
            const newFrag = Fragment.from(schema.text("hello"));

            const diff = findDiff(oldFrag, newFrag, 0, 5, 'end');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(5);
        });

        it("doesn't split surrogate pairs at boundaries", () => {
            const oldFrag = Fragment.from(schema.text("ab"));
            const newFrag = Fragment.from(schema.text("a😀b"));

            const diff = findDiff(oldFrag, newFrag, 0, 1, 'start');

            expect(diff).not.toBeNull();
            // Should not split the emoji
            const changeLength = diff!.endB - diff!.endA;
            expect(changeLength).toBeGreaterThan(0);
        });
    });

    describe("multiple nodes", () => {
        it("handles fragments with multiple text nodes", () => {
            const oldFrag = Fragment.from([
                schema.text("hello"),
                schema.text(" world")
            ]);
            const newFrag = Fragment.from([
                schema.text("hello"),
                schema.text(" there")
            ]);

            const diff = findDiff(oldFrag, newFrag, 0, 6, 'start');

            expect(diff).not.toBeNull();
        });

        it("detects insertion spanning multiple nodes", () => {
            const oldFrag = Fragment.from([
                schema.text("a"),
                schema.text("b")
            ]);
            const newFrag = Fragment.from([
                schema.text("a"),
                schema.text("X"),
                schema.text("b")
            ]);

            const diff = findDiff(oldFrag, newFrag, 0, 1, 'start');

            expect(diff).not.toBeNull();
        });
    });

    describe("edge cases", () => {
        it("handles insertion at very beginning", () => {
            const oldFrag = Fragment.from(schema.text("text"));
            const newFrag = Fragment.from(schema.text("Xtext"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(0);
            expect(diff?.endA).toBe(0);
            expect(diff?.endB).toBe(1);
        });

        it("handles deletion at very beginning", () => {
            const oldFrag = Fragment.from(schema.text("Xtext"));
            const newFrag = Fragment.from(schema.text("text"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
            expect(diff?.start).toBe(0);
            expect(diff?.endA).toBe(1);
            expect(diff?.endB).toBe(0);
        });

        it("handles very small fragments", () => {
            const oldFrag = Fragment.from(schema.text("a"));
            const newFrag = Fragment.from(schema.text("b"));

            const diff = findDiff(oldFrag, newFrag, 0, 0, 'start');

            expect(diff).not.toBeNull();
        });

        it("returns valid diff for whitespace-only changes", () => {
            const oldFrag = Fragment.from(schema.text("hello world"));
            const newFrag = Fragment.from(schema.text("hello  world"));

            const diff = findDiff(oldFrag, newFrag, 0, 6, 'start');

            expect(diff).not.toBeNull();
        });
    });
});

