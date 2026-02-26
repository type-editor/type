import {describe, expect, it} from 'vitest';
import {StepMap} from "@src/change-map/StepMap";

describe("StepMap Bug Tests", () => {
    it("constructor correctly returns singleton for empty maps", () => {
        // Verified: Constructor CAN return a different object in JavaScript/TypeScript
        // This is a valid pattern and works correctly!

        const empty1 = new StepMap([]);
        const empty2 = new StepMap([]);
        const emptySingleton = StepMap.empty;

        // All should be the same instance for efficiency (singleton pattern)
        expect(empty1 === empty2).toBe(true); // ✅ Works correctly
        expect(empty1 === emptySingleton).toBe(true); // ✅ Works correctly
        expect(empty2 === emptySingleton).toBe(true); // ✅ Works correctly
    });

    it("validates that ranges array length should be multiple of 3", () => {
        // FIXED: Now validation works correctly
        expect(() => new StepMap([1, 2])).toThrow(RangeError); // ✅ Now throws
        expect(() => new StepMap([1, 2, 3, 4])).toThrow(RangeError); // ✅ Now throws
        expect(() => new StepMap([1, 2, 3])).not.toThrow(); // Valid - should work
    });

    it("recover method validates recovery index is in bounds", () => {
        const stepMap = new StepMap([0, 5, 10]); // One range (index 0)

        // Valid recovery value for index 0
        const validRecover = 0 + 2 * Math.pow(2, 16); // index=0, offset=2
        expect(() => stepMap.recover(validRecover)).not.toThrow();

        // Invalid recovery value with index=5 (out of bounds)
        const invalidRecover = 5 + 2 * Math.pow(2, 16); // index=5 (too large)
        // FIXED: Now throws RangeError instead of returning NaN
        expect(() => stepMap.recover(invalidRecover)).toThrow(RangeError);
        expect(() => stepMap.recover(invalidRecover)).toThrow(/out of bounds/);
    });

    it("demonstrates recovery value encoding/decoding", () => {
        const stepMap = new StepMap([10, 5, 8]);

        // Test recovery value creation via mapResult
        const result = stepMap.mapResult(12, 1);

        if (result.recover !== null) {
            // Recovery value should be decodable
            const recovered = stepMap.recover(result.recover);
            expect(typeof recovered).toBe('number');
            expect(recovered).toBeGreaterThanOrEqual(0);
        }
    });

    it("empty map operations work correctly", () => {
        const empty = StepMap.empty;

        // Empty map should not change positions
        expect(empty.map(0, 1)).toBe(0);
        expect(empty.map(10, 1)).toBe(10);
        expect(empty.map(100, -1)).toBe(100);

        // Empty map inversions
        const inverted = empty.invert();
        expect(inverted.map(5, 1)).toBe(5);
    });

    it("offset method creates correct maps", () => {
        // Positive offset
        const offsetPlus = StepMap.offset(10);
        expect(offsetPlus.map(0, 1)).toBe(10);
        expect(offsetPlus.map(5, 1)).toBe(15);

        // Negative offset
        const offsetMinus = StepMap.offset(-5);
        expect(offsetMinus.map(10, 1)).toBe(5);
        expect(offsetMinus.map(7, 1)).toBe(2);

        // Zero offset should return empty singleton
        const offsetZero = StepMap.offset(0);
        expect(offsetZero === StepMap.empty).toBe(true); // This should work
    });

    it("handles deletion ranges correctly", () => {
        // Delete 5 characters at position 10
        const deleteMap = new StepMap([10, 5, 0]);

        // Positions before deletion
        expect(deleteMap.map(5, 1)).toBe(5);
        expect(deleteMap.map(9, 1)).toBe(9);

        // Position at deletion start
        expect(deleteMap.map(10, -1)).toBe(10); // Stay before
        expect(deleteMap.map(10, 1)).toBe(10);  // Move to deletion point

        // Positions in deleted range
        expect(deleteMap.map(12, 1)).toBe(10);
        expect(deleteMap.map(14, 1)).toBe(10);

        // Position at deletion end
        expect(deleteMap.map(15, -1)).toBe(10);
        expect(deleteMap.map(15, 1)).toBe(10);

        // Positions after deletion
        expect(deleteMap.map(16, 1)).toBe(11);
        expect(deleteMap.map(20, 1)).toBe(15);
    });

    it("handles insertion ranges correctly", () => {
        // Insert 5 characters at position 10
        const insertMap = new StepMap([10, 0, 5]);

        // Positions before insertion
        expect(insertMap.map(5, 1)).toBe(5);
        expect(insertMap.map(9, 1)).toBe(9);

        // Position at insertion point
        expect(insertMap.map(10, -1)).toBe(10);  // Stay before
        expect(insertMap.map(10, 1)).toBe(15);   // Move after

        // Positions after insertion
        expect(insertMap.map(11, 1)).toBe(16);
        expect(insertMap.map(20, 1)).toBe(25);
    });

    it("inverted maps work correctly", () => {
        const insertMap = new StepMap([10, 0, 5]);
        const deleteMap = insertMap.invert();

        // Inverted insert is delete
        // Original: insert 5 at pos 10
        // Inverted: delete 5 at pos 10

        expect(deleteMap.map(5, 1)).toBe(5);
        expect(deleteMap.map(15, 1)).toBe(10);  // After inserted content maps back
        expect(deleteMap.map(20, 1)).toBe(15);
    });
});

