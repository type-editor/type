import type {QueryImpl} from '../types/QueryImpl';


export class NullQuery implements QueryImpl {

    public findNext(): null {
        return null;
    }

    public findPrev(): null {
        return null;
    }
}
