[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/collab

# @type-editor/collab

A refactored version of ProseMirror's [prosemirror-collab](https://github.com/ProseMirror/prosemirror-collab) module, providing collaborative editing capabilities for rich text editors.

## Installation

```bash
npm install @type-editor/collab
```

## Overview

This module provides a framework for collaborative editing using an authority-based model. Multiple clients can connect to a central authority that maintains the canonical document state. Each client tracks its own version and unconfirmed changes, synchronizing with the authority through step-based operations.

The collaborative editing workflow follows these principles:

1. Each client maintains a version number and a list of unconfirmed local changes
2. When users make edits, steps are stored locally as "unconfirmed"
3. Steps are sent to the central authority for confirmation
4. When receiving steps from the authority, local unconfirmed steps are rebased over remote changes
5. Once confirmed by the authority, steps are removed from the unconfirmed list

## API

### `collab(config?)`

Creates a plugin that enables the collaborative editing framework for the editor.

```typescript
import { collab } from "@type-editor/collab";
import { EditorState } from "@type-editor/state";

const state = EditorState.create({
  // ...other config
  plugins: [
    collab({
      version: 0, // Starting version number (default: 0)
      clientID: "user-1", // Unique client identifier (default: random 32-bit number)
    }),
  ],
});
```

#### Configuration Options

| Option     | Type               | Default              | Description                                                                                   |
| ---------- | ------------------ | -------------------- | --------------------------------------------------------------------------------------------- |
| `version`  | `number`           | `0`                  | The starting version number of the collaborative editing state.                               |
| `clientID` | `number \| string` | Random 32-bit number | This client's unique identifier, used to distinguish its changes from those of other clients. |

### `getVersion(state)`

Gets the current version number that the collab plugin has synced with the central authority.

```typescript
import { getVersion } from "@type-editor/collab";

const version = getVersion(editorState);
console.log(`Current version: ${version}`);
```

### `sendableSteps(state)`

Retrieves unconfirmed steps that need to be sent to the central authority. Returns `null` if there are no steps to send.

```typescript
import { sendableSteps } from "@type-editor/collab";

const sendable = sendableSteps(editorState);
if (sendable) {
  // Send to your server/authority
  await sendToServer({
    version: sendable.version,
    steps: sendable.steps.map((step) => step.toJSON()),
    clientID: sendable.clientID,
  });
}
```

#### Return Value

When there are steps to send, returns an object with:

| Property   | Type                       | Description                                                                                                                                                                          |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `version`  | `number`                   | The current version of the collaborative editing state.                                                                                                                              |
| `steps`    | `ReadonlyArray<Step>`      | The steps that need to be sent to the central authority.                                                                                                                             |
| `clientID` | `number \| string`         | The ID of this client.                                                                                                                                                               |
| `origins`  | `ReadonlyArray<Transform>` | The original transforms that produced each step. Useful for looking up timestamps and other metadata. Note that steps may have been rebased, but origins retain their original form. |

### `receiveTransaction(state, steps, clientIDs, options?)`

Creates a transaction that applies steps received from the central authority. This function handles:

1. **Confirming own steps**: Steps that originated from this client are confirmed and removed from the unconfirmed list
2. **Applying remote steps**: Steps from other clients are applied directly if there are no local changes
3. **Rebasing**: If there are local unconfirmed changes, they are rebased over the remote steps

```typescript
import { receiveTransaction } from "@type-editor/collab";

// When receiving steps from the server
const transaction = receiveTransaction(
  editorState,
  steps, // Array of Step objects from the authority
  clientIDs, // Array of client IDs corresponding to each step
  { mapSelectionBackward: true },
);

// Apply the transaction to update the editor
const newState = editorState.apply(transaction);
view.updateState(newState);
```

#### Options

| Option                 | Type      | Default | Description                                                                                                                                                                                                         |
| ---------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapSelectionBackward` | `boolean` | `false` | When enabled, if the current selection is a `TextSelection`, its sides are mapped with a negative bias. This causes content inserted at the cursor to end up after the cursor, which is usually preferred by users. |

### `rebaseSteps(steps, over, transform)`

Rebases a set of steps over another set of steps. This is an internal utility used by `receiveTransaction`, but exposed for advanced use cases.

The rebasing process:

1. Undoes all local steps in reverse order
2. Applies all remote steps
3. Reapplies local steps with proper position mapping

```typescript
import { rebaseSteps } from "@type-editor/collab";

// Advanced usage: manually rebase steps
const rebasedSteps = rebaseSteps(localSteps, remoteSteps, transaction);
```

## Usage Example

### Complete Collaborative Setup

```typescript
import {
  collab,
  getVersion,
  sendableSteps,
  receiveTransaction,
} from "@type-editor/collab";
import { EditorState } from "@type-editor/state";
import { EditorView } from "@type-editor/view";
import { Step } from "@type-editor/transform";

// Create editor with collab plugin
const state = EditorState.create({
  doc: myDoc,
  plugins: [collab({ version: initialVersion, clientID: myClientID })],
});

const view = new EditorView(document.querySelector("#editor"), {
  state,
  dispatchTransaction(transaction) {
    const newState = view.state.apply(transaction);
    view.updateState(newState);

    // Check for steps to send after each transaction
    sendStepsToServer();
  },
});

// Send local changes to the server
async function sendStepsToServer() {
  const sendable = sendableSteps(view.state);
  if (!sendable) return;

  try {
    const response = await fetch("/collab/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: sendable.version,
        steps: sendable.steps.map((s) => s.toJSON()),
        clientID: sendable.clientID,
      }),
    });

    const data = await response.json();
    receiveStepsFromServer(data.steps, data.clientIDs);
  } catch (error) {
    console.error("Failed to send steps:", error);
  }
}

