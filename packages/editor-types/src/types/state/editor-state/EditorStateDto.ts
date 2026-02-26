import type {Mark, PmNode} from '@type-editor/model';

import type {PmTransaction} from '../PmTransaction';
import type {PmSelection} from '../selection/PmSelection';
import type {PmEditorState} from './PmEditorState';


export interface EditorStateDto {
    doc?: PmNode;
    selection?: PmSelection;
    storedMarks?: ReadonlyArray<Mark> | null;
    scrollToSelection?: number;
    fieldData: Map<string, unknown>;
    transaction?: PmTransaction;
    oldState?: PmEditorState;

}
