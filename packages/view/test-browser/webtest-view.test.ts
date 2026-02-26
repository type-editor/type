import {describe, it} from 'vitest';
import {doc, em, hr, li, p, schema, strong, ul} from '@type-editor/test-builder';
import {Schema} from '@type-editor/model';
import ist from "ist";
import {tempEditor} from './view';
import {EditorView} from '@src/EditorView';
import {EditorState, Plugin} from "@type-editor/state";
import {ELEMENT_NODE} from "@type-editor/commons";


describe("EditorView", () => {
  it("can mount an existing node", () => {
    document.body.innerHTML = '<div id="workspace"></div>';
    let space = document.querySelector("#workspace")!;
    let dom = space.appendChild(document.createElement("article"));
    let view = new EditorView({ mount: dom }, {
      state: EditorState.create({ doc: doc(p("hi")) })
    });
    ist(view.dom, dom);
    ist(dom.contentEditable, "true");
    ist(dom.firstChild!.nodeName, "P");
    view.destroy();
    ist(dom.contentEditable, "inherit");
    space.removeChild(dom);
  });

  it("reflects the current state in .props", () => {
    let view = tempEditor();
    ist(view.state, view.props.state);
    view.dispatch(view.state.transaction.insertText("x"));
    ist(view.state, view.props.state);
  });

  it("can update props with setProp", () => {
    let view = tempEditor({ scrollThreshold: 100 });
    view.setProps({
      scrollThreshold: undefined,
      scrollMargin: 10,
      state: view.state.apply(view.state.transaction.insertText("y"))
    });
    ist(view.state.doc.content.size, 3);
    ist(view.props.scrollThreshold, null);
    ist(view.props.scrollMargin, 10);
  });

  it("can update with a state using a different schema", () => {
    let testSchema: Schema = new Schema({ nodes: schema.spec.nodes });
    let view = tempEditor({ doc: doc(p(strong("foo"))) });
    view.updateState(EditorState.create({ doc: (testSchema.nodes as any).doc.createAndFill() }));
    ist(!view.dom.querySelector("strong"));
  });

  it("calls handleScrollToSelection when appropriate", () => {
    let called = 0;
    let view = tempEditor({
      doc: doc(p("foo")),
      handleScrollToSelection() { called++; return false; }
    });
    view.focus();
    view.dispatch(view.state.transaction.scrollIntoView());
    ist(called, 1);
  });

  it("can be queried for the DOM position at a doc position", () => {
    let view = tempEditor({ doc: doc(ul(li(p(strong("foo"))))) });
    let inText = view.domAtPos(4);
    ist(inText.offset, 1);
    ist(inText.node.nodeValue, "foo");
    let beforeLI = view.domAtPos(1);
    ist(beforeLI.offset, 0);
    ist(beforeLI.node.nodeName, "UL");
    let afterP = view.domAtPos(7);
    ist(afterP.offset, 1);
    ist(afterP.node.nodeName, "LI");
  });

  it("can bias DOM position queries to enter nodes", () => {
    let view = tempEditor({ doc: doc(p(em(strong("a"), "b"), "c")) });
    let get = (pos: number, bias: number) => {
      let r = view.domAtPos(pos, bias);
      return (r.node.nodeType == ELEMENT_NODE ? r.node.nodeName : r.node.nodeValue) + "@" + r.offset;
    };
    ist(get(1, 0), "P@0");
    ist(get(1, -1), "P@0");
    ist(get(1, 1), "a@0");
    ist(get(2, -1), "a@1");
    ist(get(2, 0), "EM@1");
    ist(get(2, 1), "b@0");
    ist(get(3, -1), "b@1");
    ist(get(3, 0), "P@1");
    ist(get(3, 1), "c@0");
    ist(get(4, -1), "c@1");
    ist(get(4, 0), "P@2");
    ist(get(4, 1), "P@2");
  });

  it("can be queried for a node's DOM representation", () => {
    let view = tempEditor({ doc: doc(p("foo"), hr()) });
    ist(view.nodeDOM(0)!.nodeName, "P");
    ist(view.nodeDOM(5)!.nodeName, "HR");
    ist(view.nodeDOM(3), null);
  });

  it("can map DOM positions to doc positions", () => {
    let view = tempEditor({ doc: doc(p("foo"), hr()) });
    ist(view.posAtDOM(view.dom.firstChild!.firstChild!, 2), 3);
    ist(view.posAtDOM(view.dom, 1), 5);
    ist(view.posAtDOM(view.dom, 2), 6);
    ist(view.posAtDOM(view.dom.lastChild!, 0, -1), 5);
    ist(view.posAtDOM(view.dom.lastChild!, 0, 1), 6);
  });

  it("binds this to itself in dispatchTransaction prop", () => {
    const dom = document.createElement("div");
    let thisBinding;
    let view = new EditorView(dom, {
      state: EditorState.create({ doc: doc(p("hi")) }),
      dispatchTransaction: function () {
        thisBinding = this;
      }
    });
    view.dispatch(view.state.transaction.insertText("x"));
    ist(view, thisBinding);
  });

  it("can serialize editor state to JSON", () => {
    let view = tempEditor({ doc: doc(p("hello world")) });
    let json = view.toJSON();
    ist(typeof json, "string");
    let parsed = JSON.parse(json);
    ist(parsed.doc);
    ist(parsed.doc.type, "doc");
  });

  it("toJSON preserves document content", () => {
    let view = tempEditor({ doc: doc(p("test content"), p(strong("bold"))) });
    let json = view.toJSON();
    let parsed = JSON.parse(json);
    // Check that content structure is preserved
    ist(parsed.doc.content);
    ist(parsed.doc.content[0].type, "paragraph");
    ist(parsed.doc.content[1].type, "paragraph");
  });

  it("toJSON accepts optional pluginFields parameter", () => {
    let view = tempEditor({ doc: doc(p("test")) });
    // Should not throw when passing pluginFields
    let json = view.toJSON({});
    ist(typeof json, "string");
    JSON.parse(json); // Should parse without error
  });

  it("exports HTML content without ProseMirror classes", () => {
    let view = tempEditor({ doc: doc(p("hello world"), p(strong("bold text"))) });
    let html = view.toHtml();
    // Should contain the content
    ist(html.includes("hello world"));
    ist(html.includes("bold text"));
    // Should not contain ProseMirror classes
    ist(!html.includes("ProseMirror"));
    ist(!html.includes("prosemirror"));
  });

  it("toHtml removes all ProseMirror-prefixed classes", () => {
    let view = tempEditor({ doc: doc(p("test")) });
    // Add a custom ProseMirror class to the DOM
    view.dom.classList.add("ProseMirror-custom");
    let html = view.toHtml();
    ist(!html.includes("ProseMirror-custom"));
  });

  it("can add a plugin dynamically with addPlugin", () => {
    let view = tempEditor({ doc: doc(p("test")) });
    let pluginViewCreated = false;
    let plugin = new Plugin({
      props: {},
      view() {
        pluginViewCreated = true;
        return {};
      }
    });
    view.addPlugin(plugin);
    ist(pluginViewCreated, true);
  });

  it("addPlugin throws error if plugin has state component", () => {
    let view = tempEditor({ doc: doc(p("test")) });
    let plugin = new Plugin({
      state: {
        init() { return null; },
        apply() { return null; }
      }
    });
    let threw = false;
    try {
      view.addPlugin(plugin);
    } catch (e) {
      threw = true;
      ist(e instanceof RangeError);
    }
    ist(threw, true);
  });

  it("addPlugin throws error if plugin has filterTransaction", () => {
    let view = tempEditor({ doc: doc(p("test")) });
    let plugin = new Plugin({
      filterTransaction: () => true
    });
    let threw = false;
    try {
      view.addPlugin(plugin);
    } catch (e) {
      threw = true;
      ist(e instanceof RangeError);
    }
    ist(threw, true);
  });

  it("addPlugin throws error if plugin has appendTransaction", () => {
    let view = tempEditor({ doc: doc(p("test")) });
    let plugin = new Plugin({
      appendTransaction: () => null
    });
    let threw = false;
    try {
      view.addPlugin(plugin);
    } catch (e) {
      threw = true;
      ist(e instanceof RangeError);
    }
    ist(threw, true);
  });
});
