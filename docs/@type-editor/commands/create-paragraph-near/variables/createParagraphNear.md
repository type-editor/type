[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [create-paragraph-near](../README.md) / createParagraphNear

# Variable: createParagraphNear

```ts
const createParagraphNear: Command;
```

Defined in: [create-paragraph-near.ts:29](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/create-paragraph-near.ts#L29)

Creates an empty paragraph before or after a selected block node.

When a block node is selected (not inline content), this command inserts an empty
paragraph block adjacent to it. The paragraph is created before the selected block
if it's the first child of its parent, or after it otherwise. The cursor is placed
in the newly created paragraph.

This command is useful for allowing users to add content around block elements that
would otherwise be difficult to escape from or insert content near.

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the command can be applied, `false` otherwise

## Example

```typescript
// Use in a keymap to create paragraphs near selected blocks
const keymap = {
  "Mod-Enter": createParagraphNear,
};
```
