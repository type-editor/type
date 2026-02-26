import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import ist from 'ist';
import { doc, p, pre, a, schema } from '@type-editor/test-builder';
import { EditorState, TextSelection } from '@type-editor/state';
import type { PmEditorView } from '@type-editor/editor-types';
import { linkItem } from '@src/menu-items/link-item';

describe("linkItem", () => {
    let editorDiv: HTMLDivElement;
    let mockEvent: Event;

    // Helper to create EditorState with proper selection from tag
    const createTestState = (builtDoc: any): EditorState => {
        const tag = builtDoc.tag || {};
        let selection;
        if (tag.a != null && tag.b != null) {
            selection = TextSelection.create(builtDoc, tag.a, tag.b);
        } else if (tag.a != null) {
            selection = TextSelection.create(builtDoc, tag.a);
        }
        return EditorState.create({
            doc: builtDoc,
            selection,
            schema
        });
    };

    const createMockView = (state: EditorState): PmEditorView => {
        return {
            state,
            dispatch: vi.fn(),
            focus: vi.fn(),
            dom: editorDiv,
            root: document,
            addPlugin: vi.fn(),
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    beforeEach(() => {
        // Mock the showModal method for HTMLDialogElement
        if (typeof HTMLDialogElement !== 'undefined') {
            HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
                this.setAttribute('open', '');
                this.style.display = 'block';
            });
            HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
                this.removeAttribute('open');
                this.style.display = 'none';
            });
        }

        // Set up a mock editor view with a DOM element
        editorDiv = document.createElement('div');
        editorDiv.style.width = '800px';
        editorDiv.style.height = '600px';
        document.body.appendChild(editorDiv);

        // Create a mock event
        mockEvent = new Event('click');
    });

    afterEach(() => {
        // Clean up dialogs
        const dialogs = document.querySelectorAll('dialog');
        dialogs.forEach(dialog => dialog.remove());
        
        // Clean up editor div
        if (editorDiv.parentNode) {
            editorDiv.parentNode.removeChild(editorDiv);
        }
    });

    describe("menu item creation", () => {
        it("should create a link menu item with default title", () => {
            const menuItem = linkItem('Link', schema.marks.link);
            
            ist(menuItem.spec.title, 'Link');
            ist(menuItem.spec.label, 'Link');
            ist(menuItem.spec.icon !== undefined, true);
        });

        it("should create a link menu item with custom title", () => {
            const menuItem = linkItem('Insert Link', schema.marks.link);
            
            ist(menuItem.spec.title, 'Insert Link');
            ist(menuItem.spec.label, 'Insert Link');
        });
    });

    describe("enable state", () => {
        it("should be enabled when text is selected", () => {
            const state = createTestState(doc(p("hel<a>lo wor<b>ld")));

            const menuItem = linkItem('Link', schema.marks.link);
            const isEnabled = menuItem.spec.enable?.(state);
            
            ist(isEnabled, true);
        });

        it("should be enabled when selection is within an existing link", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const menuItem = linkItem('Link', schema.marks.link);
            const isEnabled = menuItem.spec.enable?.(state);
            
            ist(isEnabled, true);
        });

        it("should be disabled when cursor is at empty position without link", () => {
            const state = createTestState(doc(p("hello<a> world")));

            const menuItem = linkItem('Link', schema.marks.link);
            const isEnabled = menuItem.spec.enable?.(state);
            
            ist(isEnabled, false);
        });

        it("should be disabled inside code blocks", () => {
            const state = createTestState(doc(pre("hel<a>lo wor<b>ld")));

            const menuItem = linkItem('Link', schema.marks.link, schema.nodes.code_block);
            const isEnabled = menuItem.spec.enable?.(state);
            
            ist(isEnabled, false);
        });
    });

    describe("active state", () => {
        it("should be active when selection is within a link", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const menuItem = linkItem('Link', schema.marks.link);
            const isActive = menuItem.spec.active?.(state);
            
            ist(isActive, true);
        });

        it("should not be active when selection is outside a link", () => {
            const state = createTestState(doc(p("te<a>xt<b> ", a({href: "https://example.com"}, "link"), " text")));

            const menuItem = linkItem('Link', schema.marks.link);
            const isActive = menuItem.spec.active?.(state);
            
            ist(isActive, false);
        });

        it("should not be active when text is selected without link", () => {
            const state = createTestState(doc(p("hel<a>lo wor<b>ld")));

            const menuItem = linkItem('Link', schema.marks.link);
            const isActive = menuItem.spec.active?.(state);
            
            ist(isActive, false);
        });
    });

    describe("dialog opening", () => {
        it("should open a dialog when run with text selection", () => {
            const state = createTestState(doc(p("hel<a>lo wor<b>ld")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            const result = menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);
            
            ist(result, true);
            
            const dialog = document.querySelector('dialog');
            ist(dialog !== null, true);
            ist(dialog?.hasAttribute('open'), true);
        });

        it("should open a dialog with empty form for new link", () => {
            const state = createTestState(doc(p("hel<a>lo wor<b>ld")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);
            
            const linkInput = document.getElementById('pm-insert-link-input') as HTMLInputElement;
            const newWindowCheckbox = document.getElementById('pm-setting-newwindow-btn') as HTMLInputElement;
            const removeButton = document.getElementById('pm-remove-link-btn');
            const openButton = document.getElementById('pm-open-link-btn');
            
            ist(linkInput !== null, true);
            ist(linkInput.value, '');
            ist(newWindowCheckbox !== null, true);
            ist(newWindowCheckbox.checked, false);
            ist(removeButton, null); // Should not exist for new links
            ist(openButton, null); // Should not exist for new links
        });

        it("should open a dialog with pre-filled form for existing link", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);
            
            const linkInput = document.getElementById('pm-insert-link-input') as HTMLInputElement;
            const newWindowCheckbox = document.getElementById('pm-setting-newwindow-btn') as HTMLInputElement;
            const removeButton = document.getElementById('pm-remove-link-btn');
            const openButton = document.getElementById('pm-open-link-btn');
            
            ist(linkInput !== null, true);
            ist(linkInput.value, 'https://example.com');
            ist(newWindowCheckbox !== null, true);
            ist(newWindowCheckbox.checked, false);
            ist(removeButton !== null, true); // Should exist for existing links
            ist(openButton !== null, true); // Should exist for existing links
        });

        it("should pre-fill target='_blank' when link has target attribute", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com", target: "_blank"}, "l<a>i<b>nk"), " text")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);

            menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);

            const linkInput = document.getElementById('pm-insert-link-input') as HTMLInputElement;
            const newWindowCheckbox = document.getElementById('pm-setting-newwindow-btn') as HTMLInputElement;

            ist(linkInput.value, 'https://example.com');
            ist(newWindowCheckbox.checked, true);
        });
    });

    describe("adding a new link", () => {
        it("should add a link mark when form is submitted", () => {
            const state = createTestState(doc(p("hel<a>lo wor<b>ld")));

            const mockDispatch = vi.fn();
            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, mockDispatch, mockView, mockEvent);
            
            const linkInput = document.getElementById('pm-insert-link-input') as HTMLInputElement;
            const form = document.getElementById('pm-link-form') as HTMLFormElement;
            
            linkInput.value = 'https://example.com';
            form.dispatchEvent(new Event('submit'));
            
            ist(mockDispatch.mock.calls.length, 1);
            
            const transaction = mockDispatch.mock.calls[0][0];
            ist(transaction.steps.length > 0, true);
        });

        it("should close dialog after adding link", () => {
            const state = createTestState(doc(p("hel<a>lo wor<b>ld")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);
            
            const linkInput = document.getElementById('pm-insert-link-input') as HTMLInputElement;
            const form = document.getElementById('pm-link-form') as HTMLFormElement;
            const dialog = document.querySelector('dialog');
            
            linkInput.value = 'https://example.com';
            form.dispatchEvent(new Event('submit'));
            
            ist(dialog?.hasAttribute('open'), false);
        });
    });

    describe("editing an existing link", () => {
        it("should update link href when changed", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const mockDispatch = vi.fn();
            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, mockDispatch, mockView, mockEvent);
            
            const linkInput = document.getElementById('pm-insert-link-input') as HTMLInputElement;
            const form = document.getElementById('pm-link-form') as HTMLFormElement;
            
            linkInput.value = 'https://newurl.com';
            form.dispatchEvent(new Event('submit'));
            
            ist(mockDispatch.mock.calls.length, 1);
        });

        it("should not dispatch transaction if link hasn't changed", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const mockDispatch = vi.fn();
            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, mockDispatch, mockView, mockEvent);
            
            const form = document.getElementById('pm-link-form') as HTMLFormElement;
            
            // Submit without changing anything
            form.dispatchEvent(new Event('submit'));
            
            ist(mockDispatch.mock.calls.length, 0);
        });
    });

    describe("removing a link", () => {
        it("should remove link mark when remove button is clicked", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const mockDispatch = vi.fn();
            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, mockDispatch, mockView, mockEvent);
            
            const removeButton = document.getElementById('pm-remove-link-btn') as HTMLButtonElement;
            
            removeButton.click();
            
            ist(mockDispatch.mock.calls.length, 1);
        });

        it("should close dialog after removing link", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);
            
            const removeButton = document.getElementById('pm-remove-link-btn') as HTMLButtonElement;
            const dialog = document.querySelector('dialog');
            
            removeButton.click();
            
            ist(dialog?.hasAttribute('open'), false);
        });
    });

    describe("opening a link", () => {
        it("should call window.open when open button is clicked", () => {
            const state = createTestState(doc(p("text ", a({href: "https://example.com"}, "l<a>i<b>nk"), " text")));

            const mockView = createMockView(state);
            const menuItem = linkItem('Link', schema.marks.link);
            
            // Mock window.open
            const originalOpen = window.open;
            window.open = vi.fn();
            
            menuItem.spec.run?.(state, vi.fn(), mockView, mockEvent);
            
            const openButton = document.getElementById('pm-open-link-btn') as HTMLButtonElement;
            
            openButton.click();
            
            ist((window.open as any).mock.calls.length, 1);
            ist((window.open as any).mock.calls[0][0], 'https://example.com');
            ist((window.open as any).mock.calls[0][1], '_blank');
            
            // Restore window.open
            window.open = originalOpen;
        });
    });
});
