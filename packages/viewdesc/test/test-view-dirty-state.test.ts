import {describe, it, expect} from 'vitest';
import {ViewDirtyState} from '@src/view-desc/ViewDirtyState';

describe('ViewDirtyState', () => {
    it('should have NOT_DIRTY state', () => {
        expect(ViewDirtyState.NOT_DIRTY).toBe(0);
    });

    it('should have CHILD_DIRTY state', () => {
        expect(ViewDirtyState.CHILD_DIRTY).toBe(1);
    });

    it('should have CONTENT_DIRTY state', () => {
        expect(ViewDirtyState.CONTENT_DIRTY).toBe(2);
    });

    it('should have NODE_DIRTY state', () => {
        expect(ViewDirtyState.NODE_DIRTY).toBe(3);
    });

    it('should have distinct values', () => {
        const states = [
            ViewDirtyState.NOT_DIRTY,
            ViewDirtyState.CHILD_DIRTY,
            ViewDirtyState.CONTENT_DIRTY,
            ViewDirtyState.NODE_DIRTY
        ];

        const uniqueStates = new Set(states);
        expect(uniqueStates.size).toBe(4);
    });

    it('should be usable in comparisons', () => {
        expect(ViewDirtyState.NOT_DIRTY).toBeLessThan(ViewDirtyState.CHILD_DIRTY);
        expect(ViewDirtyState.CHILD_DIRTY).toBeLessThan(ViewDirtyState.CONTENT_DIRTY);
        expect(ViewDirtyState.CONTENT_DIRTY).toBeLessThan(ViewDirtyState.NODE_DIRTY);
    });

    it('should be usable in bitwise operations', () => {
        const state = ViewDirtyState.NODE_DIRTY;
        expect(state & ViewDirtyState.NODE_DIRTY).toBeTruthy();
        expect(state & ViewDirtyState.CHILD_DIRTY).toBeTruthy(); // Since NODE_DIRTY > CHILD_DIRTY
    });

    it('should support equality checks', () => {
        const state1 = ViewDirtyState.CONTENT_DIRTY;
        const state2 = ViewDirtyState.CONTENT_DIRTY;
        const state3 = ViewDirtyState.NODE_DIRTY;

        expect(state1 === state2).toBe(true);
        // @ts-ignore
        expect(state1 === state3).toBe(false);
    });
});

