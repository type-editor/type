import {describe, it, expect} from 'vitest';
import {Fragment, Schema} from '@type-editor/model';
import {isMarkChange} from '@src/dom-change/parse-change/is-mark-change';
import {schema, p, em, strong} from '@type-editor/test-builder';

describe("isMarkChange", () => {
    describe("empty fragments", () => {
        it("returns null for empty current fragment", () => {
            const prev = Fragment.from(schema.text("hello"));
            const cur = Fragment.empty;

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });

        it("returns null for empty previous fragment", () => {
            const cur = Fragment.from(schema.text("hello"));
            const prev = Fragment.empty;

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });

        it("returns null for both empty fragments", () => {
            const result = isMarkChange(Fragment.empty, Fragment.empty);
            expect(result).toBeNull();
        });
    });

    describe("mark additions", () => {
        it("detects adding a single mark", () => {
            const prev = Fragment.from(schema.text("hello"));
            const cur = Fragment.from(schema.text("hello", [schema.marks.em.create()]));

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('add');
            expect(result?.mark.type.name).toBe('em');
        });

        it("detects adding strong mark", () => {
            const prev = Fragment.from(schema.text("text"));
            const cur = Fragment.from(schema.text("text", [schema.marks.strong.create()]));

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('add');
            expect(result?.mark.type.name).toBe('strong');
        });

        it("returns null when adding multiple marks", () => {
            const prev = Fragment.from(schema.text("hello"));
            const cur = Fragment.from(schema.text("hello", [
                schema.marks.em.create(),
                schema.marks.strong.create()
            ]));

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });
    });

    describe("mark removals", () => {
        it("detects removing a single mark", () => {
            const prev = Fragment.from(schema.text("hello", [schema.marks.em.create()]));
            const cur = Fragment.from(schema.text("hello"));

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('remove');
            expect(result?.mark.type.name).toBe('em');
        });

        it("detects removing strong mark", () => {
            const prev = Fragment.from(schema.text("text", [schema.marks.strong.create()]));
            const cur = Fragment.from(schema.text("text"));

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('remove');
            expect(result?.mark.type.name).toBe('strong');
        });

        it("returns null when removing multiple marks", () => {
            const prev = Fragment.from(schema.text("hello", [
                schema.marks.em.create(),
                schema.marks.strong.create()
            ]));
            const cur = Fragment.from(schema.text("hello"));

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });
    });

    describe("mixed mark changes", () => {
        it("returns null when both adding and removing marks", () => {
            const prev = Fragment.from(schema.text("hello", [schema.marks.em.create()]));
            const cur = Fragment.from(schema.text("hello", [schema.marks.strong.create()]));

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });

        it("returns null when marks don't apply consistently", () => {
            // Create fragments with multiple children where marks don't apply uniformly
            const prev = Fragment.from([
                schema.text("hello"),
                schema.text("world", [schema.marks.em.create()])
            ]);
            const cur = Fragment.from([
                schema.text("hello", [schema.marks.em.create()]),
                schema.text("world")
            ]);

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });
    });

    describe("multiple children", () => {
        it("detects mark addition across multiple text nodes", () => {
            const prev = Fragment.from([
                schema.text("hello"),
                schema.text(" world")
            ]);
            const cur = Fragment.from([
                schema.text("hello", [schema.marks.em.create()]),
                schema.text(" world", [schema.marks.em.create()])
            ]);

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('add');
            expect(result?.mark.type.name).toBe('em');
        });

        it("detects mark removal across multiple text nodes", () => {
            const prev = Fragment.from([
                schema.text("hello", [schema.marks.strong.create()]),
                schema.text(" world", [schema.marks.strong.create()])
            ]);
            const cur = Fragment.from([
                schema.text("hello"),
                schema.text(" world")
            ]);

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('remove');
            expect(result?.mark.type.name).toBe('strong');
        });
    });

    describe("content changes", () => {
        it("returns null when text content changes", () => {
            const prev = Fragment.from(schema.text("hello"));
            const cur = Fragment.from(schema.text("world"));

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });

        it("returns null when text content changes with marks", () => {
            const prev = Fragment.from(schema.text("hello", [schema.marks.em.create()]));
            const cur = Fragment.from(schema.text("world", [schema.marks.em.create()]));

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });

        it("returns null when child count changes", () => {
            const prev = Fragment.from([
                schema.text("hello")
            ]);
            const cur = Fragment.from([
                schema.text("hello"),
                schema.text(" world")
            ]);

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });
    });

    describe("edge cases", () => {
        it("handles marks with attributes", () => {
            const linkMark = schema.marks.link.create({href: "http://example.com"});
            const prev = Fragment.from(schema.text("link"));
            const cur = Fragment.from(schema.text("link", [linkMark]));

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('add');
            expect(result?.mark.type.name).toBe('link');
        });

        it("handles code mark", () => {
            const prev = Fragment.from(schema.text("code"));
            const cur = Fragment.from(schema.text("code", [schema.marks.code.create()]));

            const result = isMarkChange(cur, prev);

            expect(result).not.toBeNull();
            expect(result?.type).toBe('add');
            expect(result?.mark.type.name).toBe('code');
        });

        it("handles marks that don't recreate the fragment correctly", () => {
            // This tests the validation step where we check if applying
            // the mark actually recreates the current fragment
            const prev = Fragment.from([
                schema.text("a"),
                schema.text("b")
            ]);
            const cur = Fragment.from([
                schema.text("a", [schema.marks.em.create()]),
                schema.text("c") // Different text
            ]);

            const result = isMarkChange(cur, prev);
            expect(result).toBeNull();
        });
    });
});

