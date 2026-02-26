import type {PmNode} from '@type-editor/model';


export interface PmStepResult {
    readonly doc: PmNode;
    readonly failed: string;
}
