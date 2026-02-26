import {describe, it} from 'vitest';
import ist from 'ist';
import {Plugin} from '@type-editor/state';
import {dropCursor} from "@src/drop-cursor-plugin";

describe("dropCursor plugin", () => {
    describe("plugin creation", () => {
        it("creates a plugin with default options", () => {
            const plugin = dropCursor();
            ist(plugin instanceof Plugin, true);
        });

        it("creates a plugin with custom options", () => {
            const plugin = dropCursor({
                width: 2,
                color: 'red',
                class: 'custom-drop-cursor'
            });
            ist(plugin instanceof Plugin, true);
        });

        it("creates a plugin with color false", () => {
            const plugin = dropCursor({
                color: false
            });
            ist(plugin instanceof Plugin, true);
        });

        it("creates a plugin with empty options object", () => {
            const plugin = dropCursor({});
            ist(plugin instanceof Plugin, true);
        });
    });
});

