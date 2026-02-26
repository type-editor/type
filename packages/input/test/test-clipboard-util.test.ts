import {describe, it, expect, beforeEach} from 'vitest';
import {detachedDoc, wrapMap} from '@src/clipboard/util';

describe("clipboard util", () => {
    describe("detachedDoc", () => {
        it("returns a Document instance", () => {
            const doc = detachedDoc();
            expect(doc).toBeInstanceOf(Document);
        });

        it("returns the same document on subsequent calls", () => {
            const doc1 = detachedDoc();
            const doc2 = detachedDoc();
            expect(doc1).toBe(doc2);
        });

        it("creates an HTML document with a title", () => {
            const doc = detachedDoc();
            expect(doc.title).toBe('title');
        });

        it("is detached from the main document", () => {
            const doc = detachedDoc();
            expect(doc).not.toBe(document);
        });

        it("can be used to create elements", () => {
            const doc = detachedDoc();
            const element = doc.createElement('div');
            expect(element).toBeInstanceOf(HTMLElement);
            expect(element.ownerDocument).toBe(doc);
        });

        it("provides isolation from main document", () => {
            const doc = detachedDoc();
            const element = doc.createElement('div');
            element.innerHTML = '<p>test</p>';

            // Element is not in the main document
            expect(document.contains(element)).toBe(false);
        });
    });

    describe("wrapMap", () => {
        it("defines wrapping for thead elements", () => {
            expect(wrapMap.thead).toEqual(['table']);
        });

        it("defines wrapping for tbody elements", () => {
            expect(wrapMap.tbody).toEqual(['table']);
        });

        it("defines wrapping for tfoot elements", () => {
            expect(wrapMap.tfoot).toEqual(['table']);
        });

        it("defines wrapping for caption elements", () => {
            expect(wrapMap.caption).toEqual(['table']);
        });

        it("defines wrapping for colgroup elements", () => {
            expect(wrapMap.colgroup).toEqual(['table']);
        });

        it("defines wrapping for col elements", () => {
            expect(wrapMap.col).toEqual(['table', 'colgroup']);
        });

        it("defines wrapping for tr elements", () => {
            expect(wrapMap.tr).toEqual(['table', 'tbody']);
        });

        it("defines wrapping for td elements", () => {
            expect(wrapMap.td).toEqual(['table', 'tbody', 'tr']);
        });

        it("defines wrapping for th elements", () => {
            expect(wrapMap.th).toEqual(['table', 'tbody', 'tr']);
        });

        it("provides correct nesting order", () => {
            // col needs both table and colgroup
            expect(wrapMap.col.length).toBe(2);
            expect(wrapMap.col[0]).toBe('table');
            expect(wrapMap.col[1]).toBe('colgroup');

            // td needs table, tbody, and tr
            expect(wrapMap.td.length).toBe(3);
            expect(wrapMap.td[0]).toBe('table');
            expect(wrapMap.td[1]).toBe('tbody');
            expect(wrapMap.td[2]).toBe('tr');
        });

        it("handles direct table children with single wrapper", () => {
            const directChildren = ['thead', 'tbody', 'tfoot', 'caption', 'colgroup'];
            directChildren.forEach(tag => {
                expect(wrapMap[tag]).toEqual(['table']);
                expect(wrapMap[tag].length).toBe(1);
            });
        });

        it("handles deeply nested elements", () => {
            const deeplyNested = ['td', 'th'];
            deeplyNested.forEach(tag => {
                expect(wrapMap[tag].length).toBe(3);
            });
        });
    });

    describe("wrapMap usage", () => {
        it("explains why wrapping is needed", () => {
            // This test documents the reason for wrapMap
            // Some elements must be wrapped for innerHTML to work correctly
            const container = document.createElement('div');

            // Without wrapping, table cells are ignored
            container.innerHTML = '<td>test</td>';
            expect(container.querySelector('td')).toBeNull();

            // With proper wrapping (as wrapMap defines), it works
            const table = document.createElement('table');
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            tr.innerHTML = '<td>test</td>';
            tbody.appendChild(tr);
            table.appendChild(tbody);

            expect(table.querySelector('td')).not.toBeNull();
            expect(table.querySelector('td')?.textContent).toBe('test');
        });

        it("can guide proper element creation", () => {
            // wrapMap tells us td needs table > tbody > tr
            const wrappers = wrapMap.td;

            let container: HTMLElement = document.createElement(wrappers[0]); // table
            let current: HTMLElement = container;

            for (let i = 1; i < wrappers.length; i++) {
                const wrapper = document.createElement(wrappers[i]);
                current.appendChild(wrapper);
                current = wrapper;
            }

            current.innerHTML = '<td>content</td>';

            expect(container.querySelector('td')).not.toBeNull();
        });
    });
});

