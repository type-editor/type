[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/is-ie11-non-breaking-space-bug

# browser-hacks/is-ie11-non-breaking-space-bug

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

[isIE11NonBreakingSpaceBug](functions/isIE11NonBreakingSpaceBug.md)

</td>
<td>

Checks if this is the IE11 non-breaking space bug.

IE11 has a quirk where typing a space before another space causes it to insert
a non-breaking space (U+00A0) _ahead_ of the cursor instead of a regular space
at the cursor position. This can cause the change detection to be off by one
character.

The bug is detected by checking:

- Browser is IE11 or earlier
- Change is exactly one character (endB - start === 1)
- Change is a replacement (endA === start)
- Change is not at the very start of the parsed range
- The character before and after the change position is space + nbsp

When detected, the change positions are adjusted backwards by one to account
for the nbsp being inserted in the wrong place.

</td>
</tr>
</tbody>
</table>
