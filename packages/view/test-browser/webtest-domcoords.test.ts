import {describe, it} from 'vitest';
import ist from 'ist';
import {blockquote, doc, li, p, ul} from '@type-editor/test-builder';
import {tempEditor} from './view';
import {Selection} from '@type-editor/state';

describe("DOM coordinates", () => {
  describe("coordsAtPos", () => {
    it("returns coordinates for a position in text", () => {
      let view = tempEditor({ doc: doc(p("hello world")) });
      let coords = view.coordsAtPos(1);
      ist(coords.left >= 0);
      ist(coords.top >= 0);
      ist(coords.right >= coords.left);
      ist(coords.bottom > coords.top);
    });

    it("returns coordinates for position after text", () => {
      let view = tempEditor({ doc: doc(p("test")) });
      let coords = view.coordsAtPos(5);
      ist(coords.left >= 0);
      ist(coords.right >= coords.left);
    });

    it("returns coordinates for position in nested structure", () => {
      let view = tempEditor({ doc: doc(blockquote(p("nested text"))) });
      let coords = view.coordsAtPos(3);
      ist(coords.left >= 0);
      ist(coords.top >= 0);
    });

    it("returns different coordinates for different positions", () => {
      let view = tempEditor({ doc: doc(p("abc def ghi")) });
      let coords1 = view.coordsAtPos(1);
      let coords2 = view.coordsAtPos(5);
      ist(coords2.left >= coords1.left);
    });
  });

  describe("posAtCoords", () => {
    it("returns position for given coordinates", () => {
      let view = tempEditor({ doc: doc(p("click here")) });
      let coords = view.coordsAtPos(3);
      let pos = view.posAtCoords({ left: coords.left, top: coords.top });
      ist(pos);
      ist(pos!.pos >= 1);
      ist(pos!.pos <= 11);
    });

    it("returns inside property for text node", () => {
      let view = tempEditor({ doc: doc(p("text content")) });
      let coords = view.coordsAtPos(2);
      let pos = view.posAtCoords({ left: coords.left, top: coords.top });
      ist(pos);
      ist(pos!.inside >= 0);
    });

    it("handles coordinates outside the editor", () => {
      let view = tempEditor({ doc: doc(p("content")) });
      let pos = view.posAtCoords({ left: -1000, top: -1000 });
      ist(pos == null || (pos.pos >= 0 && pos.pos <= view.state.doc.content.size));
    });
  });

  describe("endOfTextblock", () => {
    it("returns true at end of textblock going forward", () => {
      let view = tempEditor({ doc: doc(p("hello<a>")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(6))
      ));
      ist(view.endOfTextblock("forward"));
    });

    it("returns true at start of textblock going backward", () => {
      let view = tempEditor({ doc: doc(p("<a>hello")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(1))
      ));
      ist(view.endOfTextblock("backward"));
    });

    it("returns false in middle of textblock", () => {
      let view = tempEditor({ doc: doc(p("hel<a>lo")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(4))
      ));
      ist(!view.endOfTextblock("forward"));
      ist(!view.endOfTextblock("backward"));
    });

    it("handles up direction", () => {
      let view = tempEditor({ doc: doc(p("line1"), p("line2")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(1))
      ));
      let result = view.endOfTextblock("up");
      ist(typeof result === "boolean");
    });

    it("handles down direction", () => {
      let view = tempEditor({ doc: doc(p("line1"), p("line2")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(6))
      ));
      let result = view.endOfTextblock("down");
      ist(typeof result === "boolean");
    });

    it("handles left and right directions", () => {
      let view = tempEditor({ doc: doc(p("text")) });
      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(1))
      ));
      ist(view.endOfTextblock("left"));
      ist(!view.endOfTextblock("right"));
    });
  });

  describe("coordinate edge cases", () => {
    it("handles empty paragraphs", () => {
      let view = tempEditor({ doc: doc(p()) });
      let coords = view.coordsAtPos(1);
      ist(coords.left >= 0);
      ist(coords.top >= 0);
    });

    it("handles position at document start", () => {
      let view = tempEditor({ doc: doc(p("test")) });
      let coords = view.coordsAtPos(0);
      ist(coords.left >= 0);
      ist(coords.top >= 0);
    });

    it("handles position at document end", () => {
      let view = tempEditor({ doc: doc(p("test")) });
      let endPos = view.state.doc.content.size;
      let coords = view.coordsAtPos(endPos);
      ist(coords.left >= 0);
      ist(coords.top >= 0);
    });

    it("handles list structures", () => {
      let view = tempEditor({ doc: doc(ul(li(p("item 1")), li(p("item 2")))) });
      let coords1 = view.coordsAtPos(3);
      let coords2 = view.coordsAtPos(11);
      ist(coords2.top >= coords1.top);
    });
  });

  describe("zero-height and scaled elements", () => {
    it("handles elements with zero height", () => {
      let view = tempEditor({ doc: doc(p("Test content")) });
      view.dom.style.height = '0px';
      view.dom.style.width = '100px';

      // Should not crash
      let coords = view.coordsAtPos(2);
      ist(coords !== undefined);
      ist(typeof coords.left === 'number');
      ist(typeof coords.top === 'number');
    });

    it("handles elements with transform: scale(0.01)", () => {
      let view = tempEditor({ doc: doc(p("Scaled content")) });
      view.dom.style.transform = 'scale(0.01)';

      // Should not crash
      let coords = view.coordsAtPos(3);
      ist(coords !== undefined);
      ist(typeof coords.left === 'number');
      ist(typeof coords.top === 'number');
    });
  });

  describe("bidirectional text", () => {
    it("handles Arabic text", () => {
      let view = tempEditor({ doc: doc(p("مرحبا بك في المحرر")) });

      // Should not crash and return valid coordinates
      let coords1 = view.coordsAtPos(1);
      ist(coords1.left >= 0);
      ist(coords1.top >= 0);

      let coords2 = view.coordsAtPos(5);
      ist(coords2 !== undefined);

      // posAtCoords should also work
      let pos = view.posAtCoords({ left: coords1.left, top: coords1.top });
      ist(pos !== null);
    });

    it("handles Hebrew text", () => {
      let view = tempEditor({ doc: doc(p("שלום עולם")) });

      // Should not crash
      let coords = view.coordsAtPos(3);
      ist(coords.left >= 0);
      ist(coords.top >= 0);

      // Verify coordinates are valid
      ist(coords.right >= coords.left);
      ist(coords.bottom >= coords.top);
    });

    it("handles mixed LTR and RTL text", () => {
      let view = tempEditor({ doc: doc(p("Hello מرحبا World עולם")) });

      // Should handle complex bidirectional text without crashing
      for (let i = 1; i < 10; i++) {
        let coords = view.coordsAtPos(i);
        ist(coords !== undefined);
        ist(coords.left >= 0);
        ist(coords.top >= 0);
      }
    });

    it("handles endOfTextblock with RTL text", () => {
      let view = tempEditor({ doc: doc(p("<a>טקסט בעברית")) });
      view.dom.style.direction = 'rtl';

      view.dispatch(view.state.transaction.setSelection(
        Selection.near(view.state.doc.resolve(1))
      ));

      // Should not crash with RTL text
      let resultLeft = view.endOfTextblock("left");
      let resultRight = view.endOfTextblock("right");
      let resultForward = view.endOfTextblock("forward");
      let resultBackward = view.endOfTextblock("backward");

      ist(typeof resultLeft === "boolean");
      ist(typeof resultRight === "boolean");
      ist(typeof resultForward === "boolean");
      ist(typeof resultBackward === "boolean");
    });
  });

  describe("whitespace and special content", () => {
    it("handles document with only whitespace", () => {
      let view = tempEditor({ doc: doc(p("   ")) });

      // Should not crash
      let coords1 = view.coordsAtPos(1);
      let coords2 = view.coordsAtPos(2);
      let coords3 = view.coordsAtPos(3);

      ist(coords1 !== undefined);
      ist(coords2 !== undefined);
      ist(coords3 !== undefined);

      // All coordinates should be valid
      ist(coords1.left >= 0);
      ist(coords2.left >= 0);
      ist(coords3.left >= 0);
    });
  });

  describe("special characters and emojis", () => {
    it("handles emojis in text", () => {
      let view = tempEditor({ doc: doc(p("👋 Hello 🌍 World 🚀")) });

      // Should not crash with emojis
      let coords1 = view.coordsAtPos(1);
      let coords2 = view.coordsAtPos(5);
      let coords3 = view.coordsAtPos(10);

      ist(coords1 !== undefined);
      ist(coords2 !== undefined);
      ist(coords3 !== undefined);

      // Verify coordinates progression (emojis may have special width)
      ist(coords1.left >= 0);
      ist(coords2.left >= 0);
      ist(coords3.left >= 0);

      // posAtCoords should work with emojis
      let pos = view.posAtCoords({ left: coords2.left, top: coords2.top });
      ist(pos !== null);
    });

    it("handles zero-width characters", () => {
      let view = tempEditor({ doc: doc(p("a\u200Db\u200Cc")) });

      // Should not crash with zero-width joiner and non-joiner
      let coords1 = view.coordsAtPos(1);
      let coords2 = view.coordsAtPos(2);
      let coords3 = view.coordsAtPos(3);

      ist(coords1 !== undefined);
      ist(coords2 !== undefined);
      ist(coords3 !== undefined);

      ist(coords1.left >= 0);
      ist(coords2.left >= 0);
      ist(coords3.left >= 0);
    });

    it("handles combining diacritical marks", () => {
      let view = tempEditor({ doc: doc(p("e\u0301")) });

      // Should not crash with combining characters
      let coords1 = view.coordsAtPos(1);
      let coords2 = view.coordsAtPos(2);

      ist(coords1 !== undefined);
      ist(coords2 !== undefined);

      ist(coords1.left >= 0);
      ist(coords2.left >= 0);

      // Verify we can get position back
      let pos = view.posAtCoords({ left: coords1.left, top: coords1.top });
      ist(pos !== null);
    });
  });
});

