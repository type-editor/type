import type { MarkViewConstructor } from '@type-editor/editor-types';
import { useCallback } from 'react';

import type { ReactRendererResult } from '../ReactRenderer';
import { ReactMarkView } from './ReactMarkView';
import type { ReactMarkViewUserOptions } from './ReactMarkViewOptions';

/**
 * React hook that returns a factory for creating ProseMirror mark view
 * constructors backed by React components.
 *
 * @param renderReactRenderer - Callback to register/update a React renderer portal.
 * @param removeReactRenderer - Callback to unregister a React renderer portal.
 * @returns A memoised factory function.
 */

export function useReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  const createReactMarkView = useCallback(
    (options: ReactMarkViewUserOptions): MarkViewConstructor =>
      (mark, view, inline) => {
        const markView = new ReactMarkView({
          mark,
          view,
          inline,
          options: {
            ...options,
            destroy() {
              options.destroy?.();
              removeReactRenderer(markView);
            },
          },
        });
        renderReactRenderer(markView, false);

        return markView;
      },
    [removeReactRenderer, renderReactRenderer],
  );

  return createReactMarkView;
}
