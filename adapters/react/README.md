# @type-editor/adapter-react

React adapter for integrating custom React components as ProseMirror node views, mark views, plugin views, and widget
decorations.

## Overview

`@type-editor/adapter-react` bridges ProseMirror's view layer and React's rendering pipeline. Each ProseMirror node,
mark, plugin view, or widget decoration can be backed by an ordinary React component. State changes are propagated
through React context; rendering happens via React portals.

## Installation

```bash
npm install @type-editor/adapter-react
# or
pnpm add @type-editor/adapter-react
```

**Peer dependencies:** `react`, `react-dom`

## Setup

Wrap the component that contains your editor with `ProsemirrorAdapterProvider`. This sets up the rendering
infrastructure and makes the factory hooks available to all descendant components.

```tsx
import { ProsemirrorAdapterProvider } from '@type-editor/adapter-react';
import { createRoot } from 'react-dom/client';
import { Editor } from './Editor';

createRoot(document.getElementById('app')!).render(
    <ProsemirrorAdapterProvider>
        <Editor />
    </ProsemirrorAdapterProvider>
);
```

## Usage

As this is a fork of `@prosemirror-adapter/react`, you'll find more documentation and examples in the original
repository: https://github.com/prosekit/prosemirror-adapter/tree/main/packages/react

### Node views

#### 1. Create a React component

Access the current node, decorations, and editor state through `useNodeViewContext`:

```tsx
import { useNodeViewContext } from '@type-editor/adapter-react';
import { useEffect } from 'react';

export function Paragraph() {
    const { dom, node, contentRef } = useNodeViewContext();

    useEffect(() => {
        if (!dom) return;
        if (node.attrs.align) {
            dom.style.textAlign = node.attrs.align as string;
        }
    }, [dom, node]);

    // Render nothing – ProseMirror manages the content directly inside `dom`
    // when contentAs: 'self' is used.
    return null;
}
```

When you need a content-editable region inside your component, attach `contentRef` to the wrapper element:

```tsx
export function MyNode() {
    const { contentRef } = useNodeViewContext();
    return <div ref={contentRef} />;
}
```

#### 2. Create a node view factory

Use `useNodeViewFactory` inside a component that is a descendant of `ProsemirrorAdapterProvider`:

```tsx
import { useNodeViewFactory } from '@type-editor/adapter-react';
import { PmNode } from '@type-editor/model';
import { Paragraph } from './Paragraph';

export function Editor() {
    const nodeViewFactory = useNodeViewFactory();

    const paragraphView = nodeViewFactory({
        component: Paragraph,
        as: (node: PmNode): HTMLElement => {
            const p = document.createElement('p');
            if (node.attrs.align) p.style.textAlign = node.attrs.align;
            return p;
        },
        contentAs: 'self',
    });

    // Pass to ProseMirror's EditorView
    const editorView = new EditorView(container, {
        state,
        nodeViews: { paragraph: paragraphView },
    });
}
```

### Mark views

```tsx
import { useMarkViewContext, useMarkViewFactory } from '@type-editor/adapter-react';

export function BoldMark() {
    const { contentRef } = useMarkViewContext();
    return <strong ref={contentRef} />;
}

// In your editor component:
const markViewFactory = useMarkViewFactory();
const boldView = markViewFactory({ component: BoldMark });
```

### Plugin views

```tsx
import { usePluginViewContext, usePluginViewFactory } from '@type-editor/adapter-react';

export function Toolbar() {
    const { view } = usePluginViewContext();
    // render toolbar using the editor view
    return <div className="toolbar">…</div>;
}

// In your editor component:
const pluginViewFactory = usePluginViewFactory();
const toolbarPlugin = new Plugin({
    view: pluginViewFactory({ component: Toolbar }),
});
```

### Widget views

```tsx
import { useWidgetViewFactory } from '@type-editor/adapter-react';

// In your editor component:
const widgetViewFactory = useWidgetViewFactory();
const decoration = widgetViewFactory(pos, { component: MyWidget });
```

## API reference

### `ProsemirrorAdapterProvider`

Provider component. Must wrap any component that uses the factory hooks.

### Hooks

| Hook                     | Returns             | Description                                                             |
|--------------------------|---------------------|-------------------------------------------------------------------------|
| `useNodeViewFactory()`   | `NodeViewFactory`   | Creates a ProseMirror `NodeViewConstructor` backed by a React component |
| `useMarkViewFactory()`   | `MarkViewFactory`   | Creates a ProseMirror `MarkViewConstructor` backed by a React component |
| `usePluginViewFactory()` | `PluginViewFactory` | Creates a ProseMirror `PluginView` factory backed by a React component  |
| `useWidgetViewFactory()` | `WidgetViewFactory` | Creates a widget decoration factory backed by a React component         |
| `useNodeViewContext()`   | `NodeViewContext`   | Reads editor state inside a node view component                         |
| `useMarkViewContext()`   | `MarkViewContext`   | Reads editor state inside a mark view component                         |
| `usePluginViewContext()` | `PluginViewContext` | Reads editor state inside a plugin view component                       |
| `useWidgetViewContext()` | `WidgetViewContext` | Reads editor state inside a widget view component                       |

### `NodeViewContext`

| Property           | Type                                | Description                                             |
|--------------------|-------------------------------------|---------------------------------------------------------|
| `contentRef`       | `(el: HTMLElement \| null) => void` | Ref callback for the content-editable container         |
| `dom`              | `HTMLElement`                       | The outer DOM element of this node view                 |
| `view`             | `PmEditorView`                      | The ProseMirror editor view                             |
| `getPos`           | `() => number \| undefined`         | Returns the node's current document position            |
| `setAttrs`         | `(attrs: Attrs) => void`            | Dispatches a transaction updating the node's attributes |
| `node`             | `Node`                              | The current ProseMirror document node                   |
| `selected`         | `boolean`                           | Whether this node is currently selected                 |
| `decorations`      | `ReadonlyArray<PmDecoration>`       | Decorations applied to this node                        |
| `innerDecorations` | `DecorationSource`                  | Decorations applied to this node's content              |

## License

[MIT](../../LICENSE)
