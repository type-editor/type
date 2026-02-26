import type {ScrollPos} from './ScrollPos';

export interface StoredScrollPos {
    refDOM: HTMLElement;
    refTop: number;
    stack: Array<ScrollPos>;
}
