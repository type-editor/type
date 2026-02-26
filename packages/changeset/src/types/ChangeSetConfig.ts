import type {Node} from '@type-editor/model';

import type {TokenEncoder} from './TokenEncoder';


/**
 * Configuration options for a ChangeSet.
 *
 * @template Data - The type of metadata associated with changes.
 */
export interface ChangeSetConfig<Data> {
    /** The starting document that changes are tracked from. */
    doc: Node;
    /** Function to combine metadata from adjacent spans. Returns null if incompatible. */
    combine: (dataA: Data, dataB: Data) => Data;
    /** Encoder for tokenizing document content during diff operations. */
    encoder: TokenEncoder<any>;
    
}
