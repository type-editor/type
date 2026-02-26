[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / deep-active-element

# deep-active-element

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[deepActiveElement](functions/deepActiveElement.md)

</td>
<td>

Gets the deeply nested active element, traversing through Shadow DOM boundaries.

This function recursively descends into shadow roots to find the actual
focused element, even when it's nested within multiple levels of Shadow DOM.

**Example**

```typescript
const focusedElement = deepActiveElement(document);
if (focusedElement) {
  console.log("Actually focused element:", focusedElement);
}
```

</td>
</tr>
</tbody>
</table>
