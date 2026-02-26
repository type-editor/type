import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmStepResult} from '@type-editor/editor-types';
import {type PmNode, ReplaceError, type Slice} from '@type-editor/model';

/**
 * The result of [applying](#transform.Step.apply) a step. Contains either a
 * new document or a failure value.
 */
export class StepResult implements PmStepResult {

    private readonly _doc: PmNode | null;
    private readonly _failed: string | null;

    /**
     * @internal
     * @param doc - The transformed document, if successful.
     * @param failed - The failure message, if unsuccessful.
     */
    constructor(doc: PmNode | null, failed: string | null) {
        // Validate that exactly one of doc or failed is set (XOR logic)
        if ((isUndefinedOrNull(doc) && isUndefinedOrNull(failed)) || (!isUndefinedOrNull(doc) && !isUndefinedOrNull(failed))) {
            throw new Error('StepResult must have either doc or failed message, but not both or neither');
        }
        this._doc = doc;
        this._failed = failed;
    }

    get doc(): PmNode | null {
        return this._doc;
    }

    get failed(): string | null {
        return this._failed;
    }

    /**
     * Create a successful step result.
     *
     * @param doc - The transformed document.
     * @returns A successful StepResult.
     */
    public static ok(doc: PmNode): StepResult {
        if (!doc) {
            throw new Error('StepResult.ok requires a valid document');
        }
        return new StepResult(doc, null);
    }

    /**
     * Create a failed step result.
     *
     * @param message - The failure message.
     * @returns A failed StepResult.
     */
    public static fail(message: string): StepResult {
        if (!message || typeof message !== 'string') {
            throw new Error('StepResult.fail requires a non-empty error message');
        }
        return new StepResult(null, message);
    }

    /**
     * Call [`Node.replace`](#model.Node.replace) with the given
     * arguments. Create a successful result if it succeeds, and a
     * failed one if it throws a `ReplaceError`.
     *
     * @param doc - The document to apply the replacement to.
     * @param from - The start position of the replacement.
     * @param to - The end position of the replacement.
     * @param slice - The slice to insert.
     * @returns A StepResult indicating success or failure.
     */
    public static fromReplace(doc: PmNode,
                              from: number,
                              to: number,
                              slice: Slice): StepResult {
        try {
            return StepResult.ok(doc.replace(from, to, slice));
        } catch (e) {
            if (e instanceof ReplaceError) {
                return StepResult.fail(e.message);
            }
            throw e;
        }
    }
}
