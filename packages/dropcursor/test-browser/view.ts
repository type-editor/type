import {EditorView} from '@type-editor/view';
import {EditorState, Selection, SelectionFactory} from '@type-editor/state';
import {type DirectEditorProps, type PmPlugin} from '@type-editor/editor-types';
import {schema} from '@type-editor/test-builder';
import type {Node} from '@type-editor/model';
import {ELEMENT_NODE, TEXT_NODE} from "@type-editor/commons";


function selFor(doc: Node) {
  const a = doc.tag.a;
  if (a != null) {
    const $a = doc.resolve(a);
    if ($a.parent.inlineContent) {
      return SelectionFactory.createTextSelection($a, doc.tag.b != null ? doc.resolve(doc.tag.b) : undefined);
    } else {
      return SelectionFactory.createNodeSelection($a);
    }
  }
  return Selection.atStart(doc);
}

let tempView: EditorView | null = null;

export function tempEditor(inProps: Partial<DirectEditorProps> & { plugins?: readonly PmPlugin[], doc?: Node; } = {}) {
  // document.body.setAttribute('tabindex', "0");
  document.body.innerHTML = '<div id="workspace" tabindex="0"></div>';
  // document.body.focus();

  let space: HTMLElement = document.querySelector("#workspace");
  space.focus();

  if (tempView) {
    tempView.destroy();
    tempView = null;
  }

  let props: DirectEditorProps = {} as any;
  for (let n in inProps) {
    if (n != "plugins") {
      (props as any)[n] = (inProps as any)[n];
    }
  }
  props.state = EditorState.create({
    doc: inProps.doc,
    schema,
    selection: inProps.doc ? selFor(inProps.doc) : undefined,
    plugins: inProps ? inProps.plugins : undefined
  });
  tempView = new EditorView(space, props);
  tempView.dom.focus();
  return tempView;
}

export function findTextNode(node: DOMNode, text: string): Text | undefined {
  if (node.nodeType == TEXT_NODE) {
    if (node.nodeValue == text) return node as Text;
  } else if (node.nodeType == ELEMENT_NODE) {
    for (let ch = node.firstChild; ch; ch = ch.nextSibling) {
      let found = findTextNode(ch, text);
      if (found) return found;
    }
  }
}

export function requireFocus(pm: EditorView) {
  if (!document.hasFocus())
    throw new Error("The document doesn't have focus, which is needed for this test");
  pm.focus();
  return pm;
}

export function flush(view: EditorView) {
  // @ts-ignore: view.domObserver is an internal API
  view.domObserver.flush();
}

function getBoundingClientRect(): DOMRect {
  const rec = {
    x: 0,
    y: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  };
  return { ...rec, toJSON: () => rec };
}

class FakeDOMRectList implements DOMRectList {

  private rects: DOMRect[] = [];

  [index: number]: DOMRect;
  public length: number = 0;

  constructor (domRect?: DOMRect) {
    const defaultRect = domRect || getBoundingClientRect();
    this.rects.push(defaultRect);
    this.length = 1;
    this[0] = defaultRect;
  }

    [Symbol.iterator](): ArrayIterator<DOMRect> {
        throw new Error("Method not implemented.");
    }

  public setItem(domRect: DOMRect): void {
    this.rects[0] = domRect;
    this.length = 1;
    this[0] = domRect;
  }

  public item(index: number): DOMRect | null {
    if (index >= 0 && index < this.rects.length) {
      return this.rects[index];
    }
    return null;
  }
}

export interface MockDOMRect {
  x?: number;
  y?: number;
  bottom?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  width?: number;
}

const defaultDOMRectData = {
  x: 0,         // top-left corner (x) of the rectangle
  y: 0,         // top-left corner (y) of the rectangle
  bottom: 0,    // y + height
  height: 0,
  left: 0,      // x
  right: 0,     // x + width
  top: 0,       // y
  width: 0,
};

export function updateClientRectMock(...domRect: Array<MockDOMRect>): void {
  const domRectData = [];
  for(const rectData of domRect) {
    domRectData.push({ ...defaultDOMRectData, ...rectData });
  }

  let count = 0;
  const mockDOMRectFunction = (): DOMRect => {
    const current = Math.min(count++, domRectData.length - 1);
    return { ...domRectData[current], toJSON: () => domRectData[current] };
  };

  document.elementFromPoint = () => null;
  HTMLElement.prototype.getBoundingClientRect = mockDOMRectFunction;
  HTMLElement.prototype.getClientRects = () => new FakeDOMRectList(mockDOMRectFunction());
  Range.prototype.getBoundingClientRect = mockDOMRectFunction;
  Range.prototype.getClientRects = () => new FakeDOMRectList(mockDOMRectFunction());
}

export function initEditorDocument(): void {
  document.body.setAttribute('tabindex', "0");
  document.body.innerHTML = '<div id="workspace"></div>';
  document.body.focus();
  updateClientRectMock({});
}
