import {describe, it, expect} from 'vitest';
import {
    BACKSPACE_KEY_CODE,
    ENTER_KEY_CODE,
    SHIFT_KEY_CODE,
    INSERT_KEY_CODE,
    DELETE_KEY_CODE,
    COMPOSITION_KEY_CODE,
    KEY_CONTROL,
    KEY_META,
    KEY_ALT,
    KEY_SHIFT,
    KEY_BACKSPACE,
    KEY_DELETE,
    KEY_INSERT,
    KEY_ENTER,
    KEY_ESCAPE,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
    KEY_ARROW_UP,
    KEY_ARROW_DOWN
} from '@src/input-handler/key-codes';

describe("key-codes", () => {
    describe("key code constants", () => {
        it("exports correct backspace key code", () => {
            expect(BACKSPACE_KEY_CODE).toBe(8);
        });

        it("exports correct enter key code", () => {
            expect(ENTER_KEY_CODE).toBe(13);
        });

        it("exports correct shift key code", () => {
            expect(SHIFT_KEY_CODE).toBe(16);
        });

        it("exports correct insert key code", () => {
            expect(INSERT_KEY_CODE).toBe(45);
        });

        it("exports correct delete key code", () => {
            expect(DELETE_KEY_CODE).toBe(46);
        });

        it("exports correct composition key code", () => {
            expect(COMPOSITION_KEY_CODE).toBe(229);
        });
    });

    describe("key name constants", () => {
        it("exports correct control key name", () => {
            expect(KEY_CONTROL).toBe('Control');
        });

        it("exports correct meta key name", () => {
            expect(KEY_META).toBe('Meta');
        });

        it("exports correct alt key name", () => {
            expect(KEY_ALT).toBe('Alt');
        });

        it("exports correct shift key name", () => {
            expect(KEY_SHIFT).toBe('Shift');
        });

        it("exports correct backspace key name", () => {
            expect(KEY_BACKSPACE).toBe('Backspace');
        });

        it("exports correct delete key name", () => {
            expect(KEY_DELETE).toBe('Delete');
        });

        it("exports correct insert key name", () => {
            expect(KEY_INSERT).toBe('Insert');
        });

        it("exports correct enter key name", () => {
            expect(KEY_ENTER).toBe('Enter');
        });

        it("exports correct escape key name", () => {
            expect(KEY_ESCAPE).toBe('Escape');
        });

        it("exports correct arrow left key name", () => {
            expect(KEY_ARROW_LEFT).toBe('ArrowLeft');
        });

        it("exports correct arrow right key name", () => {
            expect(KEY_ARROW_RIGHT).toBe('ArrowRight');
        });

        it("exports correct arrow up key name", () => {
            expect(KEY_ARROW_UP).toBe('ArrowUp');
        });

        it("exports correct arrow down key name", () => {
            expect(KEY_ARROW_DOWN).toBe('ArrowDown');
        });
    });

    describe("key code usage", () => {
        it("can be used to identify keyboard events", () => {
            const event = new KeyboardEvent('keydown', { keyCode: ENTER_KEY_CODE });
            expect(event.keyCode).toBe(ENTER_KEY_CODE);
        });

        it("can be used to identify composition events", () => {
            const event = new KeyboardEvent('keydown', { keyCode: COMPOSITION_KEY_CODE });
            expect(event.keyCode).toBe(COMPOSITION_KEY_CODE);
        });

        it("composition key code indicates IME composition", () => {
            // This special key code (229) indicates IME composition is active
            expect(COMPOSITION_KEY_CODE).toBe(229);
        });
    });
});

