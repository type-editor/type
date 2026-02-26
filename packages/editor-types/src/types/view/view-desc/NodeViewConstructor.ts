import type {PmNode} from '@type-editor/model';

import type {DecorationSource} from '../decoration/DecorationSource';
import type {PmDecoration} from '../decoration/PmDecoration';
import type {PmEditorView} from '../PmEditorView';
import type {NodeView} from './NodeView';

/**
 * The type of function [provided](#view.EditorProps.nodeViews) to
 * create [node views](#view.NodeView).
 */
export type NodeViewConstructor = (node: PmNode,
                                   view: PmEditorView,
                                   getPos: () => number | undefined,
                                   decorations: ReadonlyArray<PmDecoration>,
                                   innerDecorations: DecorationSource) => NodeView;
