import type { MenuItemSpec } from './MenuItemSpec';

/**
 * This is mainly intended to use in dropdown menus, where the
 * parent menu element needs to be notified when a sub-element
 * becomes active especially to show the active label.
 */
export interface ParentMenuElement {

    notifySubElementIsActive(menuItemSpec: MenuItemSpec): void;
}
