import type { PmEditorState } from '@type-editor/editor-types';
import { Plugin } from '@type-editor/state';

import { menuBarPlugin } from './menu-bar-plugin';
import { Dropdown } from './menubar/dropdown/Dropdown';
import { DropdownLegacy } from './menubar/dropdown/DropdownLegacy';
import { MenuItem } from './menubar/MenuItem';
import type { MenuBarOptions } from './types/MenuBarOptions';
import type { MenuElement } from './types/MenuElement';
import type { MenuItemSpec } from './types/MenuItemSpec';

/**
 * Accepted input types for a single menu element entry in a group or dropdown.
 * Arrays of `MenuElement` are flattened, while falsy values (`null`, `undefined`) are ignored.
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export type MenuElementInput = Array<MenuElement | null> | MenuItem | Dropdown | DropdownLegacy | undefined;

/**
 * Builder for constructing a ProseMirror menu bar plugin.
 *
 * Use `addMenuGroup` to add flat groups of items to the toolbar, and
 * `addDropDown` to add dropdown menus. Finish with `build()` to
 * produce the configured `Plugin` instance.
 *
 * @example
 * ```ts
 * const plugin = new MenuBarBuilder()
 *   .addMenuGroup(boldItem, italicItem)
 *   .addDropDown({ label: 'Insert' }, tableItem, imageItem)
 *   .build();
 * ```
 */
export class MenuBarBuilder {

    private readonly menu: Array<Array<MenuElement>> = [];
    private readonly isFloating: boolean;
    private readonly isLegacy: boolean;

    /**
     * Creates a new `MenuBarBuilder`.
     *
     * @param isLegacy - When `true`, dropdowns are rendered using the legacy
     *   `DropdownLegacy` component for backward compatibility. Defaults to `false`.
     * @param floating - When `true`, the menu bar sticks to the top of the
     *   viewport while the editor is partially scrolled out of view. Defaults to `false`.
     */
    constructor(isLegacy = false, floating = false) {
        this.isLegacy = isLegacy;
        this.isFloating = floating;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Creates a `MenuItem` from the given spec.
     *
     * Convenience factory that handles two common omissions automatically:
     * - If only `label` is provided, `title` is set to the same value.
     * - If only `title` (as a plain string) is provided, `label` is set to the same value.
     *
     * When `useSelect` is `true` and the spec defines a `run` function but no
     * explicit `select` guard, a `select` function is derived from `run` so that
     * the item is hidden whenever `run` would return `false`.
     *
     * @param spec - The `MenuItemSpec` describing the item's appearance and behaviour.
     * @param useSelect - When `true`, derives a `select` guard from `run` if none
     *   is specified. Defaults to `false`.
     * @returns A new `MenuItem`, or `null` if `spec` is falsy.
     */
    public static createMenuItem(spec: MenuItemSpec, useSelect = false): MenuItem | null {
        if (!spec) {
            return null;
        }

        MenuBarBuilder.normalizeLabelAndTitle(spec);

        if (useSelect && spec.run && !spec.select) {
            spec.select = (state: PmEditorState): boolean => spec.run(state, null, null, null);
        } else {
            if(spec.run && !spec.enable) {
                spec.enable = (state: PmEditorState): boolean => spec.run(state, null, null, null);
            }
            if(spec.run && !spec.active) {
                spec.active = (state: PmEditorState): boolean => spec.run(state, null, null, null);
            }
        }

        return new MenuItem(spec);
    }

    /**
     * Ensures that `spec.label` and `spec.title` are kept in sync when only
     * one of the two is provided.
     *
     * - Missing `title` is filled from `label`.
     * - Missing `label` is filled from `title` when `title` is a plain string.
     *
     * @param spec - The spec to mutate in-place.
     */
    private static normalizeLabelAndTitle(spec: MenuItemSpec): void {
        if (spec.label && !spec.title) {
            spec.title = spec.label;
        } else if (typeof spec.title === 'string' && !spec.label) {
            spec.label = spec.title;
        }
    }

    /**
     * Builds and returns the configured menu bar `Plugin`.
     *
     * @returns A ProseMirror `Plugin` that renders the menu bar.
     */
    public build(): Plugin {
        const options: MenuBarOptions = {
            floating: this.isFloating,
            content: this.menu,
            isLegacy: this.isLegacy,
        };
        return menuBarPlugin(options);
    }

    // ── Static Factories ──────────────────────────────────────────────────────

    /**
     * Adds a dropdown menu group to the menu bar.
     *
     * If a single pre-built `Dropdown` instance is passed as the only element,
     * it is added directly. Otherwise, all elements are collected and wrapped in
     * a new `Dropdown` (or `DropdownLegacy` when the builder is in legacy mode).
     *
     * @param options - Optional display options for the dropdown trigger (e.g. `label` or `title`).
     * @param menuElements - One or more menu elements (or arrays thereof) to include
     *   in the dropdown. `null` / `undefined` entries are silently ignored.
     * @returns This builder instance for method chaining.
     */
    public addDropDown(options?: { title?: string; label?: string, showLabel?: boolean },
                       ...menuElements: Array<MenuElementInput>): MenuBarBuilder {

        return this.createDropDown(false, options, ...menuElements);
    }

    public addStaticDropDown(options?: { title?: string; label?: string, showLabel?: boolean },
                             ...menuElements: Array<MenuElementInput>): MenuBarBuilder {
        return this.createDropDown(true, options, ...menuElements);
    }

    private createDropDown(staticDropDown: boolean,
                           options?: { title?: string; label?: string, showLabel?: boolean },
                           ...menuElements: Array<MenuElementInput>): MenuBarBuilder {

        // Fast path: a single, already-constructed Dropdown is added as-is.
        if (menuElements.length === 1 && menuElements[0] instanceof Dropdown) {
            return this.addMenuGroup(menuElements[0]);
        }

        const items: Array<MenuElement> = this.flattenMenuElements(menuElements);
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const dropdown: DropdownLegacy | Dropdown = this.isLegacy
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            ? new DropdownLegacy(items, {...options, static: staticDropDown })
            : new Dropdown(items, {...options, static: staticDropDown });

        return this.addMenuGroup(dropdown);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    /**
     * Adds a flat group of menu elements to the menu bar.
     *
     * Each group is rendered as a visually separated section of the toolbar.
     * Arrays within `menuElements` are flattened; `null` / `undefined` entries
     * are silently ignored.
     *
     * @param menuElements - One or more menu elements (or arrays thereof) to
     *   include in this group.
     * @returns This builder instance for method chaining.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    public addMenuGroup(...menuElements: Array<Array<MenuElement> | MenuItem | Dropdown | DropdownLegacy | undefined>): MenuBarBuilder {
        const items: Array<MenuElement> = this.flattenMenuElements(menuElements);
        if (items.length > 0) {
            this.menu.push(items);
        }
        return this;
    }

    /**
     * Flattens a heterogeneous list of menu element inputs into a single
     * `MenuElement[]`, discarding `null` and `undefined` values.
     *
     * @param inputs - The raw inputs to flatten.
     * @returns A flat array of resolved `MenuElement` instances.
     */
    private flattenMenuElements(inputs: Array<MenuElementInput>): Array<MenuElement> {
        const result: Array<MenuElement> = [];
        for (const input of inputs) {
            if (Array.isArray(input)) {
                for (const item of input) {
                    if (item !== null && item !== undefined) {
                        result.push(item);
                    }
                }
            } else if (input !== null && input !== undefined) {
                result.push(input);
            }
        }
        return result;
    }
}
