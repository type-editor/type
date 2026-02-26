import {hasOwnProperty, isUndefinedOrNull} from '@type-editor/commons';

import type {ScrollPos} from '../types/dom-coords/ScrollPos';
import {restoreScrollStack} from './util/restore-scroll-stack';
import {scrollStack} from './util/scroll-stack';

let preventScrollSupported: false | null | { preventScroll: boolean; } = null;

/**
 * Feature-detects support for .focus({preventScroll: true}), and uses
 * a fallback kludge when not supported. This prevents the browser from
 * scrolling the focused element into view.
 *
 * @param dom - The HTML element to focus without scrolling
 */
export function focusPreventScroll(dom: HTMLElement): void {
    // IE-specific API for focusing without scroll
    if(hasOwnProperty(dom, 'setActive')) {
        return (dom as any).setActive();
    }

    // Use preventScroll if we know it's supported
    if (preventScrollSupported) {
        dom.focus(preventScrollSupported);
        return;
    }

    // First time or known unsupported: detect feature or use fallback
    const storedScrollPositions: Array<ScrollPos> = scrollStack(dom);
    dom.focus(isUndefinedOrNull(preventScrollSupported) ? {
        // Getter-based feature detection: if browser accesses this property, it supports the option
        get preventScroll(): boolean {
            preventScrollSupported = { preventScroll: true };
            return true;
        }
    } : undefined);

    // If feature detection failed, manually restore scroll positions
    if (!preventScrollSupported) {
        preventScrollSupported = false;
        restoreScrollStack(storedScrollPositions, 0);
    }
}
