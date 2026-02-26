[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/view/editor-view/EditorProps

# types/view/editor-view/EditorProps

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[EditorProps](interfaces/EditorProps.md)

</td>
<td>

Props are configuration values that can be passed to an editor view
or included in a plugin. This interface lists the supported props.

The various event-handling functions may all return `true` to
indicate that they handled the given event. The view will then take
care to call `preventDefault` on the event, except with
`handleDOMEvents`, where the handler itself is responsible for that.

How a prop is resolved depends on the prop. Handler functions are
called one at a time, starting with the base props and then
searching through the plugins (in order of appearance) until one of
them returns true. For some props, the first plugin that yields a
value gets precedence.

The optional type parameter refers to the type of `this` in prop
functions, and is used to pass in the plugin type when defining a
[plugin](#state.Plugin).

</td>
</tr>
</tbody>
</table>
