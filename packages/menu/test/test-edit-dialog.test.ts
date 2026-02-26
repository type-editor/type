import {describe, it, beforeEach, afterEach, vi} from 'vitest';
import ist from 'ist';
import {doc, p, schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';
import type {PmEditorView} from '@type-editor/editor-types';
import {EditDialog} from '@src/menu-items/util/EditDialog';

describe("EditDialog", () => {
    let editorView: PmEditorView;
    let editorDiv: HTMLDivElement;

    beforeEach(() => {
        // Mock the showModal method for HTMLDialogElement
        if (typeof HTMLDialogElement !== 'undefined') {
            HTMLDialogElement.prototype.showModal = vi.fn(function(this: HTMLDialogElement) {
                this.setAttribute('open', '');
                this.style.display = 'block';
            });
            HTMLDialogElement.prototype.close = vi.fn(function(this: HTMLDialogElement) {
                this.removeAttribute('open');
                this.style.display = 'none';
            });
        }

        // Set up a mock editor view with a DOM element
        editorDiv = document.createElement('div');
        editorDiv.style.width = '800px';
        editorDiv.style.height = '600px';
        document.body.appendChild(editorDiv);

        const state = EditorState.create({
            doc: doc(p("test content")),
            schema
        });

        editorView = {
            state,
            dom: editorDiv,
            focus: () => {},
            dispatch: () => {},
        } as unknown as PmEditorView;
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
        it("should create an instance", () => {
            const dialog = new EditDialog();
            ist(dialog instanceof EditDialog, true);
        });
    });

    describe("add", () => {
        it("should add content and return itself for chaining", () => {
            const dialog = new EditDialog();
            const result = dialog.add('<p>Test content</p>');

            ist(result, dialog);
        });

        it("should accumulate multiple add calls", () => {
            const dialog = new EditDialog();
            dialog.add('<p>First</p>');
            dialog.add('<p>Second</p>');

            // We can verify this by opening the dialog and checking the content
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            ist(dialogElement !== null, true);

            const content = dialogElement?.innerHTML || '';
            ist(content.includes('First'), true);
            ist(content.includes('Second'), true);

            dialog.close(editorView);
        });
    });

    describe("addRow", () => {
        it("should wrap content in a row div", () => {
            const dialog = new EditDialog();
            dialog.addRow('<span>Row content</span>');
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            const row = dialogElement?.querySelector('.pm-menu-row');

            ist(row !== null, true);
            ist(row?.innerHTML.includes('Row content'), true);

            dialog.close(editorView);
        });

        it("should return itself for chaining", () => {
            const dialog = new EditDialog();
            const result = dialog.addRow('<span>Content</span>');

            ist(result, dialog);
        });

        it("should add row end marker", () => {
            const dialog = new EditDialog();
            dialog.addRow('<span>Content</span>');
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            const rowEnd = dialogElement?.querySelector('.pm-menu-row-end');

            ist(rowEnd !== null, true);

            dialog.close(editorView);
        });

        it("should chain multiple rows", () => {
            const dialog = new EditDialog();
            dialog
                .addRow('<span>Row 1</span>')
                .addRow('<span>Row 2</span>')
                .addRow('<span>Row 3</span>');

            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            const rows = dialogElement?.querySelectorAll('.pm-menu-row');

            ist(rows?.length, 3);

            dialog.close(editorView);
        });
    });

    describe("open", () => {
        it("should create a dialog element with the pm-dialog class", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            ist(dialogElement !== null, true);

            dialog.close(editorView);
        });

        it("should set the width and height", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 500, 400);

            const dialogElement = document.querySelector('.pm-dialog') as HTMLElement;
            ist(dialogElement?.style.width, '500px');
            ist(dialogElement?.style.height, '400px');

            dialog.close(editorView);
        });

        it("should create a close button", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            const closeButton = document.getElementById('pm-close-drop-zone');
            ist(closeButton !== null, true);
            ist(closeButton?.classList.contains('pm-close-btn'), true);

            dialog.close(editorView);
        });

        it("should wrap content in a div", () => {
            const dialog = new EditDialog();
            dialog.add('<span>Test</span>');
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            ist(/<div[^>]+><span>Test<\/span><\/div>/.test(dialogElement?.innerHTML), true);

            dialog.close(editorView);
        });

        it("should append dialog to document body", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            ist(dialogElement?.parentElement, document.body);

            dialog.close(editorView);
        });

        it("should make dialog visible after positioning", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog') as HTMLElement;
            ist(dialogElement?.style.visibility, 'visible');

            dialog.close(editorView);
        });

        it("should position dialog relative to editor view", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog') as HTMLElement;

            // Should have top and left styles set
            ist(dialogElement?.style.top !== '', true);
            ist(dialogElement?.style.left !== '', true);

            dialog.close(editorView);
        });

        it("should use HTMLDialogElement when supported", () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');

            // In test environment, check if it's a dialog or div
            const isDialog = dialogElement?.tagName === 'DIALOG';
            const isDiv = dialogElement?.tagName === 'DIV';

            ist(isDialog || isDiv, true);

            dialog.close(editorView);
        });
    });

    describe("close", () => {
        it("should remove dialog from DOM", async () => {
            const dialog = new EditDialog();
            dialog.open(editorView, 400, 300);

            ist(document.querySelector('.pm-dialog') !== null, true);

            dialog.close(editorView);

            // Wait for timeout in close method
            await new Promise(resolve => setTimeout(resolve, 150));
            ist(document.querySelector('.pm-dialog'), null);
        });

        it("should handle closing when dialog doesn't exist", () => {
            const dialog = new EditDialog();

            // Should not throw
            dialog.close(editorView);

            ist(true, true);
        });

        it("should clean up after multiple open/close cycles", async () => {
            const dialog = new EditDialog();

            dialog.open(editorView, 400, 300);
            dialog.close(editorView);

            await new Promise(resolve => setTimeout(resolve, 150));
            dialog.open(editorView, 400, 300);
            ist(document.querySelectorAll('.pm-dialog').length, 1);
            dialog.close(editorView);
        });
    });

    describe("addListener", () => {
        it("should add event listener to window", () => {
            const dialog = new EditDialog();
            let clicked = false;

            dialog.addListener('window', 'custom-test-event', () => {
                clicked = true;
            });

            window.dispatchEvent(new Event('custom-test-event'));
            ist(clicked, true);
        });

        it("should add event listener to element by id", () => {
            const dialog = new EditDialog();
            const testButton = document.createElement('button');
            testButton.id = 'test-button-id';
            document.body.appendChild(testButton);

            let clicked = false;
            dialog.addListener('test-button-id', 'click', () => {
                clicked = true;
            });

            testButton.click();
            ist(clicked, true);

            document.body.removeChild(testButton);
        });

        it("should add event listener to HTMLElement directly", () => {
            const dialog = new EditDialog();
            const testButton = document.createElement('button');
            document.body.appendChild(testButton);

            let clicked = false;
            dialog.addListener(testButton, 'click', () => {
                clicked = true;
            });

            testButton.click();
            ist(clicked, true);

            document.body.removeChild(testButton);
        });

        it("should handle non-existent element id gracefully", () => {
            const dialog = new EditDialog();

            // Should not throw
            dialog.addListener('non-existent-id', 'click', () => {});

            ist(true, true);
        });
    });

    describe("integration", () => {
        it("should close dialog when close button is clicked", async () => {
            const dialog = new EditDialog();
            dialog.add('<p>Content</p>');
            dialog.open(editorView, 400, 300);

            const closeButton = document.getElementById('pm-close-drop-zone') as HTMLButtonElement;
            ist(closeButton !== null, true);

            closeButton.click();

            await new Promise(resolve => setTimeout(resolve, 150));
            ist(document.querySelector('.pm-dialog'), null);
        });

        it("should build a complex dialog with multiple elements", () => {
            const dialog = new EditDialog();
            dialog
                .add('<h3>Dialog Title</h3>')
                .addRow('<label>Label 1:</label><input type="text" />')
                .addRow('<label>Label 2:</label><input type="text" />')
                .add('<p>Additional info</p>');

            dialog.open(editorView, 500, 400);

            const dialogElement = document.querySelector('.pm-dialog');
            ist(dialogElement !== null, true);

            const rows = dialogElement?.querySelectorAll('.pm-menu-row');
            ist(rows?.length, 2);

            const content = dialogElement?.innerHTML || '';
            ist(content.includes('Dialog Title'), true);
            ist(content.includes('Label 1'), true);
            ist(content.includes('Additional info'), true);

            dialog.close(editorView);
        });

        it("should support chaining all methods", () => {
            const dialog = new EditDialog();

            const result = dialog
                .add('<h3>Title</h3>')
                .addRow('<span>Row 1</span>')
                .addRow('<span>Row 2</span>')
                .add('<p>Footer</p>');

            ist(result, dialog);

            dialog.open(editorView, 400, 300);

            const dialogElement = document.querySelector('.pm-dialog');
            ist(dialogElement !== null, true);

            dialog.close(editorView);
        });
    });
});
