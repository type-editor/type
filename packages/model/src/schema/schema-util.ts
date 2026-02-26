import type {Mark} from '../elements/Mark';
import {MarkType} from './MarkType';

export function isMarkType(markOrMarkType: Mark | MarkType) : boolean {
    return markOrMarkType instanceof MarkType;
}
