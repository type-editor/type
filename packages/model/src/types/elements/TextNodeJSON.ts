import type {NodeJSON} from './NodeJSON';


/**
 * JSON representation of a text node.
 */
export interface TextNodeJSON extends NodeJSON {
    /**
     * Alternative text content (used in some serialization contexts).
     */
    withText?: string;
}
