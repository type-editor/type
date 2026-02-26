import {isUndefinedOrNull} from '@type-editor/commons';

/**
 * Performs a deep equality comparison between two values.
 *
 * This function recursively compares objects and arrays by their structure and content,
 * rather than by reference. It supports nested structures and handles various data types
 * including primitives, arrays, and plain objects.
 *
 * **Comparison behavior:**
 * - Primitives are compared using Object.is (handles NaN correctly)
 * - Arrays are compared element-by-element (order matters)
 * - Objects are compared property-by-property (order doesn't matter)
 * - null and undefined are compared using strict equality
 * - Circular references are detected and handled safely
 *
 * **Note:** This function is designed for comparing plain objects and arrays typically used
 * in ProseMirror attributes. It does not handle special object types like Date, RegExp,
 * Map, Set, or custom class instances.
 *
 * @template T - The type of values being compared
 * @param value1 - The first value to compare
 * @param value2 - The second value to compare
 * @returns `true` if the values are deeply equal, `false` otherwise
 *
 * @example
 * ```typescript
 * compareDeep(1, 1) // true
 * compareDeep([1, 2], [1, 2]) // true
 * compareDeep({a: 1}, {a: 1}) // true
 * compareDeep({a: 1}, {a: 2}) // false
 * compareDeep([1, 2], [2, 1]) // false
 * compareDeep(NaN, NaN) // true
 * ```
 */
export function compareDeep<T>(value1: T, value2: T): boolean {
    return compareDeepWithTracking(value1, value2, new Map());
}

/**
 * Internal comparison function with circular reference tracking.
 *
 * @param value1 - The first value to compare
 * @param value2 - The second value to compare
 * @param seen - Map tracking visited object pairs to detect circular references
 * @returns `true` if the values are deeply equal, `false` otherwise
 */
function compareDeepWithTracking<T>(value1: T, value2: T, seen: Map<unknown, Set<unknown>>): boolean {
    // Fast path: identical references or equal primitives (including NaN)
    if (Object.is(value1, value2)) {
        return true;
    }

    // If either value is not an object (including null), they must be equal (already checked)
    if (typeof value1 !== 'object' || typeof value2 !== 'object' || isUndefinedOrNull(value1) || isUndefinedOrNull(value2)) {
        return false;
    }

    // Check for circular references
    if (seen.has(value1)) {
        // If we've seen value1 before, check if it was paired with value2
        return seen.get(value1).has(value2);
    }

    // Track this comparison to prevent infinite recursion
    if (!seen.has(value1)) {
        seen.set(value1, new Set());
    }
    seen.get(value1).add(value2);

    // Check if both are arrays or both are objects
    const isArray1: boolean = Array.isArray(value1);
    const isArray2: boolean = Array.isArray(value2);

    if (isArray1 !== isArray2) {
        return false;
    }

    if (isArray1 && isArray2) {
        return compareArrays(value1 as Array<unknown>, value2 as Array<unknown>, seen);
    }

    return compareObjects(value1 as Record<string, unknown>, value2 as Record<string, unknown>, seen);
}

/**
 * Compares two arrays for deep equality.
 *
 * @param arr1 - The first array to compare
 * @param arr2 - The second array to compare
 * @param seen - Map tracking visited object pairs to detect circular references
 * @returns `true` if arrays have same length and all elements are deeply equal
 */
function compareArrays<T>(arr1: ReadonlyArray<T>, arr2: ReadonlyArray<T>, seen: Map<unknown, Set<unknown>>): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!compareDeepWithTracking(arr1[i], arr2[i], seen)) {
            return false;
        }
    }

    return true;
}

/**
 * Compares two plain objects for deep equality.
 *
 * Iterates through all enumerable properties of both objects and compares their values.
 * Both objects must have the same set of keys and all values must be deeply equal.
 *
 * @param obj1 - The first object to compare
 * @param obj2 - The second object to compare
 * @param seen - Map tracking visited object pairs to detect circular references
 * @returns `true` if objects have the same keys and all values are deeply equal
 */
function compareObjects(obj1: Record<string, unknown>, obj2: Record<string, unknown>, seen: Map<unknown, Set<unknown>>): boolean {
    const keys1: Array<string> = Object.keys(obj1);

    // Count keys in obj2 to avoid allocating another array
    let keyCount2 = 0;
    for (const key in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, key)) {
            keyCount2++;
        }
    }

    // Early exit if different number of keys
    if (keys1.length !== keyCount2) {
        return false;
    }

    // Check all properties in obj1 exist in obj2 with equal values
    for (const key of keys1) {
        if (!Object.prototype.hasOwnProperty.call(obj2, key) || !compareDeepWithTracking(obj1[key], obj2[key], seen)) {
            return false;
        }
    }

    return true;
}
