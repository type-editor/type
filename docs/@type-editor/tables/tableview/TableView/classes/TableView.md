[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [tableview/TableView](../README.md) / TableView

# Class: TableView

Defined in: [tables/src/tableview/TableView.ts:21](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/TableView.ts#L21)

Custom NodeView implementation for rendering table nodes with column resizing support.

This view creates a wrapper `<div>` containing a `<table>` element with a `<colgroup>`
for column width management and a `<tbody>` for the actual table content. The column
widths are synchronized with the document's column width attributes.

## Example

```typescript
const tableView = new TableView(tableNode, 100);
// tableView.dom returns the wrapper div
// tableView.contentDOM returns the tbody where content is rendered
```

## Implements

- `NodeView`

## Constructors

### Constructor

```ts
new TableView(node, defaultCellMinWidth): TableView;
```

Defined in: [tables/src/tableview/TableView.ts:64](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/TableView.ts#L64)

Creates a new TableView instance.

#### Parameters

| Parameter             | Type     | Description                                                            |
| --------------------- | -------- | ---------------------------------------------------------------------- |
| `node`                | `Node_2` | The table node to render.                                              |
| `defaultCellMinWidth` | `number` | The default minimum width in pixels for cells without explicit widths. |

#### Returns

`TableView`

## Accessors

### contentDOM

#### Get Signature

```ts
get contentDOM(): HTMLTableSectionElement;
```

Defined in: [tables/src/tableview/TableView.ts:88](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/TableView.ts#L88)

The DOM element where ProseMirror should render the node's content.
For tables, this is the tbody element.

##### Returns

`HTMLTableSectionElement`

#### Implementation of

```ts
NodeView.contentDOM;
```

---

### dom

#### Get Signature

```ts
get dom(): HTMLDivElement;
```

Defined in: [tables/src/tableview/TableView.ts:80](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/TableView.ts#L80)

The outer DOM element for this node view.
ProseMirror uses this as the root element for the table.

##### Returns

`HTMLDivElement`

#### Implementation of

```ts
NodeView.dom;
```

## Methods

### ignoreMutation()

```ts
ignoreMutation(record): boolean;
```

Defined in: [tables/src/tableview/TableView.ts:122](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/TableView.ts#L122)

Determines whether a DOM mutation should be ignored by ProseMirror.

Attribute mutations on the table or colgroup elements are ignored because
these are managed by the column resizing logic, not by document changes.

#### Parameters

| Parameter | Type                 | Description                      |
| --------- | -------------------- | -------------------------------- |
| `record`  | `ViewMutationRecord` | The mutation record to evaluate. |

#### Returns

`boolean`

`true` if the mutation should be ignored, `false` otherwise.

#### Implementation of

```ts
NodeView.ignoreMutation;
```

---

### update()

```ts
update(node): boolean;
```

Defined in: [tables/src/tableview/TableView.ts:98](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/TableView.ts#L98)

Updates the view when the underlying node changes.

#### Parameters

| Parameter | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `node`    | `Node_2` | The new table node to render. |

#### Returns

`boolean`

`true` if the update was handled, `false` if the view should be recreated.

#### Implementation of

```ts
NodeView.update;
```
