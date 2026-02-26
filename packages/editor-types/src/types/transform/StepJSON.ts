import type {MarkJSON} from '@type-editor/model';

export interface StepJSON {
    stepType: string;
    mark?: MarkJSON,
    from?: number,
    to?: number,
    pos?: number
}
