import type {TransformDocument} from '@type-editor/editor-types';
import {type Attrs, type ContentMatch, Fragment, type NodeRange, type NodeType, Slice} from '@type-editor/model';

import {ReplaceAroundStep} from '../change-steps/ReplaceAroundStep';

/**
 * Wrap the content in a range with a series of wrapper nodes.
 * The wrappers are applied from outermost to innermost.
 *
 * @param transform The transform to apply the wrapping to.
 * @param range The range of content to wrap.
 * @param wrappers Array of wrapper node descriptors (outermost first).
 */
export function wrap(transform: TransformDocument,
                     range: NodeRange,
                     wrappers: ReadonlyArray<{ type: NodeType, attrs?: Attrs | null; }>): void {
    // Build the wrapper structure from inside out
    let wrappedContent = Fragment.empty;

    for (let i = wrappers.length - 1; i >= 0; i--) {
        const wrapper = wrappers[i];

        // Validate that content fits in this wrapper
        if (wrappedContent.size) {
            const match: ContentMatch = wrapper.type.contentMatch.matchFragment(wrappedContent);
            if (!match?.validEnd) {
                throw new RangeError(
                    'Wrapper type given to Transform.wrap does not form valid content of its parent wrapper'
                );
            }
        }

        wrappedContent = Fragment.from(wrapper.type.create(wrapper.attrs, wrappedContent));
    }

    // Apply the wrapping as a replace-around step
    const start: number = range.start;
    const end: number = range.end;

    transform.step(new ReplaceAroundStep(
        start,
        end,
        start,
        end,
        new Slice(wrappedContent, 0, 0),
        wrappers.length,
        true
    ));
}
