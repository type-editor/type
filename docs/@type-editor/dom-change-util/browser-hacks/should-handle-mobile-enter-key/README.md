[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/should-handle-mobile-enter-key

# browser-hacks/should-handle-mobile-enter-key

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

[shouldHandleMobileEnterKey](functions/shouldHandleMobileEnterKey.md)

</td>
<td>

Checks if a mobile Enter key should be handled instead of processing the DOM change.

Mobile browsers (iOS and Android) sometimes handle Enter key presses in ways that
are better processed through the key handler than as DOM changes. This function
detects such cases by checking:

1. The platform is iOS (with recent Enter) or Android
2. Block-level nodes (DIV, P, etc.) were added to the DOM
3. No content change was detected, or content was deleted

When all conditions are met, the Enter key is dispatched through the handleKeyDown
plugin system instead of processing the DOM change directly.

**Remarks**

Uses a regex to detect inline vs block-level HTML elements

</td>
</tr>
</tbody>
</table>
