import type {PmDecoration} from '@type-editor/editor-types';


/**
 * Check if two arrays of outer decorations are the same.
 *
 * @param a - First decoration array
 * @param b - Second decoration array
 * @returns True if the arrays contain equivalent decorations
 */
export function sameOuterDeco(a: ReadonlyArray<PmDecoration>,
                              b: ReadonlyArray<PmDecoration>): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (!a[i].type.eq(b[i].type)) {
            return false;
        }
    }
    return true;
}
