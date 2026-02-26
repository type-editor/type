# @type-editor/adapter-vue

Vue 3 adapter for integrating custom Vue components as ProseMirror node views, mark views, plugin views, and widget
decorations.

## Overview

`@type-editor/adapter-vue` bridges ProseMirror's view layer and Vue 3's rendering pipeline. Each ProseMirror node, mark,
plugin view, or widget decoration can be backed by an ordinary Vue component. Reactive state is passed to components via
Vue's `provide`/`inject` mechanism using `ShallowRef`s; rendering happens via Vue `Teleport`.

## Installation

```bash
npm install @type-editor/adapter-vue
# or
pnpm add @type-editor/adapter-vue
```

**Peer dependencies:** `vue ^3.0.0`

## Setup

Wrap the component that contains your editor with `ProsemirrorAdapterProvider`. This component sets up the rendering
infrastructure and makes the factory composables available to all descendants via Vue's `inject`.

```vue
<!-- App.vue -->
<script setup lang="ts">
    import { ProsemirrorAdapterProvider } from '@type-editor/adapter-vue';
    import Editor from './Editor.vue';
</script>

<template>
    <ProsemirrorAdapterProvider>
        <Editor />
    </ProsemirrorAdapterProvider>
</template>
```

## Usage

As this is a fork of `@prosemirror-adapter/vue`, you'll find more documentation and examples in the original
repository: https://github.com/prosekit/prosemirror-adapter/tree/main/packages/vue

### Node views

#### 1. Create a Vue component

Access the current node and editor state through `useNodeViewContext`. Reactive properties are exposed as `ShallowRef`s
so Vue's reactivity system picks up changes automatically:

```vue
<!-- Paragraph.vue -->
<script setup lang="ts">
    import { useNodeViewContext } from '@type-editor/adapter-vue';
    import { watchEffect } from 'vue';

    const { dom, node } = useNodeViewContext();

    watchEffect(() => {
        if (!dom) return;
        if (node.value?.attrs?.align) {
            dom.style.textAlign = node.value.attrs.align as string;
        }
    });
</script>

<!-- No template output when contentAs: 'self' – ProseMirror manages the content. -->
<template></template>
```

When you need a content-editable region inside your component, bind `contentRef` to the wrapper element:

```vue

<script setup lang="ts">
    import { useNodeViewContext } from '@type-editor/adapter-vue';

    const { contentRef } = useNodeViewContext();
</script>

<template>
    <div :ref="contentRef" />
</template>
```

#### 2. Create a node view factory

Use `useNodeViewFactory` inside a component that is a descendant of `ProsemirrorAdapterProvider`:

```vue
<!-- Editor.vue -->
<script setup lang="ts">
    import { useNodeViewFactory } from '@type-editor/adapter-vue';
    import { PmNode } from '@type-editor/model';
    import Paragraph from './Paragraph.vue';

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

```vue
<!-- BoldMark.vue -->
<script setup lang="ts">
    import { useMarkViewContext } from '@type-editor/adapter-vue';

    const { contentRef } = useMarkViewContext();
</script>
<template><strong :ref="contentRef" /></template>
```

```ts
// In your editor component:
const markViewFactory = useMarkViewFactory();
const boldView = markViewFactory({ component: BoldMark });
```

### Plugin views

```vue
<!-- Toolbar.vue -->
<script setup lang="ts">
    import { usePluginViewContext } from '@type-editor/adapter-vue';

    const { view } = usePluginViewContext();
</script>
<template>
    <div class="toolbar">…</div>
</template>
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

### `ProsemirrorAdapterProvider`

Vue component. Must wrap any component that uses the factory composables.

### Composables

| Composable               | Returns             | Description                                                           |
|--------------------------|---------------------|-----------------------------------------------------------------------|
| `useNodeViewFactory()`   | `NodeViewFactory`   | Creates a ProseMirror `NodeViewConstructor` backed by a Vue component |
| `useMarkViewFactory()`   | `MarkViewFactory`   | Creates a ProseMirror `MarkViewConstructor` backed by a Vue component |
| `usePluginViewFactory()` | `PluginViewFactory` | Creates a ProseMirror `PluginView` factory backed by a Vue component  |
| `useWidgetViewFactory()` | `WidgetViewFactory` | Creates a widget decoration factory backed by a Vue component         |
| `useNodeViewContext()`   | `NodeViewContext`   | Reads reactive editor state inside a node view component              |
| `useMarkViewContext()`   | `MarkViewContext`   | Reads reactive editor state inside a mark view component              |
| `usePluginViewContext()` | `PluginViewContext` | Reads reactive editor state inside a plugin view component            |
| `useWidgetViewContext()` | `WidgetViewContext` | Reads reactive editor state inside a widget view component            |

### `NodeViewContext`

| Property           | Type                                      | Description                                                    |
|--------------------|-------------------------------------------|----------------------------------------------------------------|
| `contentRef`       | `VNodeRef`                                | Ref callback/ref for the content-editable container            |
| `dom`              | `HTMLElement`                             | The outer DOM element of this node view                        |
| `view`             | `PmEditorView`                            | The ProseMirror editor view                                    |
| `getPos`           | `() => number \| undefined`               | Returns the node's current document position                   |
| `setAttrs`         | `(attrs: Attrs) => void`                  | Dispatches a transaction updating the node's attributes        |
| `node`             | `ShallowRef<Node>`                        | Reactive ref to the current ProseMirror document node          |
| `selected`         | `ShallowRef<boolean>`                     | Reactive ref indicating whether this node is selected          |
| `decorations`      | `ShallowRef<ReadonlyArray<PmDecoration>>` | Reactive ref to the decorations applied to this node           |
| `innerDecorations` | `ShallowRef<DecorationSource>`            | Reactive ref to the decorations applied to this node's content |

## License

[MIT](../../LICENSE)
