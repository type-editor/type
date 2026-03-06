[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [ViewDescUtil](../README.md) / ViewDescUtil

# Class: ViewDescUtil

Defined in: [ViewDescUtil.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDescUtil.ts#L8)

## Constructors

### Constructor

```ts
new ViewDescUtil(): ViewDescUtil;
```

#### Returns

`ViewDescUtil`

## Methods

### nearestNodeViewDesc()

```ts
static nearestNodeViewDesc(viewDesc, dom): NodeViewDesc;
```

Defined in: [ViewDescUtil.ts:28](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDescUtil.ts#L28)

Scan up the DOM tree to find the first node view description that is a descendant of this one.

#### Parameters

| Parameter  | Type         | Description                |
| ---------- | ------------ | -------------------------- |
| `viewDesc` | `PmViewDesc` | -                          |
| `dom`      | `Node`       | The DOM node to start from |

#### Returns

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md)

The nearest node view description, or undefined if none found

---

### nearestViewDesc()

```ts
static nearestViewDesc(viewDesc, dom): ViewDesc;
```

Defined in: [ViewDescUtil.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDescUtil.ts#L17)

Scan up the DOM tree to find the first view description that is a descendant of this one.

#### Parameters

| Parameter  | Type         | Description                |
| ---------- | ------------ | -------------------------- |
| `viewDesc` | `PmViewDesc` | -                          |
| `dom`      | `Node`       | The DOM node to start from |

#### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

The nearest view description, or undefined if none found
