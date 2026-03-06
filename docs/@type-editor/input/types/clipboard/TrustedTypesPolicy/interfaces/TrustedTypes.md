[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [types/clipboard/TrustedTypesPolicy](../README.md) / TrustedTypes

# Interface: TrustedTypes

Defined in: [types/clipboard/TrustedTypesPolicy.ts:8](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/types/clipboard/TrustedTypesPolicy.ts#L8)

## Properties

| Property                                             | Type                                          | Defined in                                                                                                                                                                               |
| ---------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-defaultpolicy"></a> `defaultPolicy?` | [`TrustedTypesPolicy`](TrustedTypesPolicy.md) | [types/clipboard/TrustedTypesPolicy.ts:9](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/types/clipboard/TrustedTypesPolicy.ts#L9) |

## Methods

### createPolicy()

```ts
createPolicy(name, rules): TrustedTypesPolicy;
```

Defined in: [types/clipboard/TrustedTypesPolicy.ts:10](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/types/clipboard/TrustedTypesPolicy.ts#L10)

#### Parameters

| Parameter          | Type                                   |
| ------------------ | -------------------------------------- |
| `name`             | `string`                               |
| `rules`            | \{ `createHTML`: (`s`) => `string`; \} |
| `rules.createHTML` | (`s`) => `string`                      |

#### Returns

[`TrustedTypesPolicy`](TrustedTypesPolicy.md)
