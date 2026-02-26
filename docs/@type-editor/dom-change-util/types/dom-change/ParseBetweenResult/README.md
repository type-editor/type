[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / types/dom-change/ParseBetweenResult

# types/dom-change/ParseBetweenResult

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

[ParseBetweenResult](interfaces/ParseBetweenResult.md)

</td>
<td>

Represents the result of parsing a DOM range into a ProseMirror document.

This interface encapsulates all information extracted from parsing a DOM
range, including the parsed document content and reconstructed selection state.

ParseBetweenResult

**Example**

```typescript
const result = parseBetween(view, 0, 10);
console.log(result.doc); // Parsed ProseMirror node
console.log(result.sel); // { anchor: 5, head: 5 } or null
```

</td>
</tr>
</tbody>
</table>
