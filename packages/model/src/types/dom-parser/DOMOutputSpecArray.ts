import type {DOMAttributes} from './DOMAttributes';

export interface DOMOutputSpecArray extends ReadonlyArray<string | Node | {
    dom: Node;
    contentDOM?: HTMLElement
} | DOMOutputSpecArray | DOMAttributes | 0> {
    readonly 0: string;
}
