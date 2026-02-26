import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmMapping, TransformDocument} from '@type-editor/editor-types';
import {type NodeType, type ResolvedPos, Slice} from '@type-editor/model';

import {ReplaceStep} from '../change-steps/ReplaceStep';
import {clearIncompatible, replaceLinebreaks, replaceNewlines} from './util';


/**
 * Join two blocks at the given position and depth.
 *
 * @param transform The transform to apply the join to.
 * @param pos The position where the join occurs.
 * @param depth The depth of the join.
 * @returns The transform with the join applied.
 */
export function join(transform: TransformDocument, pos: number, depth: number): TransformDocument {
    let convertNewlines: boolean | null = null;
    const {linebreakReplacement} = transform.doc.type.schema;
    const $before: ResolvedPos = transform.doc.resolve(pos - depth);
    const beforeType: NodeType = $before.node().type;

    if (linebreakReplacement && beforeType.inlineContent) {
        const isPre: boolean = beforeType.whitespace === 'pre';
        const supportsLinebreak = !isUndefinedOrNull(beforeType.contentMatch.matchType(linebreakReplacement));

        if (isPre && !supportsLinebreak) {
            convertNewlines = false;
        } else if (!isPre && supportsLinebreak) {
            convertNewlines = true;
        }
    }

    const mapFrom = transform.steps.length;

    if (!convertNewlines) {
        const $after = transform.doc.resolve(pos + depth);
        replaceLinebreaks(transform, $after.node(), $after.before(), mapFrom);
    }

    if (beforeType.inlineContent) {
        clearIncompatible(
            transform,
            pos + depth - 1,
            beforeType,
            $before.node().contentMatchAt($before.index()),
            isUndefinedOrNull(convertNewlines)
        );
    }

    const mapping: PmMapping = transform.mapping.slice(mapFrom);
    const start: number = mapping.map(pos - depth);
    transform.step(new ReplaceStep(start, mapping.map(pos + depth, -1), Slice.empty, true));

    if (convertNewlines) {
        const $full: ResolvedPos = transform.doc.resolve(start);
        replaceNewlines(transform, $full.node(), $full.before(), transform.steps.length);
    }

    return transform;
}
