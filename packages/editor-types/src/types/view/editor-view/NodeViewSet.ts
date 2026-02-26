import type {MarkViewConstructor} from '../view-desc/MarkViewConstructor';
import type {NodeViewConstructor} from '../view-desc/NodeViewConstructor';

export type NodeViewSet = Record<string, NodeViewConstructor | MarkViewConstructor>;
