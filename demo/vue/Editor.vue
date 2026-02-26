<template>

    <!-- Edit and Save buttons -->
    <div class="edit-buttons">
        <button @click="toggleEditor(true)" class="pm-button">Edit</button>
        <button @click="toggleEditor(false)" class="pm-button">Save</button>
    </div>

    <!-- ProseMirror editor container -->
    <div v-show="isEditMode" ref="editorRef" class="demo"></div>

    <!-- Static readonly content container -->
    <div v-show="!isEditMode" class="demo">
        <!-- ProseMirror-menubar-wrapper is used here to apply the same CSS styling -->
        <div class="ProseMirror-menubar-wrapper">
            <div
                ref="readonlyRef"
                class="ProseMirror"
                tabindex="0"
                v-html="displayContent"
            ></div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useNodeViewFactory } from '@type-editor/adapter-vue';
import { computed, nextTick, ref } from 'vue';
import type { EditorView as PmEditorView } from '@type-editor/view';
import { EditorView } from '@type-editor/view';
import { schema } from '@type-editor/schema';
import { getHeadingFactory, getParagraphFactory } from './custom-components-factory';
import { defaultPlugins } from '../default-plugins';
import { initialContent } from '../initial-content';

const nodeViewFactory = useNodeViewFactory();
const editorRef = ref<HTMLDivElement | null>(null);
const readonlyRef = ref<HTMLDivElement | null>(null);
const isEditMode = ref(false);
const readonlyHtml = ref('');
// Display initial content if no content has been saved yet
const displayContent = computed(() => readonlyHtml.value || initialContent);

let editorView: PmEditorView | null = null;

/** Create the editor instance */
function createEditor() {
    const editorContainer = editorRef.value;
    if (!editorContainer || editorView) {
        return;
    }

    editorView = EditorView.fromHTML(

        // HTML element the ProseMirror editor is added to
        editorContainer,
        // Schema for the editor content
        schema,
        // Initial content for the editor, parsed from the readonly div
        readonlyRef.value,
        // Menu and shortcuts as Plugins
        defaultPlugins,

        // These custom components are optional and demonstrate how to use nodeViews
        // to render ProseMirror nodes with Vue components.
        {
            paragraph: getParagraphFactory(nodeViewFactory),
            heading: getHeadingFactory(nodeViewFactory),
        },
    );

    // Focus the editor after creation
    nextTick(() => {
        (editorContainer.querySelector('.ProseMirror') as HTMLElement)?.focus();
    });
}

/** Destroy the editor instance */
function destroyEditor() {
    if (editorView) {
        editorView.destroy();
        editorView = null;
    }
}

/** Switch to edit mode */
function switchToEditMode() {
    isEditMode.value = true;
    nextTick(() => {
        createEditor();
    });
}

/** Switch to readonly mode */
function switchToReadonlyMode() {
    if (editorView) {
        // Save the editor content as HTML
        readonlyHtml.value = editorView.toHtml();
    }
    destroyEditor();
    isEditMode.value = false;
    // Focus readonly content after switching
    nextTick(() => {
        readonlyRef.value?.focus();
    });
}

/** Toggle between edit and readonly mode */
function toggleEditor(toEditMode: boolean) {
    if (toEditMode) {
        switchToEditMode();
    } else {
        switchToReadonlyMode();
    }
}
</script>
