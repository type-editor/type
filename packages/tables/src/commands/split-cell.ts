import type {PmEditorState} from '@type-editor/editor-types';
import type {NodeType} from '@type-editor/model';
import type {DispatchFunction} from '@type-editor/editor-types';

import {tableNodeTypes, type TableRole} from '../schema';
import type {GetCellTypeOptions} from '../types/commands/GetCellTypeOptions';
import {splitCellWithType} from './split-cell-with-type';


/**
 * Splits a selected cell that has rowspan or colspan greater than one into smaller cells.
 *
 * Uses the first cell's type for all new cells created during the split.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the command is applicable, false otherwise
 */
export function splitCell(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    const nodeTypes: Record<'table' | 'row' | 'cell' | 'header_cell', NodeType> = tableNodeTypes(state.schema);
    return splitCellWithType(({node}: GetCellTypeOptions): NodeType => {
        return nodeTypes[node.type.spec.tableRole as TableRole];
    })(state, dispatch);
}
