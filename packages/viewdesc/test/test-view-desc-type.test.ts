import {describe, it, expect} from 'vitest';
import {ViewDescType} from '@src/view-desc/ViewDescType';

describe('ViewDescType', () => {
    it('should have VIEW type', () => {
        expect(ViewDescType.VIEW).toBe(0);
    });

    it('should have NODE type', () => {
        expect(ViewDescType.NODE).toBe(1);
    });

    it('should have MARK type', () => {
        expect(ViewDescType.MARK).toBe(2);
    });

    it('should have COMPOSITION type', () => {
        expect(ViewDescType.COMPOSITION).toBe(3);
    });

    it('should have TEXT type', () => {
        expect(ViewDescType.TEXT).toBe(4);
    });

    it('should have WIDGET type', () => {
        expect(ViewDescType.WIDGET).toBe(5);
    });

    it('should have CUSTOM type', () => {
        expect(ViewDescType.CUSTOM).toBe(6);
    });

    it('should have TRAILING_HACK type', () => {
        expect(ViewDescType.TRAILING_HACK).toBe(7);
    });

    it('should have distinct numeric values', () => {
        const types = [
            ViewDescType.VIEW,
            ViewDescType.NODE,
            ViewDescType.MARK,
            ViewDescType.COMPOSITION,
            ViewDescType.TEXT,
            ViewDescType.WIDGET,
            ViewDescType.CUSTOM,
            ViewDescType.TRAILING_HACK
        ];

        const uniqueTypes = new Set(types);
        expect(uniqueTypes.size).toBe(8);
    });

    it('should be usable in numeric comparisons', () => {
        expect(ViewDescType.VIEW).toBe(0);
        expect(ViewDescType.NODE).toBeGreaterThan(ViewDescType.VIEW);
        expect(ViewDescType.TEXT).toBeGreaterThan(ViewDescType.NODE);
    });

    it('should be usable in switch statements', () => {
        const checkType = (type: ViewDescType) => {
            switch (type) {
                case ViewDescType.VIEW:
                    return 'view';
                case ViewDescType.NODE:
                    return 'node';
                case ViewDescType.TEXT:
                    return 'text';
                case ViewDescType.WIDGET:
                    return 'widget';
                case ViewDescType.MARK:
                    return 'mark';
                case ViewDescType.COMPOSITION:
                    return 'composition';
                case ViewDescType.CUSTOM:
                    return 'custom';
                case ViewDescType.TRAILING_HACK:
                    return 'trailing_hack';
                default:
                    return 'unknown';
            }
        };

        expect(checkType(ViewDescType.VIEW)).toBe('view');
        expect(checkType(ViewDescType.NODE)).toBe('node');
        expect(checkType(ViewDescType.TEXT)).toBe('text');
        expect(checkType(ViewDescType.WIDGET)).toBe('widget');
        expect(checkType(ViewDescType.MARK)).toBe('mark');
        expect(checkType(ViewDescType.COMPOSITION)).toBe('composition');
        expect(checkType(ViewDescType.CUSTOM)).toBe('custom');
        expect(checkType(ViewDescType.TRAILING_HACK)).toBe('trailing_hack');
    });
});

