import type {ReactPortal, RefObject} from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * A renderer entry managed by the React adapter.
 *
 * Each view (node, mark, plugin, widget) implements this interface so the
 * provider can maintain a portal map that React renders on every update.
 *
 * @typeParam Context - The shape of the context object shared with the
 *   rendered component tree.
 */
export interface ReactRenderer<Context> {
  /** Unique key used to identify this renderer's portal in the map. */
  key: string
  /** The context object provided to the rendered component. */
  context: Context
  /** Creates a React portal that renders the user component. */
  render: () => ReactPortal
  /** Synchronises the context object with the latest editor state. */
  updateContext: () => void
}

/** Return value of {@link useReactRenderer}. */
export interface ReactRendererResult {
  /** The current map of active React portals keyed by renderer key. */
  readonly portals: Record<string, ReactPortal>
  /**
   * Registers or updates a renderer's portal.
   *
   * @param nodeView - The renderer to register.
   * @param update - Whether to call `updateContext` before rendering.
   *   Defaults to `true`.
   */
  readonly renderReactRenderer: (nodeView: ReactRenderer<unknown>, update?: boolean) => void
  /**
   * Removes a renderer's portal.
   *
   * @param nodeView - The renderer to remove.
   */
  readonly removeReactRenderer: (nodeView: ReactRenderer<unknown>) => void
}

/**
 * React hook that manages a map of React portals for the adapter's views.
 *
 * It wraps state updates in `flushSync` when the component is already mounted
 * so that ProseMirror's synchronous update cycle sees the DOM changes
 * immediately (e.g. for correct cursor positioning).
 *
 * @returns An object containing the portal map and callbacks to add/remove
 *   renderers.
 */
export function useReactRenderer(): ReactRendererResult {
  const [portals, setPortals] = useState<Record<string, ReactPortal>>({});
  const mountedRef: RefObject<boolean> = useRef(false);

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const maybeFlushSync = useCallback((fn: () => void) => {
    if (mountedRef.current) {flushSync(fn)}
    else {fn()}
  }, []);

  const renderReactRenderer = useCallback(
    (nodeView: ReactRenderer<unknown>, update = true) => {
      maybeFlushSync(() => {
        if (update) {nodeView.updateContext()}

        setPortals((prev) => ({
          ...prev,
          [nodeView.key]: nodeView.render(),
        }));
      });
    },
    [maybeFlushSync],
  );

  const removeReactRenderer = useCallback(
    (nodeView: ReactRenderer<unknown>) => {
      maybeFlushSync(() => {
        setPortals((prev) => {
          const next = { ...prev };
          delete next[nodeView.key];
          return next;
        });
      });
    },
    [maybeFlushSync],
  );

  return {
    portals,
    renderReactRenderer,
    removeReactRenderer,
  } as const;
}
