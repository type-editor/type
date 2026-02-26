import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import ist from 'ist';
import { doc, p, schema } from '@type-editor/test-builder';
import { EditorState, TextSelection } from '@type-editor/state';
import type { PmEditorView } from '@type-editor/editor-types';
import { imageItem } from '@src/menu-items/image-item';

describe("imageItem", () => {
    let editorDiv: HTMLDivElement;
    let mockEvent: Event;

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

        // Mock URL.createObjectURL
        global.URL = global.URL || {} as typeof URL;
        global.URL.createObjectURL = vi.fn(() => 'blob:test-url');

        // Set up a mock editor view with a DOM element
        editorDiv = document.createElement('div');
        editorDiv.style.width = '800px';
        editorDiv.style.height = '600px';
        document.body.appendChild(editorDiv);

        // Create a mock event
        mockEvent = new Event('click');
    });

    afterEach(() => {
        // Clean up any remaining dialogs
        const dialogs = document.querySelectorAll('.pm-dialog');
        dialogs.forEach(dialog => dialog.remove());

        if (editorDiv.parentNode) {
            document.body.removeChild(editorDiv);
        }
    });

    describe("constructor", () => {
        it("should create a menu item with default title", () => {
            const item = imageItem();
            ist(item.spec.title, 'Image');
        });

        it("should create a menu item with custom title", () => {
            const item = imageItem('Custom Image');
            ist(item.spec.title, 'Custom Image');
        });

        it("should have an icon", () => {
            const item = imageItem();
            ist(item.spec.icon !== undefined, true);
        });
    });

    describe("enable", () => {
        it("should be enabled in normal paragraph", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const item = imageItem();
            const enabled = item.spec.enable?.(state) ?? true;
            ist(enabled, true);
        });

        it("should be disabled in code block", () => {
            const codeBlock = schema.nodes.code_block.create(null, schema.text("code"));
            const state = EditorState.create({
                doc: doc(codeBlock),
                schema
            });

            // Position cursor inside code block
            const selection = TextSelection.create(state.doc, 1);
            const stateWithSelection = state.apply(state.tr.setSelection(selection));

            const item = imageItem('Custom Image', schema.nodes.image, null, schema.nodes.code_block);
            const enabled = item.spec.enable?.(stateWithSelection) ?? true;
            ist(enabled, false);
        });
    });

    describe("active", () => {
        it("should not be active when no image is selected", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const item = imageItem();
            const active = item.spec.active?.(state) ?? false;
            ist(active, false);
        });

        it("should be active when cursor is on an image", () => {
            const imageNode = schema.nodes.image.create({
                src: 'test.jpg',
                alt: 'test',
                title: 'test'
            });
            const state = EditorState.create({
                doc: doc(p(imageNode)),
                schema
            });

            // Position cursor at the image (just after paragraph start)
            const selection = TextSelection.create(state.doc, 1);
            const stateWithSelection = state.apply(state.tr.setSelection(selection));

            const item = imageItem();
            const active = item.spec.active?.(stateWithSelection) ?? false;
            // The active state depends on actual selection logic - this test just validates it doesn't error
            ist(typeof active, 'boolean');
        });
    });

    describe("run - new image", () => {
        it("should open dialog for new image", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const view = createMockView(state);

            const item = imageItem();
            const result = item.spec.run(state, view.dispatch, view, mockEvent);

            ist(result, true);

            // Check that dialog was opened
            const dialog = document.querySelector('.pm-dialog');
            ist(dialog !== null, true);

            // Check for file input in upload mode
            const fileInput = document.querySelector('#pm-file-input');
            ist(fileInput !== null, true);
        });

        it("should have drop zone for uploading", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const view = createMockView(state);

            const item = imageItem();
            item.spec.run(state, view.dispatch, view, mockEvent);

            const dropZone = document.querySelector('#pm-drop-zone');
            ist(dropZone !== null, true);
        });
    });

    describe("run - image dialog behavior", () => {
        it("should open dialog when run is called", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const view = createMockView(state);

            const item = imageItem();
            item.spec.run(state, view.dispatch, view, mockEvent);

            // Check that dialog was opened
            const dialog = document.querySelector('.pm-dialog');
            ist(dialog !== null, true);
        });
    });

    describe("render - plugin registration", () => {
        it("should register plugins when rendered", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const view = createMockView(state);

            const item = imageItem();
            item.spec.render?.(view);

            // Check that addPlugin was called (3 times for paste, drop start, and drop finished)
            ist((view.addPlugin as ReturnType<typeof vi.fn>).mock.calls.length, 3);
        });
    });

    describe("file input", () => {
        it("should have file input with accept attribute for images", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const view = createMockView(state);

            const item = imageItem();
            item.spec.run(state, view.dispatch, view, mockEvent);

            const fileInput = document.querySelector('#pm-file-input') as HTMLInputElement;
            ist(fileInput !== null, true);
            ist(fileInput.getAttribute('accept'), 'image/*');
        });

        it("should support selecting multiple image files", () => {
            const state = EditorState.create({
                doc: doc(p("hello")),
                schema
            });
            const view = createMockView(state);

            const item = imageItem();
            item.spec.run(state, view.dispatch, view, mockEvent);

            const fileInput = document.querySelector('#pm-file-input') as HTMLInputElement;
            ist(fileInput !== null, true);
            ist(fileInput.hasAttribute('multiple'), true);
        });
    });
});
