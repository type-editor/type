import {OrderedMap} from '@type-editor/commons';

import { blockElements } from './schema-blocks';
import { inlineElements } from './schema-inline';

const nodes = OrderedMap.from({...blockElements, ...inlineElements});

export {liftListItem} from './list-commands/lift-list-item';
export {sinkListItem} from './list-commands/sink-list-item';
export {splitListItem} from './list-commands/split-list-item';
export {splitListItemKeepMarks} from './list-commands/split-list-item-keep-marks';
export {wrapInList} from './list-commands/wrap-in-list';
export {wrapRangeInList} from './list-commands/wrap-range-in-list';
export { schema } from './schema-basic';
export { blockElements } from './schema-blocks';
export {nodes};
export {bulletList, listItem, orderedList} from './schema-list';
export { marks } from './schema-marks';
export {addListNodes} from './util';
