import type {PmEditorView} from '@type-editor/editor-types';

import {COMPOSITION_END_SCHEDULE_DELAY} from '../compositon-constants';
import {scheduleComposeEnd} from './util/schedule-compose-end';

/**
 * Handles compositionend events from IME input. Marks the composition as ended
 * and schedules processing of any pending DOM changes.
 */
export function compositionEndHandler(view: PmEditorView, event: KeyboardEvent): boolean {
    if (view.composing) {
        view.input.composing = false;
        view.input.compositionEndedAt = event.timeStamp;
        view.input.compositionPendingChanges = view.domObserver.pendingRecords().length ? view.input.compositionID : 0;
        view.input.compositionNode = null;
        if (view.input.compositionPendingChanges) {
            void Promise.resolve().then((): void => {
                view.domObserver.flush();
            });

        }
        view.input.compositionID++;
        scheduleComposeEnd(view, COMPOSITION_END_SCHEDULE_DELAY);
    }
    return false;
}
