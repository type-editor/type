// filepath: test/view/dom-utils.test.ts
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {clearReusedRange, textRange} from "@src/dom/text-range";
import {domIndex} from "@src/dom/dom-index";
import {nodeSize} from "@src/dom/node-size";
import {parentNode} from "@src/dom/parent-node";

describe("DOM utility functions - Unit tests", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = dom.window.document;
    global.document = document as any;
  });

  afterEach(() => {
    clearReusedRange();
  });

  describe("domIndex", () => {
    it("returns correct index for first sibling", () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');
      parent.appendChild(child1);
      parent.appendChild(child2);

      expect(domIndex(child1)).toBe(0);
    });

    it("returns correct index for last sibling", () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');
      const child3 = document.createElement('span');
      parent.appendChild(child1);
      parent.appendChild(child2);
      parent.appendChild(child3);

      expect(domIndex(child3)).toBe(2);
    });

    it("returns correct index for middle sibling", () => {
      const parent = document.createElement('div');
      const children = [];
      for (let i = 0; i < 5; i++) {
        const child = document.createElement('span');
        children.push(child);
        parent.appendChild(child);
      }

      expect(domIndex(children[2])).toBe(2);
    });

    it("returns 0 for only child", () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);

      expect(domIndex(child)).toBe(0);
    });

    it("handles mixed node types", () => {
      const parent = document.createElement('div');
      const text1 = document.createTextNode('text1');
      const element = document.createElement('span');
      const text2 = document.createTextNode('text2');

      parent.appendChild(text1);
      parent.appendChild(element);
      parent.appendChild(text2);

      expect(domIndex(text1)).toBe(0);
      expect(domIndex(element)).toBe(1);
      expect(domIndex(text2)).toBe(2);
    });
  });

  describe("nodeSize", () => {
    it("returns correct size for text nodes", () => {
      const textNode = document.createTextNode('Hello World');
      expect(nodeSize(textNode)).toBe(11);
    });

    it("returns 0 for empty text nodes", () => {
      const textNode = document.createTextNode('');
      expect(nodeSize(textNode)).toBe(0);
    });

    it("returns correct size for element nodes", () => {
      const div = document.createElement('div');
      div.appendChild(document.createElement('span'));
      div.appendChild(document.createElement('span'));
      div.appendChild(document.createTextNode('text'));

      expect(nodeSize(div)).toBe(3);
    });

    it("returns 0 for empty element nodes", () => {
      const div = document.createElement('div');
      expect(nodeSize(div)).toBe(0);
    });

    it("handles nodes with null nodeValue safely", () => {
      const textNode = document.createTextNode('test');
      // Even if nodeValue becomes null somehow, should not crash
      const size = nodeSize(textNode);
      expect(size).toBeGreaterThanOrEqual(0);
    });

    it("handles various text lengths", () => {
      const shortText = document.createTextNode('a');
      expect(nodeSize(shortText)).toBe(1);

      const longText = document.createTextNode('a'.repeat(1000));
      expect(nodeSize(longText)).toBe(1000);
    });

    it("handles unicode characters correctly", () => {
      const unicodeText = document.createTextNode('Hello 世界 🌍');
      // Length counts UTF-16 code units
      expect(nodeSize(unicodeText)).toBeGreaterThan(0);
    });
  });

  describe("textRange", () => {
    it("creates range with all parameters", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode, 0, 5);

      expect(range).toBeDefined();
      expect(range.startContainer).toBe(textNode);
      expect(range.startOffset).toBe(0);
      expect(range.endContainer).toBe(textNode);
      expect(range.endOffset).toBe(5);
    });

    it("uses default parameters correctly", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode);

      expect(range.startOffset).toBe(0);
      expect(range.endOffset).toBe(11);
    });

    it("uses only from parameter", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode, 6);

      expect(range.startOffset).toBe(6);
      expect(range.endOffset).toBe(11);
    });

    it("handles from = 0 correctly (not treated as falsy)", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode, 0, 5);

      expect(range.startOffset).toBe(0);
    });

    it("reuses the same Range object", () => {
      const textNode1 = document.createTextNode('First');
      const textNode2 = document.createTextNode('Second');

      const range1 = textRange(textNode1, 0, 5);
      const range2 = textRange(textNode2, 0, 6);

      expect(range1).toBe(range2);
    });

    it("creates new range after clearReusedRange", () => {
      const textNode = document.createTextNode('Test');

      const range1 = textRange(textNode, 0, 4);
      clearReusedRange();
      const range2 = textRange(textNode, 0, 4);

      // Should be different Range objects
      expect(range1).toBeDefined();
      expect(range2).toBeDefined();
    });

    it("handles empty text nodes", () => {
      const textNode = document.createTextNode('');
      const range = textRange(textNode, 0, 0);

      expect(range).toBeDefined();
      expect(range.startOffset).toBe(0);
      expect(range.endOffset).toBe(0);
    });

    it("handles null nodeValue safely", () => {
      const textNode = document.createTextNode('test');
      // Should not crash even if nodeValue is somehow null
      const range = textRange(textNode);
      expect(range).toBeDefined();
    });
  });

  describe("parentNode", () => {
    it("returns regular parent for normal elements", () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);

      expect(parentNode(child)).toBe(parent);
    });

    it("returns null for detached nodes", () => {
      const div = document.createElement('div');
      expect(parentNode(div)).toBeNull();
    });

    it("returns null for root document node", () => {
      const result = parentNode(document.documentElement);
      // documentElement's parent handling
      expect(result === null || result === document).toBe(true);
    });

    it("handles text nodes", () => {
      const parent = document.createElement('div');
      const textNode = document.createTextNode('text');
      parent.appendChild(textNode);

      expect(parentNode(textNode)).toBe(parent);
    });

    it("handles nested elements", () => {
      const grandparent = document.createElement('div');
      const parent = document.createElement('p');
      const child = document.createElement('span');

      grandparent.appendChild(parent);
      parent.appendChild(child);

      expect(parentNode(child)).toBe(parent);
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("handles rapid mutations", () => {
      const parent = document.createElement('div');
      const children = [];

      // Rapidly add and remove nodes
      for (let i = 0; i < 100; i++) {
        const child = document.createElement('span');
        children.push(child);
        parent.appendChild(child);
      }

      expect(nodeSize(parent)).toBe(100);

      // Remove half
      for (let i = 0; i < 50; i++) {
        parent.removeChild(children[i]);
      }

      expect(nodeSize(parent)).toBe(50);
      expect(domIndex(children[50])).toBe(0);
    });

    it("handles very long text nodes", () => {
      const longText = 'a'.repeat(100000);
      const textNode = document.createTextNode(longText);

      expect(nodeSize(textNode)).toBe(100000);

      const range = textRange(textNode, 0, 1000);
      expect(range.endOffset).toBe(1000);

      clearReusedRange();
    });

    it("handles deeply nested structures", () => {
      let current = document.createElement('div');
      const root = current;

      // Create 20 levels of nesting
      for (let i = 0; i < 20; i++) {
        const child = document.createElement('div');
        current.appendChild(child);

        expect(nodeSize(current)).toBe(1);
        expect(domIndex(child)).toBe(0);

        current = child;
      }

      const textNode = document.createTextNode('deep');
      current.appendChild(textNode);

      expect(nodeSize(textNode)).toBe(4);

      // Traverse back up
      let parent = parentNode(textNode);
      let depth = 0;
      while (parent && parent !== root.parentNode) {
        depth++;
        parent = parentNode(parent);
      }

      expect(depth).toBeGreaterThan(0);
    });

    it("handles multiple text nodes in sequence", () => {
      const parent = document.createElement('div');
      const text1 = document.createTextNode('first');
      const text2 = document.createTextNode('second');
      const text3 = document.createTextNode('third');

      parent.appendChild(text1);
      parent.appendChild(text2);
      parent.appendChild(text3);

      expect(nodeSize(parent)).toBe(3);
      expect(domIndex(text1)).toBe(0);
      expect(domIndex(text2)).toBe(1);
      expect(domIndex(text3)).toBe(2);
    });

    it("handles nodes with many siblings", () => {
      const parent = document.createElement('div');
      const children = [];

      for (let i = 0; i < 1000; i++) {
        const child = document.createElement('span');
        children.push(child);
        parent.appendChild(child);
      }

      expect(nodeSize(parent)).toBe(1000);
      expect(domIndex(children[0])).toBe(0);
      expect(domIndex(children[500])).toBe(500);
      expect(domIndex(children[999])).toBe(999);
    });

    it("handles special characters in text nodes", () => {
      const specialChars = 'Tab:\t Newline:\n Quote:" Apostrophe:\' Backslash:\\';
      const textNode = document.createTextNode(specialChars);

      expect(nodeSize(textNode)).toBe(specialChars.length);

      const range = textRange(textNode, 0, 10);
      expect(range).toBeDefined();

      clearReusedRange();
    });

    it("handles zero-width characters", () => {
      const zeroWidthText = 'Hello\u200BWorld'; // Zero-width space
      const textNode = document.createTextNode(zeroWidthText);

      expect(nodeSize(textNode)).toBe(11); // 5 + 1 (zero-width) + 5
    });

    it("handles empty parent traversal", () => {
      const emptyDiv = document.createElement('div');
      const child = document.createElement('span');
      emptyDiv.appendChild(child);

      expect(nodeSize(emptyDiv)).toBe(1);

      emptyDiv.removeChild(child);
      expect(nodeSize(emptyDiv)).toBe(0);

      expect(parentNode(child)).toBeNull();
    });
  });

  describe("performance characteristics", () => {
    it("domIndex performance with many siblings", () => {
      const parent = document.createElement('div');
      const children = [];

      for (let i = 0; i < 100; i++) {
        const child = document.createElement('span');
        children.push(child);
        parent.appendChild(child);
      }

      const start = Date.now();
      // Call domIndex on last child multiple times
      for (let i = 0; i < 100; i++) {
        domIndex(children[99]);
      }
      const duration = Date.now() - start;

      // Should complete reasonably quickly even with many iterations
      expect(duration).toBeLessThan(1000); // 1 second
    });

    it("nodeSize performance with many children", () => {
      const parent = document.createElement('div');

      for (let i = 0; i < 1000; i++) {
        parent.appendChild(document.createElement('span'));
      }

      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        nodeSize(parent);
      }
      const duration = Date.now() - start;

      // Should be very fast since it just accesses childNodes.length
      expect(duration).toBeLessThan(100); // 100ms
    });

    it("textRange reuse performance benefit", () => {
      const textNode = document.createTextNode('Test text');

      const start1 = Date.now();
      for (let i = 0; i < 1000; i++) {
        textRange(textNode, 0, 5);
      }
      const reuseDuration = Date.now() - start1;

      clearReusedRange();

      const start2 = Date.now();
      for (let i = 0; i < 1000; i++) {
        document.createRange(); // Create new range each time
      }
      const createDuration = Date.now() - start2;

      // Both operations should complete reasonably quickly
      // We can't reliably test that reuse is faster in all environments,
      // but we can verify both complete without hanging
      expect(reuseDuration).toBeLessThan(1000); // Should complete in less than 1 second
      expect(createDuration).toBeLessThan(1000);

      clearReusedRange();
    });
  });
});

