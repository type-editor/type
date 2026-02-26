import {describe, expect, it} from 'vitest';
import {StepMap} from '@src/change-map/StepMap';
import {Mapping} from '@src/change-map/Mapping';

describe("Mapping Edge Cases", () => {
    it("handles empty mirror array efficiently", () => {
        // Create a mapping with an empty mirror array
        const mapping = new Mapping([new StepMap([2, 0, 4])], [], 0, 1);

        // Should use fast path (simple loop) not slow _map() path
        // This tests the bug fix: empty array should not trigger mirror logic
        expect(mapping.map(0, 1)).toBe(0);
        expect(mapping.map(2, 1)).toBe(6);
        expect(mapping.map(2, -1)).toBe(2);
        expect(mapping.map(3, 1)).toBe(7);
    });

    it("handles undefined mirror array", () => {
        // Create a mapping with undefined mirror array
        const mapping = new Mapping([new StepMap([2, 0, 4])], undefined, 0, 1);

        // Should use fast path (simple loop)
        expect(mapping.map(0, 1)).toBe(0);
        expect(mapping.map(2, 1)).toBe(6);
        expect(mapping.map(2, -1)).toBe(2);
        expect(mapping.map(3, 1)).toBe(7);
    });

    it("handles actual mirrors correctly", () => {
        // Create a mapping with actual mirror relationships
        const stepMaps = [
            new StepMap([2, 4, 0]),  // delete 4 chars at pos 2
            new StepMap([2, 0, 4])   // insert 4 chars at pos 2
        ];
        const mapping = new Mapping(stepMaps, undefined, 0, 2);

        // Set up mirror relationship
        mapping.setMirror(0, 1);

        // Should use _map() path with mirror recovery
        expect(mapping.map(0, 1)).toBe(0);
        expect(mapping.map(2, 1)).toBe(2);
        expect(mapping.map(4, 1)).toBe(4);
        expect(mapping.map(6, 1)).toBe(6);
    });

    it("getMirror returns undefined when no mirror exists", () => {
        const mapping = new Mapping([new StepMap([2, 0, 4])]);

        // Should return undefined (explicit)
        expect(mapping.getMirror(0)).toBe(undefined);
        expect(mapping.getMirror(1)).toBe(undefined);
    });

    it("getMirror returns correct mirror offset when it exists", () => {
        const mapping = new Mapping([
            new StepMap([2, 4, 0]),
            new StepMap([2, 0, 4])
        ]);

        mapping.setMirror(0, 1);

        expect(mapping.getMirror(0)).toBe(1);
        expect(mapping.getMirror(1)).toBe(0);
    });
});

