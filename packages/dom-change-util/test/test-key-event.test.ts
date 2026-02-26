import {describe, it, expect} from 'vitest';
import {keyEvent} from '@src/dom-change/util/key-event';

describe("keyEvent", () => {
    it("creates a KeyboardEvent with correct properties", () => {
        const event = keyEvent(13, 'Enter');

        expect(event).toBeInstanceOf(KeyboardEvent);
        expect(event.type).toBe('keydown');
        expect(event.keyCode).toBe(13);
        expect(event.key).toBe('Enter');
        expect(event.code).toBe('Enter');
    });

    it("creates bubbling and cancelable events", () => {
        const event = keyEvent(65, 'a');

        expect(event.bubbles).toBe(true);
        expect(event.cancelable).toBe(true);
    });

    it("creates events for different key codes", () => {
        const enterEvent = keyEvent(13, 'Enter');
        const backspaceEvent = keyEvent(8, 'Backspace');
        const aEvent = keyEvent(65, 'a');

        expect(enterEvent.keyCode).toBe(13);
        expect(backspaceEvent.keyCode).toBe(8);
        expect(aEvent.keyCode).toBe(65);
    });

    it("creates events with correct key strings", () => {
        const arrowEvent = keyEvent(37, 'ArrowLeft');
        const escapeEvent = keyEvent(27, 'Escape');

        expect(arrowEvent.key).toBe('ArrowLeft');
        expect(escapeEvent.key).toBe('Escape');
    });

    it("creates events that can be dispatched", () => {
        const element = document.createElement('div');
        let eventFired = false;

        element.addEventListener('keydown', () => {
            eventFired = true;
        });

        const event = keyEvent(13, 'Enter');
        element.dispatchEvent(event);

        expect(eventFired).toBe(true);
    });
});

