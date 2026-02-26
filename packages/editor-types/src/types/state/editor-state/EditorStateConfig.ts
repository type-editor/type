import type {Mark, Schema} from '@type-editor/model';
import {type PmNode} from '@type-editor/model';

import type {PmPlugin} from '../plugin/PmPlugin';
import {type PmSelection} from '../selection/PmSelection';


/**
 * The type of object passed to
 * [`EditorState.create`](#state.EditorState^create).
 */
export interface EditorStateConfig {

    /**
     * The schema to use (only relevant if no `doc` is specified).
     */
    schema?: Schema;

    /**
     * The starting document. Either this or `schema` _must_ be provided.
     */
    doc?: PmNode;

    /**
     * A valid selection in the document.
     */
    selection?: PmSelection;

    /**
     * The initial set of [stored marks](#state.EditorState.storedMarks).
     */
    storedMarks?: ReadonlyArray<Mark> | null;

    /**
     * The plugins that should be active in this state.
     */
    plugins?: ReadonlyArray<PmPlugin>;
}
