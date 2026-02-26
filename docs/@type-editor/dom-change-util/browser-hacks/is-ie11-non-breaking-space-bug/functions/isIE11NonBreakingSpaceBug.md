[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/is-ie11-non-breaking-space-bug](../README.md) / isIE11NonBreakingSpaceBug

# Function: isIE11NonBreakingSpaceBug()

```ts
function isIE11NonBreakingSpaceBug(change, parse): boolean;
```

Defined in: [browser-hacks/is-ie11-non-breaking-space-bug.ts:30](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/browser-hacks/is-ie11-non-breaking-space-bug.ts#L30)

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

## Parameters

| Parameter | Type                                                                                                  | Description                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `change`  | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md)             | The detected document change                                                                        |
| `parse`   | [`ParseBetweenResult`](../../../types/dom-change/ParseBetweenResult/interfaces/ParseBetweenResult.md) | Parsed document information containing the document content for checking the surrounding characters |

## Returns

`boolean`

True if this matches the IE11 nbsp bug pattern and adjustment is needed,
false otherwise
