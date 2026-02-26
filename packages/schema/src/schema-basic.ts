import { OrderedMap } from '@type-editor/commons';
import {Schema} from '@type-editor/model';

import {blockElements} from './schema-blocks';
import { inlineElements } from './schema-inline';
import {marks} from './schema-marks';
import {addListNodes} from './util';


/**
 * This schema roughly corresponds to the document schema used by
 * [CommonMark](http://commonmark.org/), minus the list elements,
 * which are defined in the [`prosemirror-schema-list`](#schema-list)
 * module.
 *
 * To reuse elements from this schema, extend or read from its
 * `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
 */
export const schema: Schema = new Schema({
    nodes: addListNodes(OrderedMap.from({...blockElements, ...inlineElements}), 'paragraph block*', 'block'),
    marks
});
