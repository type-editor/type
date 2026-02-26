import {describe, it, expect} from 'vitest';
import {restoreReplacedSpaces} from '@src/clipboard/parse/restore-replaced-spaces';

describe("restoreReplacedSpaces", () => {
    describe("basic functionality", () => {
        it("processes spans with single NBSP child node", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">\u00a0</span>';

            restoreReplacedSpaces(container);

            // Should be replaced
            expect(container.querySelector('.Apple-converted-space')).toBeNull();
        });

        it("handles multiple Apple-converted-space spans", () => {
            const container = document.createElement('div');
            container.innerHTML = 'Hello<span class="Apple-converted-space">\u00a0</span>world<span class="Apple-converted-space">\u00a0</span>!';

            restoreReplacedSpaces(container);

            expect(container.querySelectorAll('.Apple-converted-space').length).toBe(0);
        });

        it("replaces span even with child elements if textContent is NBSP", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space"><b>\u00a0</b></span>';

            restoreReplacedSpaces(container);

            // Span gets replaced because textContent === '\u00a0' even though it has a child element
            expect(container.querySelector('.Apple-converted-space')).toBeNull();
            // The b element is gone too, replaced with text node
            expect(container.querySelector('b')).toBeNull();
        });

        it("does not affect spans with text content other than NBSP", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">text</span>';

            restoreReplacedSpaces(container);

            expect(container.querySelector('span')).not.toBeNull();
            expect(container.textContent).toBe('text');
        });

        it("only processes spans with single NBSP text node", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">\u00a0\u00a0</span>'; // Two NBSPs

            restoreReplacedSpaces(container);

            // Should not be replaced because content is not exactly one NBSP
            expect(container.querySelector('span')).not.toBeNull();
        });
    });

    describe("browser-specific selectors", () => {
        it("handles Apple-converted-space class (Safari)", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">\u00a0</span>';

            restoreReplacedSpaces(container);

            // Should be replaced
            expect(container.querySelector('.Apple-converted-space')).toBeNull();
        });

        it("preserves spans with other classes", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="other-class">\u00a0</span>';

            restoreReplacedSpaces(container);

            // Should not be affected by Chrome selector in non-Chrome browsers
            expect(container.querySelector('.other-class')).not.toBeNull();
        });
    });

    describe("DOM manipulation", () => {
        it("replaces matching span with text node", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">\u00a0</span>';

            restoreReplacedSpaces(container);

            expect(container.querySelector('.Apple-converted-space')).toBeNull();
            expect(container.childNodes.length).toBe(1);
            expect(container.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
        });

        it("preserves parent structure", () => {
            const container = document.createElement('div');
            container.innerHTML = '<p>Text<span class="Apple-converted-space">\u00a0</span>more</p>';

            restoreReplacedSpaces(container);

            expect(container.querySelector('p')).not.toBeNull();
            expect(container.querySelector('.Apple-converted-space')).toBeNull();
        });

        it("handles nested structures", () => {
            const container = document.createElement('div');
            container.innerHTML = '<div><p><span class="Apple-converted-space">\u00a0</span></p></div>';

            restoreReplacedSpaces(container);

            expect(container.querySelector('.Apple-converted-space')).toBeNull();
        });

        it("does nothing when parent node is missing", () => {
            const span = document.createElement('span');
            span.className = 'Apple-converted-space';
            span.textContent = '\u00a0';

            // Span is not attached to any parent
            expect(() => restoreReplacedSpaces(span)).not.toThrow();
        });
    });

    describe("edge cases", () => {
        it("handles empty container", () => {
            const container = document.createElement('div');

            expect(() => restoreReplacedSpaces(container)).not.toThrow();
        });

        it("handles container with no spans", () => {
            const container = document.createElement('div');
            container.innerHTML = '<p>No spans here</p>';

            expect(() => restoreReplacedSpaces(container)).not.toThrow();
            expect(container.textContent).toBe('No spans here');
        });

        it("handles spans with empty content", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space"></span>';

            restoreReplacedSpaces(container);

            // Empty span should remain (not exactly NBSP)
            expect(container.querySelector('span')).not.toBeNull();
        });

        it("handles multiple matching spans", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">\u00a0</span><span class="Apple-converted-space">\u00a0</span><span class="Apple-converted-space">\u00a0</span>';

            restoreReplacedSpaces(container);

            expect(container.querySelectorAll('.Apple-converted-space').length).toBe(0);
        });

        it("preserves other whitespace characters", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space">\t</span><span class="Apple-converted-space">\n</span>';

            restoreReplacedSpaces(container);

            // These should not be replaced (not NBSP)
            expect(container.querySelectorAll('.Apple-converted-space').length).toBe(2);
        });
    });

    describe("selector specificity", () => {
        it("only processes spans matching the selector", () => {
            const container = document.createElement('div');
            // Mix of matching and non-matching spans
            container.innerHTML = `
                <span class="Apple-converted-space">\u00a0</span>
                <span class="other">\u00a0</span>
                <span class="Apple-converted-space">\u00a0</span>
            `;

            const initialCount = container.querySelectorAll('span').length;
            restoreReplacedSpaces(container);

            // Only Apple-converted-space spans should be removed
            expect(container.querySelectorAll('.Apple-converted-space').length).toBe(0);
            expect(container.querySelectorAll('.other').length).toBe(1);
        });

        it("requires exact NBSP character", () => {
            const container = document.createElement('div');
            container.innerHTML = '<span class="Apple-converted-space"> </span>'; // Regular space

            restoreReplacedSpaces(container);

            // Should not be replaced (not NBSP)
            expect(container.querySelector('.Apple-converted-space')).not.toBeNull();
        });

        it("requires exactly one child node", () => {
            const container = document.createElement('div');
            const span = document.createElement('span');
            span.className = 'Apple-converted-space';
            span.appendChild(document.createTextNode('\u00a0'));
            span.appendChild(document.createTextNode(''));
            container.appendChild(span);

            restoreReplacedSpaces(container);

            // Should not be replaced (two child nodes)
            expect(container.querySelector('.Apple-converted-space')).not.toBeNull();
        });
    });
});

