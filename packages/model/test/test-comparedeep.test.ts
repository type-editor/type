import {describe, expect, it} from 'vitest';
import {compareDeep} from '@src/elements/util/compare-deep';

describe('compareDeep', () => {
    describe('primitives', () => {
        it('should compare equal numbers', () => {
            expect(compareDeep(1, 1)).toBe(true);
            expect(compareDeep(0, 0)).toBe(true);
        });

        it('should compare unequal numbers', () => {
            expect(compareDeep(1, 2)).toBe(false);
        });

        it('should handle NaN', () => {
            // Current behavior: NaN !== NaN, so this fails
            // Ideally should return true for NaN === NaN in deep comparison
            expect(compareDeep(NaN, NaN)).toBe(true);
        });

        it('should compare strings', () => {
            expect(compareDeep('hello', 'hello')).toBe(true);
            expect(compareDeep('hello', 'world')).toBe(false);
        });

        it('should compare booleans', () => {
            expect(compareDeep(true, true)).toBe(true);
            expect(compareDeep(false, false)).toBe(true);
            expect(compareDeep(true, false)).toBe(false);
        });

        it('should compare null and undefined', () => {
            expect(compareDeep(null, null)).toBe(true);
            expect(compareDeep(undefined, undefined)).toBe(true);
            expect(compareDeep(null, undefined)).toBe(false);
        });
    });

    describe('arrays', () => {
        it('should compare equal arrays', () => {
            expect(compareDeep([1, 2, 3], [1, 2, 3])).toBe(true);
        });

        it('should compare unequal arrays', () => {
            expect(compareDeep([1, 2], [1, 2, 3])).toBe(false);
            expect(compareDeep([1, 2], [2, 1])).toBe(false);
        });

        it('should compare nested arrays', () => {
            expect(compareDeep([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
            expect(compareDeep([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
        });

        it('should compare empty arrays', () => {
            expect(compareDeep([], [])).toBe(true);
        });
    });

    describe('objects', () => {
        it('should compare equal objects', () => {
            expect(compareDeep({a: 1, b: 2}, {a: 1, b: 2})).toBe(true);
        });

        it('should compare objects regardless of key order', () => {
            expect(compareDeep({a: 1, b: 2}, {b: 2, a: 1})).toBe(true);
        });

        it('should compare unequal objects', () => {
            expect(compareDeep({a: 1}, {a: 2})).toBe(false);
            expect(compareDeep({a: 1}, {a: 1, b: 2})).toBe(false);
        });

        it('should compare nested objects', () => {
            expect(compareDeep({a: {b: 1}}, {a: {b: 1}})).toBe(true);
            expect(compareDeep({a: {b: 1}}, {a: {b: 2}})).toBe(false);
        });

        it('should compare empty objects', () => {
            expect(compareDeep({}, {})).toBe(true);
        });
    });

    describe('mixed structures', () => {
        it('should compare complex nested structures', () => {
            const obj1 = {a: [1, 2, {b: 3}], c: {d: [4, 5]}};
            const obj2 = {a: [1, 2, {b: 3}], c: {d: [4, 5]}};
            expect(compareDeep(obj1, obj2)).toBe(true);
        });

        it('should detect differences in nested structures', () => {
            const obj1 = {a: [1, 2, {b: 3}], c: {d: [4, 5]}};
            const obj2 = {a: [1, 2, {b: 4}], c: {d: [4, 5]}};
            expect(compareDeep(obj1, obj2)).toBe(false);
        });

        it('should not compare array with object', () => {
            expect(compareDeep([], {})).toBe(false);
        });
    });

    describe('circular references', () => {
        it('should handle circular references without stack overflow', () => {
            const obj1: any = {a: 1};
            obj1.self = obj1;

            const obj2: any = {a: 1};
            obj2.self = obj2;

            // This should not throw a stack overflow
            // Ideally should return true for structurally similar circular refs
            expect(() => compareDeep(obj1, obj2)).not.toThrow();
        });

        it('should handle circular references in arrays', () => {
            const arr1: any = [1, 2];
            arr1.push(arr1);

            const arr2: any = [1, 2];
            arr2.push(arr2);

            // This should not throw a stack overflow
            expect(() => compareDeep(arr1, arr2)).not.toThrow();
        });
    });

    describe('same reference', () => {
        it('should return true for same object reference', () => {
            const obj = {a: 1};
            expect(compareDeep(obj, obj)).toBe(true);
        });

        it('should return true for same array reference', () => {
            const arr = [1, 2, 3];
            expect(compareDeep(arr, arr)).toBe(true);
        });
    });
});

