# @type-editor/adapter-svelte

Svelte adapter for integrating custom Svelte components as ProseMirror node views, mark views, plugin views, and widget
decorations.

## Overview

`@type-editor/adapter-svelte` bridges ProseMirror's view layer and Svelte's rendering pipeline. Each ProseMirror node,
mark, plugin view, or widget decoration can be backed by an ordinary Svelte component. Reactive state is passed to
components via Svelte's context API using writable stores; rendering happens via direct Svelte mounting.

## Installation

```bash
npm install @type-editor/adapter-svelte
# or
pnpm add @type-editor/adapter-svelte
```

**Peer dependencies:** `svelte ^4.0.0 || ^5.0.0`

## Setup

Call `useProsemirrorAdapterProvider` inside the `<script>` block of the root Svelte component that contains your editor.
This wires up the rendering infrastructure and makes the factory functions available to all descendants via Svelte's
`getContext`.

```svelte
<!-- App.svelte -->
<script lang="ts">
    import { useProsemirrorAdapterProvider } from '@type-editor/adapter-svelte';
    import Editor from './Editor.svelte';

    useProsemirrorAdapterProvider();
</script>

<main>
    <Editor />
</main>
```

## Usage

As this is a fork of `@prosemirror-adapter/svelte`, you'll find more documentation and examples in the original
repository: https://github.com/prosekit/prosemirror-adapter/tree/main/packages/svelte

### Node views

#### 1. Create a Svelte component

Access editor state through `useNodeViewContext`. Reactive properties are exposed as Svelte writable stores so the
template reacts to changes automatically:

```svelte
<!-- Paragraph.svelte -->
<script lang="ts">
    import { useNodeViewContext } from '@type-editor/adapter-svelte';
    import { onMount } from 'svelte';

    const dom = useNodeViewContext('dom');
    const nodeStore = useNodeViewContext('node');

    function applyStyles(node: typeof $nodeStore) {
        if (!dom) return;
        if (node.attrs.align) {
            dom.style.textAlign = node.attrs.align as string;
        }
    }

    onMount(() => applyStyles($nodeStore));
    $: applyStyles($nodeStore);
</script>

<!-- No template output when contentAs: 'self' – ProseMirror manages the content. -->
```

When you need a content-editable region inside your component, use `contentRef`:

```svelte
<script lang="ts">
    import { useNodeViewContext } from '@type-editor/adapter-svelte';
    const contentRef = useNodeViewContext('contentRef');
</script>

<div use:contentRef />
```

#### 2. Create a node view factory

Use `useNodeViewFactory` inside a component that is a descendant of `useProsemirrorAdapterProvider`:

```svelte
<!-- Editor.svelte -->
<script lang="ts">
    import { useNodeViewFactory } from '@type-editor/adapter-svelte';
    import { PmNode } from '@type-editor/model';
    import Paragraph from './Paragraph.svelte';

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
</script>
```

### Mark views

```svelte
<!-- BoldMark.svelte -->
<script lang="ts">
    import { useMarkViewContext } from '@type-editor/adapter-svelte';
    const contentRef = useMarkViewContext('contentRef');
</script>
<strong use:contentRef />
```

```ts
// In your editor component:
const markViewFactory = useMarkViewFactory();
const boldView = markViewFactory({ component: BoldMark });
```

### Plugin views

```svelte
<!-- Toolbar.svelte -->
<script lang="ts">
    import { usePluginViewContext } from '@type-editor/adapter-svelte';
    const view = usePluginViewContext('view');
</script>
<div class="toolbar">…</div>
```

```ts
// In your editor component:
const pluginViewFactory = usePluginViewFactory();
const toolbarPlugin = new Plugin({
    view: pluginViewFactory({ component: Toolbar }),
});
```

### Widget views

```ts
// In your editor component:
const widgetViewFactory = useWidgetViewFactory();
const decoration = widgetViewFactory(pos, { component: MyWidget });
```

## API reference

### `useProsemirrorAdapterProvider()`

Setup function. Must be called in the `<script>` block of an ancestor component before any factory functions are used.

### Factory functions

| Function                 | Returns             | Description                                                              |
|--------------------------|---------------------|--------------------------------------------------------------------------|
| `useNodeViewFactory()`   | `NodeViewFactory`   | Creates a ProseMirror `NodeViewConstructor` backed by a Svelte component |
| `useMarkViewFactory()`   | `MarkViewFactory`   | Creates a ProseMirror `MarkViewConstructor` backed by a Svelte component |
| `usePluginViewFactory()` | `PluginViewFactory` | Creates a ProseMirror `PluginView` factory backed by a Svelte component  |
| `useWidgetViewFactory()` | `WidgetViewFactory` | Creates a widget decoration factory backed by a Svelte component         |

### Context functions

| Function                    | Returns                  | Description                                          |
|-----------------------------|--------------------------|------------------------------------------------------|
| `useNodeViewContext(key)`   | `NodeViewContext[key]`   | Reads a single property from the node view context   |
| `useMarkViewContext(key)`   | `MarkViewContext[key]`   | Reads a single property from the mark view context   |
| `usePluginViewContext(key)` | `PluginViewContext[key]` | Reads a single property from the plugin view context |
| `useWidgetViewContext(key)` | `WidgetViewContext[key]` | Reads a single property from the widget view context |

All context functions accept a single string key naming the property to retrieve. This matches Svelte's context model
where each key is set individually.

### `NodeViewContext`

| Property           | Type                                     | Description                                                              |
|--------------------|------------------------------------------|--------------------------------------------------------------------------|
| `contentRef`       | `(element: HTMLElement \| null) => void` | Callback to attach the content-editable container                        |
| `dom`              | `HTMLElement`                            | The outer DOM element of this node view                                  |
| `view`             | `PmEditorView`                           | The ProseMirror editor view                                              |
| `getPos`           | `() => number \| undefined`              | Returns the node's current document position                             |
| `setAttrs`         | `(attrs: Attrs) => void`                 | Dispatches a transaction updating the node's attributes                  |
| `node`             | `Writable<Node>`                         | Writable store containing the current ProseMirror document node          |
| `selected`         | `Writable<boolean>`                      | Writable store indicating whether this node is selected                  |
| `decorations`      | `Writable<ReadonlyArray<PmDecoration>>`  | Writable store containing the decorations applied to this node           |
| `innerDecorations` | `Writable<DecorationSource>`             | Writable store containing the decorations applied to this node's content |

## License

[MIT](../../LICENSE)
