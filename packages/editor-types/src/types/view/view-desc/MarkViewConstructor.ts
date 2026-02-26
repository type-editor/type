import type {Mark} from '@type-editor/model';

import type {PmEditorView} from '../PmEditorView';
import type {MarkView} from './MarkView';

/**
 * The function types [used](#view.EditorProps.markViews) to create
 * mark views.
 */
export type MarkViewConstructor = (mark: Mark, view: PmEditorView, inline: boolean) => MarkView;
