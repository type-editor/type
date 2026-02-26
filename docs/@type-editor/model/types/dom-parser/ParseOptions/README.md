[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / types/dom-parser/ParseOptions

# types/dom-parser/ParseOptions

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

[ParseOptions](interfaces/ParseOptions.md)

</td>
<td>

Configuration options recognized by the DOM parser's parse and parseSlice methods.
These options control how DOM content is converted into ProseMirror document structure.

**Example**

```typescript
const options: ParseOptions = {
  preserveWhitespace: "full",
  from: 0,
  to: 5,
  findPositions: [{ node: someNode, offset: 10 }],
};
```

</td>
</tr>
</tbody>
</table>
