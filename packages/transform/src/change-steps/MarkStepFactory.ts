import type {Mark} from '@type-editor/model';

import {AddMarkStep} from './AddMarkStep';
import {AddNodeMarkStep} from './AddNodeMarkStep';
import {RemoveMarkStep} from './RemoveMarkStep';
import {RemoveNodeMarkStep} from './RemoveNodeMarkStep';

export class MarkStepFactory {
    
    public static createAddMarkStep(from: number, to: number, mark: Mark): AddMarkStep {
        return new AddMarkStep(from, to, mark);
    }

    public static createRemoveMarkStep(from: number, to: number, mark: Mark): RemoveMarkStep {
        return new RemoveMarkStep(from, to, mark);
    }
    
    public static createAddNodeMarkStep(pos: number, mark: Mark): AddNodeMarkStep {
        return new AddNodeMarkStep(pos, mark);
    }

    public static createRemoveNodeMarkStep(pos: number, mark: Mark): RemoveNodeMarkStep {
        return new RemoveNodeMarkStep(pos, mark);
    }
}
