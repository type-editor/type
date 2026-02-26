# @type-editor/adapter-core

Framework-agnostic base classes for integrating custom UI components with ProseMirror via the type-editor adapter system. Framework adapters (React, Vue, Svelte) extend these classes and hook into their own rendering pipelines.

## Overview

`@type-editor/adapter-core` provides four abstract base classes – one for each ProseMirror extension point – that handle all the boilerplate of DOM management, lifecycle delegation, and decoration bookkeeping. Framework-specific packages subclass these and add portal/teleport rendering on top.

| Class            | ProseMirror concept | Purpose                                                 |
|------------------|---------------------|---------------------------------------------------------|
| `CoreNodeView`   | `NodeView`          | Renders a document node with a UI component             |
| `CoreMarkView`   | `MarkView`          | Renders an inline mark with a UI component              |
| `CorePluginView` | `PluginView`        | Renders a plugin-owned UI alongside the editor          |
| `CoreWidgetView` | Widget decoration   | Renders an inline widget decoration with a UI component |

## Installation

```bash
npm install @type-editor/adapter-core
# or
pnpm add @type-editor/adapter-core
```

## API

### `CoreNodeView<ComponentType>`

Base class for custom node views. Implements the ProseMirror `NodeView` interface.

**Constructor** receives a `CoreNodeViewSpec<ComponentType>`:

| Property           | Type                                     | Description                                  |
|--------------------|------------------------------------------|----------------------------------------------|
| `node`             | `Node`                                   | The ProseMirror document node                |
| `view`             | `PmEditorView`                           | The editor view                              |
| `getPos`           | `() => number \| undefined`              | Returns the node's current document position |
| `decorations`      | `ReadonlyArray<PmDecoration>`            | Decorations applied to the node              |
| `innerDecorations` | `DecorationSource`                       | Decorations applied to the node's content    |
| `options`          | `CoreNodeViewUserOptions<ComponentType>` | User configuration (see below)               |

**`CoreNodeViewUserOptions<Component>`**

| Option           | Type                                               | Description                                                     |
|------------------|----------------------------------------------------|-----------------------------------------------------------------|
| `component`      | `Component`                                        | The UI component to render *(required)*                         |
| `as`             | `NodeViewDOMSpec`                                  | Outer DOM element spec (tag name, element, or factory function) |
| `contentAs`      | `NodeViewContentDOMSpec \| 'self'`                 | Content DOM element spec; `'self'` makes `contentDOM === dom`   |
| `update`         | `(node, decorations, innerDecorations) => boolean` | Custom update handler                                           |
| `ignoreMutation` | `(mutation) => boolean`                            | Custom mutation filter                                          |
| `selectNode`     | `() => void`                                       | Called when the node is selected                                |
| `deselectNode`   | `() => void`                                       | Called when the node is deselected                              |
| `setSelection`   | `(anchor, head, root) => void`                     | Custom selection drawing                                        |
| `stopEvent`      | `(event) => boolean`                               | Prevents ProseMirror from handling a DOM event                  |
| `destroy`        | `() => void`                                       | Called when the node view is destroyed                          |
| `onUpdate`       | `() => void`                                       | Called after a successful update                                |

---

### `CoreMarkView<ComponentType>`

Base class for custom mark views. Implements the ProseMirror `MarkView` interface.

**Constructor** receives a `CoreMarkViewSpec<ComponentType>`:

| Property  | Type                                     | Description                                   |
|-----------|------------------------------------------|-----------------------------------------------|
| `mark`    | `Mark`                                   | The ProseMirror mark                          |
| `view`    | `PmEditorView`                           | The editor view                               |
| `inline`  | `boolean`                                | Whether the mark appears in an inline context |
| `options` | `CoreMarkViewUserOptions<ComponentType>` | User configuration (see below)                |

**`CoreMarkViewUserOptions<Component>`**

| Option           | Type                                 | Description                             |
|------------------|--------------------------------------|-----------------------------------------|
| `component`      | `Component`                          | The UI component to render *(required)* |
| `as`             | `MarkViewDOMSpec`                    | Outer DOM element spec                  |
| `contentAs`      | `MarkViewDOMSpec`                    | Content DOM element spec                |
| `ignoreMutation` | `(mutation) => boolean \| undefined` | Custom mutation filter                  |
| `destroy`        | `() => void`                         | Called when the mark view is destroyed  |

---

### `CorePluginView<ComponentType>`

Base class for plugin views. Implements the ProseMirror `PluginView` interface.

**Constructor** receives a `CorePluginViewSpec<ComponentType>`:

| Property  | Type                                       | Description                    |
|-----------|--------------------------------------------|--------------------------------|
| `view`    | `PmEditorView`                             | The editor view                |
| `options` | `CorePluginViewUserOptions<ComponentType>` | User configuration (see below) |

**`CorePluginViewUserOptions<Component>`**

| Option      | Type                                    | Description                                              |
|-------------|-----------------------------------------|----------------------------------------------------------|
| `component` | `Component`                             | The UI component to render *(required)*                  |
| `root`      | `(viewDOM: HTMLElement) => HTMLElement` | Returns the container element for the rendered component |
| `update`    | `(view, prevState) => void`             | Called after every transaction                           |
| `destroy`   | `() => void`                            | Called when the plugin view is torn down                 |

---

### `CoreWidgetView<ComponentType>`

Base class for widget decoration views.

**Constructor** receives a `CoreWidgetViewSpec<ComponentType>`:

| Property  | Type                                       | Description                     |
|-----------|--------------------------------------------|---------------------------------|
| `pos`     | `number`                                   | Document position of the widget |
| `spec`    | `WidgetDecorationSpec`                     | Optional decoration options     |
| `options` | `CoreWidgetViewUserOptions<ComponentType>` | User configuration (see below)  |

**`CoreWidgetViewUserOptions<Component>`**

| Option      | Type                    | Description                                     |
|-------------|-------------------------|-------------------------------------------------|
| `component` | `Component`             | The UI component to render *(required)*         |
| `as`        | `string \| HTMLElement` | Root DOM element (tag name or element instance) |

Call `widgetView.bind(view, getPos)` after the widget DOM has been inserted into the document.

---

## Extending

Framework adapters subclass `CoreNodeView` (and the other base classes) to plug into their rendering pipelines:

```ts
import { CoreNodeView } from '@type-editor/adapter-core';

class MyFrameworkNodeView extends CoreNodeView<MyComponent> {
    render() {
        // Mount MyComponent into this.dom using the framework's portal/teleport API
    }

    updateContext() {
        // Propagate this.node, this.selected, etc. to the framework component
    }
}
```

## License

[MIT](../../LICENSE)
