[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / [default-encoder](../README.md) / DefaultEncoder

# Variable: DefaultEncoder

```ts
const DefaultEncoder: TokenEncoder<number | string>;
```

Defined in: [default-encoder.ts:12](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/changeset/src/default-encoder.ts#L12)

The default token encoder for diff operations.

- Node start tokens are encoded as strings containing the node name
- Characters are encoded as their character code
- Node end tokens are encoded as negative type IDs