// Receive and apply steps from the server
function receiveStepsFromServer(
  stepsJSON: any[],
  clientIDs: (string | number)[],
) {
  const steps = stepsJSON.map((json) => Step.fromJSON(schema, json));
  const transaction = receiveTransaction(view.state, steps, clientIDs, {
    mapSelectionBackward: true,
  });

  const newState = view.state.apply(transaction);
  view.updateState(newState);
}

// Poll for updates from the server
async function pollForUpdates() {
  const version = getVersion(view.state);

  const response = await fetch(`/collab/steps?version=${version}`);
  const data = await response.json();

  if (data.steps.length > 0) {
    receiveStepsFromServer(data.steps, data.clientIDs);
  }
}

// Start polling
setInterval(pollForUpdates, 1000);
```

## How It Works

### Version Tracking

Each document state has an associated version number. The collab plugin tracks:

- The last confirmed version from the authority
- A list of unconfirmed local steps waiting for confirmation

### Operational Transformation

When local and remote changes conflict, the module uses a rebasing technique:

1. **Undo local changes**: All unconfirmed local steps are temporarily reversed
2. **Apply remote changes**: Steps from the authority are applied to create the canonical state
3. **Reapply local changes**: Local steps are transformed and reapplied on top of the remote changes

This ensures that all clients converge to the same document state while preserving user intent.

### Integration with History

The collab plugin sets `historyPreserveItems: true` to ensure the history plugin doesn't merge steps. This allows proper rebasing of history entries when collaborative changes arrive.

## License

MIT

## Modules

<table>
<thead>
<tr>
<th>Module</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[collab](collab/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[CollabState](CollabState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[get-version](get-version/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[plugin-key](plugin-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[rebase-steps](rebase-steps/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[Rebaseable](Rebaseable/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[receive-transaction](receive-transaction/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[sendable-steps](sendable-steps/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/CollabConfig](types/CollabConfig/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/ReceiveTransactionOptions](types/ReceiveTransactionOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/SendableSteps](types/SendableSteps/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/get-client-id](util/get-client-id/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
