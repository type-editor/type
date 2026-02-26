import { beforeEach, describe, expect, it } from 'vitest';

import { zoomIn, zoomOut, zoomReset } from '@src/zoom';
import type { DispatchFunction, PmEditorState, PmEditorView } from '@type-editor/editor-types';

// Mock EditorView with a DOM element that has a style.zoom property
function createMockView(initialZoom = '1'): PmEditorView {
    const dom = {
        style: {
            zoom: initialZoom
        }
    } as unknown as HTMLElement;

    return {
        dom
    } as unknown as PmEditorView;
}

const mockState = {} as PmEditorState;
const mockDispatch = (() => {}) as DispatchFunction;

describe('zoomIn', () => {
    let view: PmEditorView;

    beforeEach(() => {
        view = createMockView('1');
    });

    it('increases zoom by 10%', () => {
        const result = zoomIn(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('1.1');
    });

    it('increases zoom from a custom starting point', () => {
        view = createMockView('1.5');

        const result = zoomIn(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('1.6');
    });

    it('does not exceed maximum zoom of 200%', () => {
        view = createMockView('2');

        const result = zoomIn(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('2');
    });

    it('caps zoom at 200% when close to maximum', () => {
        view = createMockView('1.95');

        const result = zoomIn(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('2');
    });

    it('handles missing initial zoom value', () => {
        view = createMockView('');
        // When zoom is empty string, it coerces to 0, so 0 + 0.1 = 0.1
        const result = zoomIn(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(Number(view.dom.style.zoom)).toBeCloseTo(1.1, 10);
    });
});

describe('zoomOut', () => {
    let view: PmEditorView;

    beforeEach(() => {
        view = createMockView('1');
    });

    it('decreases zoom by 10%', () => {
        const result = zoomOut(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(Number(view.dom.style.zoom)).toBeCloseTo(0.9, 10);
    });

    it('decreases zoom from a custom starting point', () => {
        view = createMockView('1.5');

        const result = zoomOut(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(Number(view.dom.style.zoom)).toBeCloseTo(1.4, 10);
    });

    it('does not go below minimum zoom of 10%', () => {
        view = createMockView('0.1');

        const result = zoomOut(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('0.1');
    });

    it('caps zoom at 10% when close to minimum', () => {
        view = createMockView('0.15');

        const result = zoomOut(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('0.1');
    });
});

describe('zoomReset', () => {
    let view: PmEditorView;

    it('resets zoom to 100% from zoomed in state', () => {
        view = createMockView('1.5');

        const result = zoomReset(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('1');
    });

    it('resets zoom to 100% from zoomed out state', () => {
        view = createMockView('0.5');

        const result = zoomReset(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('1');
    });

    it('keeps zoom at 100% when already at 100%', () => {
        view = createMockView('1');

        const result = zoomReset(mockState, mockDispatch, view);

        expect(result).toBe(true);
        expect(view.dom.style.zoom).toBe('1');
    });
});
