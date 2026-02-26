import {describe, it, expect, vi} from 'vitest';
import {createDOMFromPlainText} from '@src/clipboard/parse/create-dom-from-plain-text';
import type {PmEditorView} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

describe('createDOMFromPlainText', () => {
    // Create mock objects for the required parameters
    const mockView = {} as PmEditorView;
    const mockContext = {} as ResolvedPos;

    describe('basic functionality', () => {
        it('creates a div element', () => {
            const result = createDOMFromPlainText(mockView, 'plain text', mockContext);
            expect(result.tagName).toBe('DIV');
        });

        it('creates paragraphs for single line text', () => {
            const result = createDOMFromPlainText(mockView, 'single line', mockContext);
            const paragraphs = result.querySelectorAll('p');
            expect(paragraphs.length).toBe(1);
            expect(paragraphs[0].textContent).toBe('single line');
        });

        it('splits text on line breaks and creates multiple paragraphs', () => {
            const result = createDOMFromPlainText(mockView, 'line 1\nline 2\nline 3', mockContext);
            const paragraphs = result.querySelectorAll('p');
            expect(paragraphs.length).toBe(3);
            expect(paragraphs[0].textContent).toBe('line 1');
            expect(paragraphs[1].textContent).toBe('line 2');
            expect(paragraphs[2].textContent).toBe('line 3');
        });

        it('handles carriage return line breaks', () => {
            const result = createDOMFromPlainText(mockView, 'line 1\r\nline 2', mockContext);
            const paragraphs = result.querySelectorAll('p');
            expect(paragraphs.length).toBe(2);
            expect(paragraphs[0].textContent).toBe('line 1');
            expect(paragraphs[1].textContent).toBe('line 2');
        });

        it('handles multiple consecutive line breaks', () => {
            const result = createDOMFromPlainText(mockView, 'line 1\n\n\nline 2', mockContext);
            const paragraphs = result.querySelectorAll('p');
            expect(paragraphs.length).toBe(2);
        });

        it('creates empty paragraphs for empty blocks', () => {
            const result = createDOMFromPlainText(mockView, '\n', mockContext);
            const paragraphs = result.querySelectorAll('p');
            expect(paragraphs.length).toBe(2);
            expect(paragraphs[0].innerHTML).toBe('');
            expect(paragraphs[1].innerHTML).toBe('');
        });
    });

    describe('link conversion', () => {
        describe('URLs with protocols', () => {
            it('converts http:// URLs to anchor tags', () => {
                const result = createDOMFromPlainText(mockView, 'http://example.com', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('http://example.com/');
                expect(links[0].textContent).toBe('http://example.com');
            });

            it('converts https:// URLs to anchor tags', () => {
                const result = createDOMFromPlainText(mockView, 'https://example.com', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://example.com/');
                expect(links[0].textContent).toBe('https://example.com');
            });

            it('converts URLs with paths', () => {
                const result = createDOMFromPlainText(mockView, 'https://example.com/path/to/page', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://example.com/path/to/page');
                expect(links[0].textContent).toBe('https://example.com/path/to/page');
            });

            it('converts URLs with query parameters', () => {
                const result = createDOMFromPlainText(mockView, 'https://example.com?param=value&other=123', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://example.com/?param=value&other=123');
                expect(links[0].textContent).toBe('https://example.com?param=value&other=123');
            });
        });

        describe('URLs in text context', () => {
            it('converts URLs preceded by whitespace', () => {
                const result = createDOMFromPlainText(mockView, 'Check out https://example.com for info', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://example.com/');
                expect(links[0].textContent).toBe('https://example.com');
            });

            it('converts URLs at the start of text', () => {
                const result = createDOMFromPlainText(mockView, 'https://example.com is great', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://example.com/');
            });

            it('converts multiple URLs in the same text', () => {
                const result = createDOMFromPlainText(mockView, 'Visit https://example.com and http://test.org', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(2);
                expect(links[0].href).toBe('https://example.com/');
                expect(links[1].href).toBe('http://test.org/');
            });

            it('preserves text around links', () => {
                const result = createDOMFromPlainText(mockView, 'Visit https://example.com for more info', mockContext);
                const paragraph = result.querySelector('p');
                expect(paragraph?.textContent).toBe('Visit https://example.com for more info');
            });

            it('handles URLs with different whitespace types', () => {
                const result = createDOMFromPlainText(mockView, 'Visit\thttps://example.com\nfor more', mockContext);
                const paragraphs = result.querySelectorAll('p');
                const links = paragraphs[0].querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://example.com/');
            });
        });

        describe('non-URL text', () => {
            it('does not convert text without valid URLs', () => {
                const result = createDOMFromPlainText(mockView, 'just plain text here', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(0);
            });

            it('does not convert email addresses', () => {
                const result = createDOMFromPlainText(mockView, 'contact@example.com', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(0);
            });

            it('does not convert incomplete domain names', () => {
                const result = createDOMFromPlainText(mockView, 'example', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(0);
            });

            it('preserves text content when no URLs are present', () => {
                const text = 'This is plain text without any URLs';
                const result = createDOMFromPlainText(mockView, text, mockContext);
                const paragraph = result.querySelector('p');
                expect(paragraph?.textContent).toBe(text);
            });
        });

        describe('edge cases', () => {
            it('handles URLs ending with punctuation', () => {
                const result = createDOMFromPlainText(mockView, 'Visit https://example.com.', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                // The period should be part of the URL
                expect(links[0].textContent).toBe('https://example.com.');
            });

            it('handles domains with hyphens', () => {
                const result = createDOMFromPlainText(mockView, 'https://my-example-site.com', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://my-example-site.com/');
            });

            it('handles domains with subdomains', () => {
                const result = createDOMFromPlainText(mockView, 'https://sub.example.com', mockContext);
                const links = result.querySelectorAll('a');
                expect(links.length).toBe(1);
                expect(links[0].href).toBe('https://sub.example.com/');
            });

            it('handles URLs in multiple paragraphs', () => {
                const result = createDOMFromPlainText(mockView, 'First https://example.com\nSecond http://test.org', mockContext);
                const paragraphs = result.querySelectorAll('p');
                expect(paragraphs.length).toBe(2);
                
                const links1 = paragraphs[0].querySelectorAll('a');
                expect(links1.length).toBe(1);
                expect(links1[0].href).toBe('https://example.com/');
                
                const links2 = paragraphs[1].querySelectorAll('a');
                expect(links2.length).toBe(1);
                expect(links2[0].href).toBe('http://test.org/');
            });

            it('handles empty string', () => {
                const result = createDOMFromPlainText(mockView, '', mockContext);
                const paragraphs = result.querySelectorAll('p');
                expect(paragraphs.length).toBe(1);
                expect(paragraphs[0].innerHTML).toBe('');
            });
        });
    });
});
