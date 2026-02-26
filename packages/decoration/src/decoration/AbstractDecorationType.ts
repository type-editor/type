/**
 * Base class for decoration types that provides common functionality
 * for comparing decoration specifications.
 *
 * This abstract class serves as a foundation for WidgetType,
 * InlineType, and NodeType, providing shared utility
 * methods for comparing decoration specifications.
 */
export class AbstractDecorationType {

    /** Empty options object used as default to avoid repeated allocations */
    protected static readonly EMPTY_DECORATION_WIDGET_OPTIONS: Record<string, never> = {};

    /**
     * Deep comparison of two objects to check if they have the same properties
     * and values. This is used to determine if two decoration specs are equal.
     *
     * @param a - First object to compare
     * @param b - Second object to compare
     * @returns True if objects are equal, false otherwise
     */
    protected compareObjs(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
        if (a === b) {
            return true;
        }

        // Check all properties in a exist in b with same values
        for (const prop in a) {
            if (a[prop] !== b[prop]) {
                return false;
            }
        }

        // Check all properties in b exist in a (to catch extra properties in b)
        for (const prop in b) {
            if (!(prop in a)) {
                return false;
            }
        }

        return true;
    }
}
