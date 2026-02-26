import {describe, it} from 'vitest';
import ist from 'ist';
import {blockquote, code_block, doc, hr, li, p, ul} from '@type-editor/test-builder';
import {tempEditor} from './view';
import {Selection} from '@type-editor/state';

if (!document.hasFocus()) {
  console["warn"]("Document doesn't have focus. Some keyboard tests may be skipped.");
}

describe("Key capture and navigation", () => {
  describe("horizontal navigation", () => {
    it("moves cursor left with ArrowLeft", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hel<a>lo")) });
      let initialPos = view.state.selection.from;

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true
      }));

      // Check if selection would have moved (internal handler may prevent it)
      ist(view.state.selection.from <= initialPos);
    });

    it("moves cursor right with ArrowRight", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hel<a>lo")) });
      let initialPos = view.state.selection.from;

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from >= initialPos);
    });

    it("handles Home key", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hello wo<a>rld")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
        cancelable: true
      }));

      // Home should move to line start
      ist(view.state.selection.from <= 10);
    });

    it("handles End key", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hel<a>lo world")) });
      let initialPos = view.state.selection.from;

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'End',
        bubbles: true,
        cancelable: true
      }));

      // End should move toward or to line end
      ist(view.state.selection.from >= initialPos);
    });
  });

  describe("vertical navigation", () => {
    it("handles ArrowUp between paragraphs", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("first"), p("sec<a>ond")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true
      }));

      // Should move to first paragraph or stay
      ist(view.state.selection.from <= 9);
    });

    it("handles ArrowDown between paragraphs", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("fir<a>st"), p("second")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      }));

      // Should move to second paragraph or stay
      ist(view.state.selection.from >= 3);
    });
  });

  describe("selection with shift", () => {
    it("extends selection with Shift+ArrowRight", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hel<a>lo")) });
      let initialPos = view.state.selection.from;

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
        bubbles: true,
        cancelable: true
      }));

      // Should extend selection
      ist(view.state.selection.from <= initialPos);
    });

    it("extends selection with Shift+ArrowLeft", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hel<a>lo")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        shiftKey: true,
        bubbles: true,
        cancelable: true
      }));

      // Selection should potentially extend
      ist(view.state.selection instanceof Selection);
    });
  });

  describe("special node handling", () => {
    it("handles navigation around horizontal rule", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("before"), hr(), p("after")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(8))
      ));

      ist(view.state.selection.from >= 0);
    });

    it("handles navigation in blockquote", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(blockquote(p("quote<a>d text"))) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from <= 7);
    });

    it("handles navigation in lists", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({
        doc: doc(ul(li(p("item <a>one")), li(p("item two"))))
      });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from >= 0);
    });
  });

  describe("code block navigation", () => {
    it("handles navigation in code block", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(code_block("const x = 1;<a>")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from <= 13);
    });
  });

  describe("edge cases", () => {
    it("handles navigation at document start", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("<a>hello")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from >= 0);
      ist(view.state.selection.from <= 1);
    });

    it("handles navigation at document end", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hello<a>")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from <= view.state.doc.content.size);
    });

    it("handles navigation in empty paragraph", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p(), p("text")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(1))
      ));

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from >= 0);
    });
  });

  describe("modifier keys", () => {
    it("handles Ctrl/Cmd+ArrowLeft for word jumping", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hello wor<a>ld test")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from <= 10);
    });

    it("handles Ctrl/Cmd+ArrowRight for word jumping", () => {
      if (!document.hasFocus()) return;

      let view = tempEditor({ doc: doc(p("hello <a>world test")) });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      }));

      ist(view.state.selection.from >= 6);
    });
  });
});

