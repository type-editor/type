import type { PmEditorView } from '@type-editor/editor-types';
import { DOMParser as PmDOMParser } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { EditorState } from '@type-editor/state';
import { EditorView } from '@type-editor/view';

import { defaultPlugins } from '../default-plugins';

// HTML element to add the editor to
const editorContainer: HTMLElement = document.getElementById('editor');

const readonlyContainer: HTMLElement = document.getElementById('readonly-container');
// Initial content for the editor
const readonlyContent: HTMLElement = document.getElementById('readonly-content');

let editorView: PmEditorView;

// Create new ProseMirror editor instance
function createEditor(): PmEditorView {
    return new EditorView(editorContainer, {

        state: EditorState.create({
            doc: PmDOMParser.fromSchema(schema).parse(readonlyContent),
            plugins: defaultPlugins,
        })

    });
}


/** Toggle between edit and read-only mode */

document.getElementById('edit-btn').addEventListener('click', () => {
    toggleEditor(true);
});

document.getElementById('save-btn').addEventListener('click', () => {
    toggleEditor(false);
});

function toggleEditor(isEdit: boolean): void {
    if(isEdit && !editorView) {
        switchToEditMode();
    } else if(!isEdit && editorView) {
        switchToReadonlyMode();
    }
}

function switchToEditMode(): void {
    readonlyContainer.style.display = 'none';
    editorContainer.style.display = 'block';

    editorView = createEditor();
    (editorContainer.querySelector('.ProseMirror') as HTMLElement).focus();
}

function switchToReadonlyMode(): void {
    if(editorContainer.classList.contains('fullscreen')) {
        readonlyContainer.classList.add('fullscreen');
    } else {
        readonlyContainer.classList.remove('fullscreen');
    }

    // Copy content from editor to static div
    readonlyContent.innerHTML = editorView.toHtml();

    destroyEditor();
    editorContainer.style.display = 'none';

    // Show static content
    readonlyContainer.style.display = 'block';
    readonlyContent.focus();
}

function destroyEditor() {
    if(editorView) {
        editorView.destroy();
        editorView = null;
    }
}
