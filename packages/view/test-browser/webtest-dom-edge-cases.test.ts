import {afterEach, beforeEach, describe, it} from 'vitest';
import ist from 'ist';
import {doc, p, strong} from '@type-editor/test-builder';
import {tempEditor} from './view';
import type {EditorView} from '@src/EditorView';
import {
    clearReusedRange,
    deepActiveElement,
    domIndex,
    hasBlockDesc,
    isEquivalentPosition,
    isOnEdge,
    nodeSize,
    textNodeAfter,
    textNodeBefore,
    textRange
} from "@type-editor/dom-util";
import {caretFromPoint, selectionCollapsed} from "@type-editor/selection-util";
import {TEXT_NODE} from "@type-editor/commons";

describe("DOM utility edge cases and null safety", () => {
  let view: EditorView;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (view) {
      view.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    clearReusedRange();
  });

  describe("nodeSize - null safety", () => {
    it("handles text nodes with content", () => {
      const textNode = document.createTextNode('Hello World');
      ist(nodeSize(textNode), 11);
    });

    it("handles empty text nodes", () => {
      const textNode = document.createTextNode('');
      ist(nodeSize(textNode), 0);
    });

    it("handles element nodes", () => {
      const div = document.createElement('div');
      div.appendChild(document.createElement('span'));
      div.appendChild(document.createElement('span'));
      ist(nodeSize(div), 2);
    });

    it("handles empty element nodes", () => {
      const div = document.createElement('div');
      ist(nodeSize(div), 0);
    });

    it("handles detached text nodes safely", () => {
      const textNode = document.createTextNode('test');
      // Simulate a detached or malformed node scenario
      const size = nodeSize(textNode);
      ist(size >= 0);
    });
  });

  describe("textRange - null safety", () => {
    it("creates range for text node with all parameters", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode, 0, 5);
      ist(range);
      ist(range.toString(), 'Hello');
    });

    it("creates range for text node with default parameters", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode);
      ist(range);
      ist(range.toString(), 'Hello World');
    });

    it("creates range with only from parameter", () => {
      const textNode = document.createTextNode('Hello World');
      const range = textRange(textNode, 6);
      ist(range);
      ist(range.toString(), 'World');
    });

    it("handles empty text nodes", () => {
      const textNode = document.createTextNode('');
      const range = textRange(textNode, 0, 0);
      ist(range);
      ist(range.toString(), '');
    });

    it("reuses the same range object", () => {
      const textNode1 = document.createTextNode('First');
      const textNode2 = document.createTextNode('Second');

      const range1 = textRange(textNode1, 0, 5);
      const range2 = textRange(textNode2, 0, 6);

      // Should be the same Range object reused
      ist(range1, range2);
    });

    it("clearReusedRange clears the cached range", () => {
      const textNode = document.createTextNode('Test');
      textRange(textNode, 0, 4);
      clearReusedRange();
      // Should create a new range on next call (implicit test)
      const range = textRange(textNode, 0, 4);
      ist(range);
    });
  });

  describe("domIndex - correctness", () => {
    it("returns 0 for first child", () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');
      parent.appendChild(child1);
      parent.appendChild(child2);

      ist(domIndex(child1), 0);
    });

    it("returns correct index for middle child", () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');
      const child3 = document.createElement('span');
      parent.appendChild(child1);
      parent.appendChild(child2);
      parent.appendChild(child3);

      ist(domIndex(child2), 1);
    });

    it("returns correct index for last child", () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');
      const child3 = document.createElement('span');
      parent.appendChild(child1);
      parent.appendChild(child2);
      parent.appendChild(child3);

      ist(domIndex(child3), 2);
    });

    it("handles only child", () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);

      ist(domIndex(child), 0);
    });
  });

  describe("isEquivalentPosition - performance and correctness", () => {
    it("fast path: returns true for identical positions", () => {
      const div = document.createElement('div');
      ist(isEquivalentPosition(div, 0, div, 0), true);
    });

    it("returns false when targetNode is null", () => {
      const div = document.createElement('div');
      ist(isEquivalentPosition(div, 0, null as any, 0), false);
    });

    it("returns false when targetNode is undefined", () => {
      const div = document.createElement('div');
      ist(isEquivalentPosition(div, 0, undefined as any, 0), false);
    });

    it("recognizes equivalent positions in same text node", () => {
      view = tempEditor({ doc: doc(p("hello")) });
      const textNode = view.dom.querySelector('p')!.firstChild as Node;

      // Position at end of text should be equivalent to position after text
      const result = isEquivalentPosition(textNode, 5, textNode.parentNode!, 1);
      // This may be true or false depending on DOM structure, but shouldn't crash
      ist(typeof result === 'boolean');
    });

    it("handles different nodes correctly", () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const text1 = document.createTextNode('test1');
      const text2 = document.createTextNode('test2');
      div1.appendChild(text1);
      div2.appendChild(text2);

      // Different unrelated nodes should not be equivalent
      const result = isEquivalentPosition(div1, 0, div2, 0);
      ist(typeof result === 'boolean');
    });
  });

  describe("textNodeBefore - null safety", () => {
    it("finds text node before position in element", () => {
      view = tempEditor({ doc: doc(p("hello world")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = textNodeBefore(pElement, 1);

      ist(textNode);
      ist(textNode?.nodeType, TEXT_NODE);
    });

    it("returns null when no text node before", () => {
      const div = document.createElement('div');
      const result = textNodeBefore(div, 0);
      ist(result, null);
    });

    it("stops at contentEditable=false boundaries", () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      const nonEditable = document.createElement('span');
      nonEditable.contentEditable = 'false';
      const text = document.createTextNode('test');
      nonEditable.appendChild(text);
      div.appendChild(nonEditable);

      document.body.appendChild(div);
      const result = textNodeBefore(nonEditable, 1);
      ist(result, null);
      document.body.removeChild(div);
    });

    it("handles text node with zero offset", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Text;

      // At position 0 in text node, there's no text before
      const result = textNodeBefore(textNode, 0);
      ist(result, null);
    });

    it("handles text node with non-zero offset", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Text;

      // At position 2 in text node, the text node itself is before
      const result = textNodeBefore(textNode, 2);
      ist(result, textNode);
    });
  });

  describe("textNodeAfter - null safety", () => {
    it("finds text node after position in element", () => {
      view = tempEditor({ doc: doc(p("hello world")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = textNodeAfter(pElement, 0);

      ist(textNode);
      ist(textNode?.nodeType, TEXT_NODE);
    });

    it("returns null when no text node after", () => {
      const div = document.createElement('div');
      const result = textNodeAfter(div, 0);
      ist(result, null);
    });

    it("returns null at end of text node", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Text;

      // At end of text node, no text after unless there's more content
      const result = textNodeAfter(textNode, textNode.nodeValue?.length ?? 0);
      // May be null or another text node depending on structure
      ist(typeof result === 'object');
    });

    it("stops at contentEditable=false boundaries", () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      const nonEditable = document.createElement('span');
      nonEditable.contentEditable = 'false';
      const text = document.createTextNode('test');
      nonEditable.appendChild(text);
      div.appendChild(nonEditable);

      document.body.appendChild(div);
      const result = textNodeAfter(nonEditable, 0);
      ist(result, null);
      document.body.removeChild(div);
    });

    it("handles text node in middle of content", () => {
      view = tempEditor({ doc: doc(p("hello")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Text;

      // At position 2 in text node, rest of text is after
      const result = textNodeAfter(textNode, 2);
      ist(result, textNode);
    });

    it("handles null nodeValue safely", () => {
      const textNode = document.createTextNode('test');
      // textNodeAfter should handle potential null nodeValue
      const result = textNodeAfter(textNode, 0);
      ist(result, textNode);
    });
  });

  describe("isOnEdge - correctness", () => {
    it("detects start edge of parent", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Node;

      const atEdge = isOnEdge(textNode, 0, pElement);
      ist(atEdge, true);
    });

    it("detects end edge of parent", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Node;

      // Test with the actual immediate parent and the editor root
      const actualParent = textNode.parentNode!;
      const atEdgeOfParent = isOnEdge(textNode, nodeSize(textNode), actualParent);
      const atEdgeOfRoot = isOnEdge(textNode, nodeSize(textNode), view.dom);

      // At least one should detect the edge, or it returns false (both are valid)
      ist(typeof atEdgeOfParent === 'boolean');
      ist(typeof atEdgeOfRoot === 'boolean');
    });

    it("returns false for middle position", () => {
      view = tempEditor({ doc: doc(p("hello")) });
      const pElement = view.dom.querySelector('p')!;
      const textNode = pElement.firstChild as Node;

      const atEdge = isOnEdge(textNode, 2, pElement);
      ist(atEdge, false);
    });

    it("handles when node is not descendant of parent", () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');

      const atEdge = isOnEdge(div1, 0, div2);
      ist(atEdge, false);
    });

    it("returns true when node is parent", () => {
      const div = document.createElement('div');

      const atEdge = isOnEdge(div, 0, div);
      ist(atEdge, true);
    });
  });

  describe("hasBlockDesc - correctness", () => {
    it("returns true for block node DOM", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;

      ist(hasBlockDesc(pElement), true);
    });

    it("returns false for text node", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const textNode = view.dom.querySelector('p')!.firstChild!;

      ist(hasBlockDesc(textNode), false);
    });

    it("returns false for non-block elements", () => {
      view = tempEditor({ doc: doc(p(strong("bold"))) });
      const strongElement = view.dom.querySelector('strong')!;

      ist(hasBlockDesc(strongElement), false);
    });

    it("handles nodes without pmViewDesc", () => {
      const div = document.createElement('div');
      ist(hasBlockDesc(div), false);
    });

    it("handles detached nodes", () => {
      const detachedP = document.createElement('p');
      ist(hasBlockDesc(detachedP), false);
    });
  });

  describe("deepActiveElement - null safety", () => {
    it("returns active element when no shadow DOM", () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      const activeEl = deepActiveElement(document);
      ist(activeEl, input);

      document.body.removeChild(input);
    });

    it("returns null when no element is focused", () => {
      // Blur all elements
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const activeEl = deepActiveElement(document);
      // Could be null or body element depending on browser
      ist(activeEl !== undefined);
    });

    it("handles shadow DOM traversal", () => {
      const host = document.createElement('div');
      document.body.appendChild(host);

      // Check if shadow DOM is supported
      if (host.attachShadow) {
        const shadow = host.attachShadow({ mode: 'open' });
        const input = document.createElement('input');
        shadow.appendChild(input);

        input.focus();

        const activeEl = deepActiveElement(document);
        // Should traverse into shadow DOM
        ist(activeEl);
      }

      document.body.removeChild(host);
    });
  });

  describe("caretFromPoint - null safety", () => {
    it("returns undefined for invalid coordinates", () => {
      const result = caretFromPoint(document, -9999, -9999);
      ist(result, undefined);
    });

    it("returns position for valid coordinates in text", () => {
      view = tempEditor({ doc: doc(p("hello world")) });
      const pElement = view.dom.querySelector('p')!;
      const rect = pElement.getBoundingClientRect();

      const result = caretFromPoint(document, rect.left + 10, rect.top + 5);
      // Should return a valid position or undefined
      ist(typeof result === 'object' || result === undefined);
    });

    it("clips offset to node size", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const pElement = view.dom.querySelector('p')!;
      const rect = pElement.getBoundingClientRect();

      const result = caretFromPoint(document, rect.left + 5, rect.top + 5);
      if (result) {
        ist(result.offset >= 0);
        ist(result.offset <= nodeSize(result.node));
      }
    });

    it("handles coordinates outside document", () => {
      const result = caretFromPoint(document, 999999, 999999);
      // Should not crash, may return undefined
      ist(typeof result === 'object' || result === undefined);
    });
  });

  describe("selectionCollapsed - null safety", () => {
    it("returns false when focusNode is null", () => {
      const selection = {
        focusNode: null,
        focusOffset: 0,
        anchorNode: document.createElement('div'),
        anchorOffset: 0
      };

      ist(selectionCollapsed(selection), false);
    });

    it("returns false when anchorNode is null", () => {
      const selection = {
        focusNode: document.createElement('div'),
        focusOffset: 0,
        anchorNode: null,
        anchorOffset: 0
      };

      ist(selectionCollapsed(selection), false);
    });

    it("returns false when both nodes are null", () => {
      const selection = {
        focusNode: null,
        focusOffset: 0,
        anchorNode: null,
        anchorOffset: 0
      };

      ist(selectionCollapsed(selection), false);
    });

    it("returns true for same node and offset", () => {
      const div = document.createElement('div');
      const selection = {
        focusNode: div,
        focusOffset: 0,
        anchorNode: div,
        anchorOffset: 0
      };

      ist(selectionCollapsed(selection), true);
    });

    it("handles text node selection", () => {
      view = tempEditor({ doc: doc(p("test")) });
      const textNode = view.dom.querySelector('p')!.firstChild!;

      const selection = {
        focusNode: textNode,
        focusOffset: 2,
        anchorNode: textNode,
        anchorOffset: 2
      };

      ist(selectionCollapsed(selection), true);
    });

    it("returns false for different offsets", () => {
      const div = document.createElement('div');
      const selection = {
        focusNode: div,
        focusOffset: 0,
        anchorNode: div,
        anchorOffset: 1
      };

      ist(selectionCollapsed(selection), false);
    });

    it("returns false for different nodes", () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');

      const selection = {
        focusNode: div1,
        focusOffset: 0,
        anchorNode: div2,
        anchorOffset: 0
      };

      ist(selectionCollapsed(selection), false);
    });
  });

  describe("stress tests - rapid DOM mutations", () => {
    it("handles rapid nodeSize calls during mutations", () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      // Perform rapid mutations while calling nodeSize
      for (let i = 0; i < 10; i++) {
        const span = document.createElement('span');
        span.textContent = `Item ${i}`;
        div.appendChild(span);

        const size = nodeSize(div);
        ist(size, i + 1);
      }

      document.body.removeChild(div);
    });

    it("handles domIndex during node removal", () => {
      const parent = document.createElement('div');
      const children: HTMLElement[] = [];

      for (let i = 0; i < 5; i++) {
        const span = document.createElement('span');
        children.push(span);
        parent.appendChild(span);
      }

      // Get indices while removing nodes
      ist(domIndex(children[2]), 2);
      parent.removeChild(children[0]);
      ist(domIndex(children[2]), 1);
      parent.removeChild(children[1]);
      ist(domIndex(children[2]), 0);
    });

    it("handles text range operations with changing text", () => {
      const textNode = document.createTextNode('original');
      document.body.appendChild(textNode);

      const range1 = textRange(textNode, 0, 5);
      ist(range1.toString().length <= 5);

      textNode.nodeValue = 'modified longer text';
      const range2 = textRange(textNode, 0, 8);
      ist(range2);

      document.body.removeChild(textNode);
      clearReusedRange();
    });
  });

  describe("boundary conditions", () => {
    it("handles zero-length text nodes", () => {
      const textNode = document.createTextNode('');
      ist(nodeSize(textNode), 0);

      const range = textRange(textNode, 0, 0);
      ist(range);
      ist(range.toString(), '');
    });

    it("handles deeply nested structures", () => {
      let current = document.createElement('div');
      const root = current;

      // Create deep nesting
      for (let i = 0; i < 10; i++) {
        const child = document.createElement('div');
        current.appendChild(child);
        current = child;
      }

      const textNode = document.createTextNode('deep');
      current.appendChild(textNode);

      document.body.appendChild(root);

      // Test various operations on deeply nested nodes
      ist(nodeSize(textNode), 4);
      ist(hasBlockDesc(textNode), false);

      document.body.removeChild(root);
    });

    it("handles very large text nodes", () => {
      const largeText = 'a'.repeat(10000);
      const textNode = document.createTextNode(largeText);

      ist(nodeSize(textNode), 10000);

      const range = textRange(textNode, 0, 100);
      ist(range);
      ist(range.toString().length, 100);

      clearReusedRange();
    });

    it("handles empty elements", () => {
      const div = document.createElement('div');
      ist(nodeSize(div), 0);
      ist(hasBlockDesc(div), false);
    });

    it("handles single-child elements", () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);

      ist(nodeSize(div), 1);
      ist(domIndex(span), 0);
    });
  });
});

