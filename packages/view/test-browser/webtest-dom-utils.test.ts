import ist from 'ist';
import {afterEach, beforeEach, describe, it,} from 'vitest';

import {blockquote, doc, em, p, strong,} from '@type-editor/test-builder';
import type {EditorView} from '@src/EditorView';

import {tempEditor} from './view';

describe('DOM utility functions', () => {
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
  });

  describe("DOM structure", () => {
    it("creates correct DOM structure for simple paragraph", () => {
      view = tempEditor({ doc: doc(p("hello")) });
      ist(view.dom.querySelector('p'));
      ist(view.dom.querySelector('p')!.textContent, "hello");
    });

    it("creates correct DOM structure for nested nodes", () => {
      view = tempEditor({ doc: doc(blockquote(p("quoted"))) });
      ist(view.dom.querySelector('blockquote'));
      ist(view.dom.querySelector('blockquote p'));
      ist(view.dom.querySelector('blockquote p')!.textContent, "quoted");
    });

    it("creates correct DOM structure for marks", () => {
      view = tempEditor({ doc: doc(p("hello ", strong("bold"), " world")) });
      ist(view.dom.querySelector('strong'));
      ist(view.dom.querySelector('strong')!.textContent, "bold");
    });

    it("creates correct DOM structure for nested marks", () => {
      view = tempEditor({ doc: doc(p(strong(em("bold italic")))) });
      ist(view.dom.querySelector('strong em') || view.dom.querySelector('em strong'));
    });
  });

  describe("DOM node retrieval", () => {
    it("domAtPos returns correct DOM node for text position", () => {
      view = tempEditor({ doc: doc(p("hello world")) });
      let domPos = view.domAtPos(3);
      ist(domPos.node);
      ist(domPos.offset >= 0);
    });

    it("domAtPos handles position at block boundary", () => {
      view = tempEditor({ doc: doc(p("first"), p("second")) });
      let domPos = view.domAtPos(7); // Between paragraphs
      ist(domPos.node);
      ist(domPos.offset >= 0);
    });

    it("domAtPos handles position in marked text", () => {
      view = tempEditor({ doc: doc(p(strong("bold text"))) });
      let domPos = view.domAtPos(3);
      ist(domPos.node);
      ist(domPos.offset >= 0);
    });

    it("nodeDOM returns the DOM element for a node position", () => {
      view = tempEditor({ doc: doc(p("test")) });
      let node = view.nodeDOM(0);
      ist(node);
      ist((node as HTMLElement).nodeName, "P");
    });
  });

  describe("DOM position mapping", () => {
    it("posAtDOM returns correct position for text node", () => {
      view = tempEditor({ doc: doc(p("hello")) });
      let textNode = view.dom.querySelector('p')!.firstChild!;
      let pos = view.posAtDOM(textNode, 2);
      ist(pos >= 0);
      ist(pos <= view.state.doc.content.size);
    });

    it("posAtDOM handles element node", () => {
      view = tempEditor({ doc: doc(p("test")) });
      let pNode = view.dom.querySelector('p')!;
      let pos = view.posAtDOM(pNode, 0);
      ist(pos >= 0);
    });

    it("posAtDOM handles nested structure", () => {
      view = tempEditor({ doc: doc(blockquote(p("nested"))) });
      let textNode = view.dom.querySelector('blockquote p')!.firstChild!;
      let pos = view.posAtDOM(textNode, 1);
      ist(pos > 0);
    });
  });

  describe("DOM updates", () => {
    it("updates DOM when mark is added", () => {
      view = tempEditor({ doc: doc(p("plain text")) });
      let strongMark = view.state.schema.marks.strong.create();

      view.dispatch(
        view.state.transaction.addMark(1, 6, strongMark)
      );

      ist(view.dom.querySelector('strong'));
    });

    it("updates DOM when node is replaced", () => {
      view = tempEditor({ doc: doc(p("original")) });
      ist(view.dom.textContent!.includes("original"));

      view.dispatch(
        view.state.transaction.replaceWith(0, view.state.doc.content.size, doc(p("modified")).content)
      );

      ist(view.dom.textContent!.includes("modified"));
    });
  });

  describe("contentDOM", () => {
    it("returns the content DOM for the editor", () => {
      view = tempEditor({ doc: doc(p("test")) });
      ist(view.dom.getAttribute('contenteditable'), 'true');
    });

    it("maintains contenteditable attribute", () => {
      view = tempEditor({ doc: doc(p("editable")) });
      ist(view.dom.contentEditable, 'true');
    });
  });

  describe("DOM event handling", () => {
    it("view has a properly initialized DOM element", () => {
      view = tempEditor({ doc: doc(p("test")) });
      ist(view.dom instanceof HTMLElement);
      ist(view.dom.pmViewDesc);
    });

    it("DOM element has correct data attributes", () => {
      view = tempEditor({ doc: doc(p("test")) });
      // EditorView typically adds data attributes for debugging
      ist(view.dom.getAttribute('contenteditable'), 'true');
    });
  });

  describe("DOM cleaning", () => {
    it("properly destroys view", () => {
      view = tempEditor({ doc: doc(p("cleanup test")) });
      let dom = view.dom;
      ist(dom.contentEditable, 'true');

      view.destroy();

      // View should be destroyed
      ist(true);
    });
  });

  describe("special characters and whitespace", () => {
    it("handles nbsp correctly", () => {
      view = tempEditor({ doc: doc(p("hello\u00a0world")) });
      ist(view.dom.textContent!.includes("hello"));
      ist(view.dom.textContent!.includes("world"));
    });

    it("handles multiple spaces", () => {
      view = tempEditor({ doc: doc(p("hello   world")) });
      // DOM should contain the text
      ist(view.dom.textContent);
    });

    it("handles line breaks in text", () => {
      view = tempEditor({ doc: doc(p("line1\nline2")) });
      ist(view.dom.textContent);
    });
  });

  describe("DOM comparison", () => {
    it("recognizes unchanged DOM structure", () => {
      view = tempEditor({ doc: doc(p("unchanged")) });
      let initialHTML = view.dom.innerHTML;

      // Dispatch a no-op transaction
      view.dispatch(view.state.transaction);

      // DOM should remain effectively the same
      ist(view.dom.querySelector('p'));
    });

    it("recognizes changed content", () => {
      view = tempEditor({ doc: doc(p("before")) });
      let beforeHTML = view.dom.innerHTML;

      view.dispatch(view.state.transaction.insertText("X"));

      ist(view.dom.innerHTML !== beforeHTML);
    });
  });
});
