<script lang="ts">

    import { useNodeViewFactory } from '@type-editor/adapter-svelte';
    import { schema } from '@type-editor/schema';
    import { EditorView } from '@type-editor/view';
    import { onDestroy, tick } from 'svelte';
    import { defaultPlugins } from '../default-plugins';
    import { initialContent } from '../initial-content';
    import { getHeadingFactory, getParagraphFactory } from './custom-components-factory';


    const nodeViewFactory = useNodeViewFactory()

let editorView: EditorView | null = null
let editorContainer: HTMLDivElement
let readonlyRef: HTMLDivElement
let isEditMode = false
let readonlyHtml = ''

// Display initial content if no content has been saved yet
$: displayContent = readonlyHtml || initialContent

/** Create the editor instance */
const createEditor = () => {
    if (!editorContainer || editorView) {
        return;
    }

    editorView = EditorView.fromHTML(

        // HTML element the ProseMirror editor is added to
        editorContainer,
        // Schema for the editor content
        schema,
        // Initial content for the editor, parsed from the readonly div
        readonlyRef,
        // Menu and shortcuts as Plugins
        defaultPlugins,

        // These custom components are optional and demonstrate how to use nodeViews
        // to render ProseMirror nodes with React components.
        {
            paragraph: getParagraphFactory(nodeViewFactory),
            heading: getHeadingFactory(nodeViewFactory),
        }
    );

    // Focus the editor after creation
    tick().then(() => {
        (editorContainer.querySelector('.ProseMirror') as HTMLElement)?.focus();
    });
};

/** Destroy the editor instance */
const destroyEditor = () => {
    if (editorView) {
        editorView.destroy();
        editorView = null;
    }
};

/** Switch to edit mode */
const switchToEditMode = () => {
    isEditMode = true;
    tick().then(() => {
        createEditor();
    });
};

/** Switch to readonly mode */
const switchToReadonlyMode = () => {
    if (editorView) {
        // Save the editor content as HTML
        readonlyHtml = editorView.toHtml();
    }
    destroyEditor();
    isEditMode = false;
    // Focus readonly content after switching
    tick().then(() => {
        readonlyRef?.focus();
    });
};

/** Toggle between edit and readonly mode */
const toggleEditor = (toEditMode: boolean) => {
    if (toEditMode) {
        switchToEditMode();
    } else {
        switchToReadonlyMode();
    }
};

onDestroy(() => {
    editorView?.destroy()
})


</script>

<!-- Edit and Save buttons -->
<div class="edit-buttons">
    <button on:click={() => toggleEditor(true)} class="pm-button">Edit</button>
    <button on:click={() => toggleEditor(false)} class="pm-button">Save</button>
</div>

<!-- ProseMirror editor container -->
<div bind:this={editorContainer} class="demo" style="display: {isEditMode ? 'block' : 'none'};"></div>

<!-- Static readonly content container -->
<div class="demo" style="display: {!isEditMode ? 'block' : 'none'};">
    <!-- ProseMirror-menubar-wrapper is used here to apply the same CSS styling -->
    <div class="ProseMirror-menubar-wrapper">
        <div
            bind:this={readonlyRef}
            class="ProseMirror"
            tabindex="-1"
        >
            {@html displayContent}
        </div>
    </div>
</div>
