import {describe, it, expect} from 'vitest';
import {inRect} from '@src/dom-coords/util/in-rect';
import type {Coords} from '@src/types/dom-coords/Coords';
import type {Rect} from '@src/types/dom-coords/Rect';

describe("inRect", () => {
    describe("inside rectangle", () => {
        it("returns true for coordinates in the center of rectangle", () => {
            const coords: Coords = {left: 50, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates at exact boundaries", () => {
            const coords: Coords = {left: 0, top: 0};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates at right/bottom boundaries", () => {
            const coords: Coords = {left: 100, top: 100};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates near top-left corner", () => {
            const coords: Coords = {left: 10, top: 10};
            const rect: Rect = {left: 5, right: 50, top: 5, bottom: 50};

            expect(inRect(coords, rect)).toBe(true);
        });
    });

    describe("tolerance handling", () => {
        it("returns true for coordinates 1 pixel outside left boundary (tolerance)", () => {
            const coords: Coords = {left: -1, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates 1 pixel outside right boundary (tolerance)", () => {
            const coords: Coords = {left: 101, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates 1 pixel outside top boundary (tolerance)", () => {
            const coords: Coords = {left: 50, top: -1};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates 1 pixel outside bottom boundary (tolerance)", () => {
            const coords: Coords = {left: 50, top: 101};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("returns true for coordinates exactly at tolerance threshold", () => {
            const coords: Coords = {left: -1, top: -1};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });
    });

    describe("outside rectangle", () => {
        it("returns false for coordinates far to the left", () => {
            const coords: Coords = {left: -10, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(false);
        });

        it("returns false for coordinates far to the right", () => {
            const coords: Coords = {left: 110, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(false);
        });

        it("returns false for coordinates far above", () => {
            const coords: Coords = {left: 50, top: -10};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(false);
        });

        it("returns false for coordinates far below", () => {
            const coords: Coords = {left: 50, top: 110};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(false);
        });

        it("returns false for coordinates beyond tolerance threshold (2 pixels)", () => {
            const coords: Coords = {left: -2, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(false);
        });
    });

    describe("edge cases", () => {
        it("handles zero-sized rectangle", () => {
            const coords: Coords = {left: 50, top: 50};
            const rect: Rect = {left: 50, right: 50, top: 50, bottom: 50};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("handles zero-sized rectangle with tolerance", () => {
            const coords: Coords = {left: 51, top: 51};
            const rect: Rect = {left: 50, right: 50, top: 50, bottom: 50};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("handles negative coordinates inside negative rectangle", () => {
            const coords: Coords = {left: -50, top: -50};
            const rect: Rect = {left: -100, right: -10, top: -100, bottom: -10};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("handles very large coordinates and rectangle", () => {
            const coords: Coords = {left: 10000, top: 10000};
            const rect: Rect = {left: 9000, right: 11000, top: 9000, bottom: 11000};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("handles floating point coordinates", () => {
            const coords: Coords = {left: 50.5, top: 50.5};
            const rect: Rect = {left: 0, right: 100, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("handles narrow rectangle (single line)", () => {
            const coords: Coords = {left: 50, top: 50};
            const rect: Rect = {left: 0, right: 100, top: 50, bottom: 50};

            expect(inRect(coords, rect)).toBe(true);
        });

        it("handles tall narrow rectangle", () => {
            const coords: Coords = {left: 50, top: 50};
            const rect: Rect = {left: 50, right: 50, top: 0, bottom: 100};

            expect(inRect(coords, rect)).toBe(true);
        });
    });
});

