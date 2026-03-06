import type {PmNode} from '@type-editor/model';


export interface PmStepResult {
    readonly doc: PmNode | null;
    readonly failed: string | null;
}
