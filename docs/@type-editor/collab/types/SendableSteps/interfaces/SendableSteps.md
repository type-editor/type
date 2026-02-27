[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/collab](../../../README.md) / [types/SendableSteps](../README.md) / SendableSteps

# Interface: SendableSteps

Defined in: [types/SendableSteps.ts:9](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/types/SendableSteps.ts#L9)

Data describing the editor's unconfirmed steps that need to be sent
to the central authority.

## Properties

| Property                                  | Type                   | Description                                                                                                                                                                                                                                    | Defined in                                                                                                                                                    |
| ----------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-clientid"></a> `clientID` | `string` \| `number`   | The ID of this client.                                                                                                                                                                                                                         | [types/SendableSteps.ts:23](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/types/SendableSteps.ts#L23) |
| <a id="property-origins"></a> `origins`   | readonly `Transform`[] | The original transforms that produced each step. This can be useful for looking up timestamps and other metadata for the steps. Note that the steps may have been rebased, whereas the origin transforms are still the old, unchanged objects. | [types/SendableSteps.ts:31](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/types/SendableSteps.ts#L31) |
| <a id="property-steps"></a> `steps`       | readonly `PmStep`[]    | The steps that need to be sent to the central authority.                                                                                                                                                                                       | [types/SendableSteps.ts:18](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/types/SendableSteps.ts#L18) |
| <a id="property-version"></a> `version`   | `number`               | The current version of the collaborative editing state.                                                                                                                                                                                        | [types/SendableSteps.ts:13](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/types/SendableSteps.ts#L13) |
