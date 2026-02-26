import {describe, it} from 'vitest';
import ist from 'ist';
import {doc, p} from '@type-editor/test-builder';
import {tempEditor} from './view';
import {Decoration, DecorationSet} from '@type-editor/decoration';
import {Plugin} from '@type-editor/state';

describe("EditorView props and plugins", () => {
  describe("props handling", () => {
    it("accepts custom props", () => {
      let called = false;
      let view = tempEditor({
        doc: doc(p("test")),
        handleClick: () => {
          called = true;
          return false;
        }
      });

      ist(view.props.handleClick);
    });

    it("updates props with setProps", () => {
      let view = tempEditor({ doc: doc(p("test")) });

      view.setProps({
        editable: () => false
      });

      ist(view.props.editable);
      ist(!view.props.editable!(view.state));
    });

    it("maintains state across prop updates", () => {
      let view = tempEditor({ doc: doc(p("original")) });
      let oldDoc = view.state.doc;

      view.setProps({
        scrollThreshold: 50
      });

      ist(view.state.doc, oldDoc);
    });
  });

  describe("plugin views", () => {
    it("initializes plugin views", () => {
      let initialized = false;

      let plugin = new Plugin({
        view() {
          initialized = true;
          return {
            update() {},
            destroy() {}
          };
        }
      });

      let view = tempEditor({
        doc: doc(p("test")),
        plugins: [plugin]
      });

      ist(initialized);
    });

    it("calls plugin view update", () => {
      let updateCount = 0;

      let plugin = new Plugin({
        view() {
          return {
            update() {
              updateCount++;
            },
            destroy() {}
          };
        }
      });

      let view = tempEditor({
        doc: doc(p("test")),
        plugins: [plugin]
      });

      view.dispatch(view.state.transaction.insertText("x"));

      ist(updateCount > 0);
    });

    it("destroys plugin views on editor destroy", () => {
      let destroyed = false;

      let plugin = new Plugin({
        view() {
          return {
            update() {},
            destroy() {
              destroyed = true;
            }
          };
        }
      });

      let view = tempEditor({
        doc: doc(p("test")),
        plugins: [plugin]
      });

      view.destroy();
      ist(destroyed);
    });
  });

  describe("decorations", () => {
    it("renders widget decorations", () => {
      let widget = document.createElement('span');
      widget.textContent = '🎨';

      let plugin = new Plugin({
        props: {
          decorations(state) {
            return DecorationSet.create(state.doc, [
                Decoration.widget(1, widget)
            ]);
          }
        }
      });

      let view = tempEditor({
        doc: doc(p("test")),
        plugins: [plugin]
      });

      ist(view.dom.textContent!.includes('🎨'));
    });

    it("renders inline decorations", () => {
      let plugin = new Plugin({
        props: {
          decorations(state) {
            return DecorationSet.create(state.doc, [
                Decoration.inline(1, 3, { class: 'highlighted' })
            ]);
          }
        }
      });

      let view = tempEditor({
        doc: doc(p("test")),
        plugins: [plugin]
      });

      ist(view.dom.querySelector('.highlighted'));
    });

    it("updates decorations on state change", () => {
      let decorationPos = 1;

      let plugin = new Plugin({
        props: {
          decorations(state) {
            return DecorationSet.create(state.doc, [
                Decoration.inline(decorationPos, decorationPos + 2, {
                class: 'marked'
              })
            ]);
          }
        }
      });

      let view = tempEditor({
        doc: doc(p("test")),
        plugins: [plugin]
      });

      ist(view.dom.querySelector('.marked'));

      view.dispatch(view.state.transaction.insertText("X", 1));

      // Decoration should still be present
      ist(view.dom.querySelector('.marked'));
    });
  });

  describe("event handlers", () => {
    it("calls handleDOMEvents handler", () => {
      let clicked = false;

      let view = tempEditor({
        doc: doc(p("clickable")),
        handleDOMEvents: {
          click() {
            clicked = true;
            return false;
          }
        }
      });

      view.dom.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      }));

      ist(clicked);
    });

    it("handleKeyDown intercepts key events", () => {
      let intercepted = false;

      let view = tempEditor({
        doc: doc(p("test")),
        handleKeyDown() {
          intercepted = true;
          return false;
        }
      });

      view.dom.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
        cancelable: true
      }));

      ist(intercepted);
    });

    it("handleKeyPress is available as a prop", () => {
      let view = tempEditor({
        doc: doc(p("test")),
        handleKeyPress() {
          return false;
        }
      });

      ist(view.props.handleKeyPress);
    });
  });

  describe("editable prop", () => {
    it("makes editor non-editable when editable returns false", () => {
      let view = tempEditor({
        doc: doc(p("readonly")),
        editable: () => false
      });

      ist(view.dom.contentEditable, 'inherit');
    });

    it("makes editor editable when editable returns true", () => {
      let view = tempEditor({
        doc: doc(p("editable")),
        editable: () => true
      });

      ist(view.dom.contentEditable, 'true');
    });

    it("updates editability when prop changes", () => {
      let view = tempEditor({
        doc: doc(p("test")),
        editable: () => true
      });

      ist(view.dom.contentEditable, 'true');

      view.setProps({
        editable: () => false
      });

      console.log(view.dom.contentEditable)

      ist(view.dom.contentEditable, 'inherit');
    });
  });

  describe("transformPasted", () => {
    it("allows transformation of pasted content", () => {
      let transformed = false;

      let view = tempEditor({
        doc: doc(p("test")),
        transformPasted: (slice) => {
          transformed = true;
          return slice;
        }
      });

      let clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', 'pasted');

      view.dom.dispatchEvent(new ClipboardEvent('paste', {
        clipboardData,
        bubbles: true,
        cancelable: true
      }));

      // transformPasted should have been called
      ist(transformed);
    });
  });

  describe("scrollThreshold and scrollMargin", () => {
    it("accepts scrollThreshold prop", () => {
      let view = tempEditor({
        doc: doc(p("test")),
        scrollThreshold: 100
      });

      ist(view.someProp('scrollThreshold'), 100);
    });

    it("accepts scrollMargin prop", () => {
      let view = tempEditor({
        doc: doc(p("test")),
        scrollMargin: 20
      });

      ist(view.someProp('scrollMargin'), 20);
    });
  });

  describe("attributes", () => {
    it("applies attributes to editor DOM", () => {
      let view = tempEditor({
        doc: doc(p("test")),
        attributes: {
          'data-test': 'value',
          'class': 'custom-editor'
        }
      });

      ist(view.dom.getAttribute('data-test'), 'value');
      ist(view.dom.classList.contains('custom-editor'));
    });

    it("updates attributes when props change", () => {
      let view = tempEditor({
        doc: doc(p("test"))
      });

      view.setProps({
        attributes: {
          'data-dynamic': 'updated'
        }
      });

      ist(view.dom.getAttribute('data-dynamic'), 'updated');
    });
  });
});

