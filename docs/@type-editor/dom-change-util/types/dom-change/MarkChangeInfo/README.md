[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / types/dom-change/MarkChangeInfo

# types/dom-change/MarkChangeInfo

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

[MarkChangeInfo](interfaces/MarkChangeInfo.md)

</td>
<td>

Represents a mark change operation (adding or removing a mark).

This interface is used to optimize mark changes by detecting when
a change is simply adding or removing a single mark type (like bold
or italic) rather than changing the actual text content.

MarkChangeInfo

**Example**

```typescript
// User presses Ctrl+B to make text bold
const markChange: MarkChangeInfo = {
  mark: schema.marks.strong.create(),
  type: "add",
};
```

</td>
</tr>
</tbody>
</table>
