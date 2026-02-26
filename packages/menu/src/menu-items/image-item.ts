import { isCodeBlock } from '@type-editor/commands';
import type { PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type DispatchFunction } from '@type-editor/editor-types';
import { type Attrs, type Mark, type NodeType, type PmNode, type ResolvedPos } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { createHandleDropFinishedPlugin } from './image-item-plugins/create-handle-drop-finished-plugin';
import { createHandleDropPlugin } from './image-item-plugins/create-handle-drop-plugin';
import { createHandlePastePlugin } from './image-item-plugins/create-handle-paste-plugin';
import {
    COMMON_ELEMENT_IDS,
    createDropZoneHtml,
    hasImageFiles,
    setupDragDropListeners,
} from './util/drag-drop-helper';
import { EditDialog } from './util/EditDialog';
import { isSelectionLengthInRange } from './util/is-len-in-range';

/**
 * Element IDs used in the image dialog
 */
const ELEMENT_IDS = {
    ...COMMON_ELEMENT_IDS,
    FORM: 'pm-image-form',
    EXTERNAL_FILE_INPUT: 'pm-external-file-input',
} as const;

/**
 * Available image sizes
 */
const IMAGE_SIZES = [25, 50, 75, 100] as const;

/**
 * Labels for image size buttons
 */
const IMAGE_SIZE_LABELS: Record<number, string> = {
    25: 'Small',
    50: 'Medium',
    75: 'Large',
    100: 'Original',
};

/**
 * Default image size (100%)
 */
const DEFAULT_IMAGE_SIZE = '100';



/**
 * Properties of an image node
 */
interface ImageProperties {
    /** Source URL of the image */
    src: string;
    /** Title attribute of the image */
    title: string;
    /** Alt text for accessibility */
    alt: string;
    /** Optional caption text */
    caption: string;
    /** Size of the image as a percentage string (e.g., "75") */
    size: string;
    /** Unique identifier for the image */
    id: string;
    /** Whether text should flow around the image */
    textaround: boolean;
    /** Marks applied to the image (e.g., link marks) */
    marks: ReadonlyArray<Mark>;
    cssClass?: string;
    width?: string;
    height?: string;
}


/**
 * Creates a menu item for inserting and editing images in the editor.
 *
 * This menu item provides functionality to:
 * - Insert new images via file picker or drag-and-drop
 * - Edit existing image properties (caption, size, text flow)
 * - Handle conversion between paragraph and figure nodes based on caption presence
 *
 * @param title - Display title for the menu item (default: 'Image')
 * @param imgType - Node type for images (default: schema.nodes.image)
 * @param figureType - Node type for figures with captions (default: schema.nodes.figure)
 * @param codeBlockNodeType - used to identify code blocks where image insertion is disabled (default: schema.nodes.code_block)
 * @returns A configured MenuItem instance
 */
export function imageItem(title = 'Image',
                          imgType: NodeType = schema.nodes.image,
                          figureType: NodeType = schema.nodes.figure,
                          codeBlockNodeType: NodeType = schema.nodes.code_block): MenuItem {
    return new MenuItem({
        title,
        label: title,

        run: (state: PmEditorState, _dispatch: DispatchFunction, editorView: PmEditorView): boolean => {
            const dialog = new EditDialog();
            const selectedImage: ImageProperties = getSelectedImage(state, imgType);

            createImageUploadForm(dialog, editorView, selectedImage);

            if (!selectedImage) {
                // Add new image
                addImageSelectListener(dialog, editorView, imgType);
            } else {
                // Update existing image
                addImageUpdateListener(selectedImage, dialog, editorView, imgType, figureType);
            }

            return true;
        },

        enable: (state: PmEditorState): boolean => isSelectionLengthInRange(state, 1, 0) && !isCodeBlock(state, codeBlockNodeType),
        active: (state: PmEditorState): boolean => getSelectedImage(state, imgType) !== null,

        render: (editorView: PmEditorView): HTMLElement | null => {
            // Register plugins to handle paste/drop of images with captions
            // Automatically converts between paragraph and figure nodes as needed
            editorView.addPlugin(createHandlePastePlugin());
            editorView.addPlugin(createHandleDropPlugin(editorView));
            editorView.addPlugin(createHandleDropFinishedPlugin());
            return null;
        },

        icon: icons.image,
    });

}


/* -------------------- Insert / update image(s) -------------------- */

/**
 * Inserts image files into the editor at the current selection.
 *
 * @param files - Array of File or FileList objects to insert
 * @param editorView - The editor view to insert images into
 * @param imgType - The node type for images
 */
function insertImages(files: Array<File> | FileList,
                      editorView: PmEditorView,
                      imgType: NodeType): void {
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const attrs: Attrs = {
                src: URL.createObjectURL(file),
                title: '',
                alt: '',
            };

            const imageNode: PmNode = imgType.createAndFill(attrs);
            if (imageNode) {
                editorView.dispatch(
                    editorView.state.transaction.replaceSelectionWith(imageNode)
                );
            }
            editorView.focus();
        }
    }
}

/**
 * Inserts image files into the editor at the current selection.
 *
 * @param url - URL of the external image
 * @param editorView - The editor view to insert images into
 * @param imgType - The node type for images
 */
function insertExternalImage(url: string,
                             editorView: PmEditorView,
                             imgType: NodeType): void {
    if(!url) {
        return;
    }

    const attrs: Attrs = {
        src: url,
        title: '',
        alt: '',
    };

    const imageNode: PmNode = imgType.createAndFill(attrs);
    if (imageNode) {
        editorView.dispatch(
            editorView.state.transaction.replaceSelectionWith(imageNode)
        );
    }
    editorView.focus();
}

/**
 * Updates an existing image node in the editor and handles conversion between
 * paragraph and figure nodes based on caption presence.
 *
 * @param currentImageProperties - The current properties of the image
 * @param updateImageProperties - The updated properties to apply
 * @param editorView - The editor view containing the image
 * @param imgType - The node type for images
 * @param figureType - The node type for figures
 */
function updateImage(currentImageProperties: ImageProperties,
                     updateImageProperties: ImageProperties,
                     editorView: PmEditorView,
                     imgType: NodeType,
                     figureType: NodeType): void {
    const { state } = editorView;
    const { selection } = state;
    const { $from } = selection;

    let transaction = state.transaction;

    const parentNode = $from.parent;
    const isInParagraph = parentNode.type.name === 'paragraph';

    const captionAdded = updateImageProperties.caption && !currentImageProperties.caption;
    const captionRemoved = !updateImageProperties.caption && currentImageProperties.caption;

    // Handle caption removal - may need to convert figure to paragraph
    if (captionRemoved) {
        transaction = handleCaptionRemoval($from, parentNode, imgType, transaction, state);
    }
    // Handle caption addition - may need to convert paragraph to figure
    else if (captionAdded && isInParagraph) {
        transaction = handleCaptionAddition($from, parentNode, figureType, transaction);
    }

    // Insert image node with updated attributes (replacing existing image)
    const imgNode: PmNode = imgType.createAndFill(
        updateImageProperties,
        null,
        currentImageProperties.marks
    );

    if (imgNode) {
        // Pass false to inheritMarks to preserve the marks we explicitly set on the node
        transaction = transaction.replaceSelectionWith(imgNode, false);
    }

    editorView.dispatch(transaction);
}

/**
 * Handles the removal of a caption from an image, potentially converting
 * a figure back to a paragraph if it's the last captioned image.
 *
 * @param $from - The resolved position of the selection
 * @param parentNode - The parent node containing the image
 * @param imgType - The node type for images
 * @param transaction - The current transaction
 * @param state - The editor state
 * @returns The updated transaction
 */
function handleCaptionRemoval($from: ResolvedPos,
                              parentNode: PmNode,
                              imgType: NodeType,
                              transaction: PmTransaction,
                              state: PmEditorState): PmTransaction {
    // Count images and figcaptions in the wrapping figure
    const { imageCount, figcaptionCount } = countImagesInNode(parentNode, imgType);

    // If this is the only image with a caption, convert figure to paragraph
    if (imageCount === 1 || figcaptionCount === 1) {
        const figureStart = $from.before($from.depth);
        const figureEnd = $from.after($from.depth);
        const paragraphType = state.schema.nodes.paragraph;

        // Preserve figure attributes when converting
        const figureAttrs = parentNode.attrs;

        transaction.setBlockType(figureStart, figureEnd, paragraphType, figureAttrs);
    }

    return transaction;
}

/**
 * Handles the addition of a caption to an image, converting the
 * wrapping paragraph to a figure.
 *
 * @param $from - The resolved position of the selection
 * @param parentNode - The parent node containing the image
 * @param figureType - The node type for figures
 * @param transaction - The current transaction
 * @returns The updated transaction
 */
function handleCaptionAddition($from: ResolvedPos,
                               parentNode: PmNode,
                               figureType: NodeType,
                               transaction: PmTransaction): PmTransaction {
    const paragraphStart = $from.before($from.depth);
    const paragraphEnd = $from.after($from.depth);

    // Preserve paragraph attributes when converting
    const paragraphAttrs = parentNode.attrs;

    transaction.setBlockType(paragraphStart, paragraphEnd, figureType, paragraphAttrs);

    return transaction;
}

/**
 * Counts the number of images and captioned images in a node.
 *
 * @param node - The node to examine
 * @param imgType - The node type for images
 * @returns Object containing imageCount and figcaptionCount
 */
function countImagesInNode(node: PmNode,
                           imgType: NodeType): { imageCount: number; figcaptionCount: number } {
    let imageCount = 0;
    let figcaptionCount = 0;

    node.forEach((child: PmNode): void => {
        if (child.type === imgType) {
            imageCount++;

            if (child.attrs.caption) {
                figcaptionCount++;
            }
        }
    });

    return { imageCount, figcaptionCount };
}


/* -------------------- Helper -------------------- */

/**
 * Retrieves the properties of the currently selected image in the editor.
 *
 * @param state - The current editor state
 * @param imgType - The node type for images
 * @returns The image properties if an image is selected, null otherwise
 */
function getSelectedImage(state: PmEditorState, imgType: NodeType): ImageProperties | null {
    const { $from } = state.selection;
    const node: PmNode = $from.node();

    let attrs: Attrs | undefined;
    let marks: ReadonlyArray<Mark> = [];

    if (node?.type === imgType) {
        attrs = node.attrs;
        marks = node.marks;
    } else if (state.selection.node?.type === imgType) {
        attrs = state.selection.node.attrs;
        marks = state.selection.node.marks;
    }

    return attrs ? {
        src: attrs.src as string,
        title: attrs.title as string,
        alt: attrs.title as string,
        caption: attrs.caption as string,
        size: attrs.size as string,
        id: attrs.id as string,
        textaround: Boolean(attrs.textaround),
        marks,
        cssClass: attrs.cssClass as string,
        width: attrs.width as string,
        height: attrs.height as string,
    } : null;
}



/* -------------------- Create image dialog -------------------- */


/**
 * Creates and displays the image upload or edit form dialog.
 *
 * @param dialog - The EditDialog instance to populate
 * @param editorView - The editor view for dialog positioning
 * @param selectedImage - The currently selected image (null for new images)
 */
function createImageUploadForm(dialog: EditDialog,
                               editorView: PmEditorView,
                               selectedImage: ImageProperties | null): void {
    if (!selectedImage) {
        // Show file upload interface for new images
        createImageUploadDialog(dialog);
    } else {
        // Show edit interface for existing images
        createImageUpdateDialog(dialog, selectedImage);
    }

    dialog.open(editorView, 500, 350);

    // Highlight the currently selected size button
    if (selectedImage) {
        const sizeButton = document.getElementById(
            `${ELEMENT_IDS.RESIZE_BUTTON_PREFIX}${selectedImage.size || DEFAULT_IMAGE_SIZE}`
        );
        sizeButton?.classList.add('active');
    }
}

/**
 * Creates the file upload interface for new images.
 *
 * @param dialog - The EditDialog instance to populate
 */
function createImageUploadDialog(dialog: EditDialog): void {
    dialog
        .addPage('Internal')
        .add(createDropZoneHtml(
            ELEMENT_IDS.DROP_ZONE,
            ELEMENT_IDS.FILE_INPUT,
            'Drop images here, or click to upload.',
            'image/*',
            true
        ))

        .addPage('External')
        .addRow(
            `
            <form id="${ELEMENT_IDS.FORM}">
                <label for="${ELEMENT_IDS.EXTERNAL_FILE_INPUT}" class="hidden">External image URL</label>
                <input id="${ELEMENT_IDS.EXTERNAL_FILE_INPUT}" type="text" placeholder="External image URL" style="width: 300px;" />
                <button title="Insert image" class="pm-menu-btn">OK</button>
            </form>
        `);
}

/**
 * Creates the edit interface for existing images.
 *
 * @param dialog - The EditDialog instance to populate
 * @param selectedImage - The currently selected image
 */
function createImageUpdateDialog(dialog: EditDialog, selectedImage: ImageProperties): void {
    const title = selectedImage.title || '';
    const imgCaption = selectedImage.caption || '';
    const textAroundChecked = selectedImage.textaround ? 'checked' : '';
    const imgSize = selectedImage.size || DEFAULT_IMAGE_SIZE;

    dialog
        .add(`<form id="${ELEMENT_IDS.FORM}">`)
        .addRow(`
            <label for="${ELEMENT_IDS.CAPTION_INPUT}" class="hidden">URL:</label>
            <input id="image-url" type="text" value="${selectedImage.src}" readonly disabled />
        `)
        .addRow(`
            <label for="${ELEMENT_IDS.TITLE_INPUT}" class="hidden">Title / Alt:</label>
            <input id="${ELEMENT_IDS.TITLE_INPUT}" type="text" value="${title}" placeholder="Title / Alt" />
            <button title="Update Image" class="pm-menu-btn">OK</button>
        `)
        .addRow(`
            <label for="${ELEMENT_IDS.CAPTION_INPUT}" class="hidden">Image caption:</label>
            <input id="${ELEMENT_IDS.CAPTION_INPUT}" type="text" value="${imgCaption}" placeholder="Image caption (below image)" />
        `)
        .addRow(createImageSizeControls(imgSize))
        .addRow(`
            <label for="${ELEMENT_IDS.FLOAT_SETTING}">Text flow around image</label>
            <input id="${ELEMENT_IDS.FLOAT_SETTING}" type="checkbox" ${textAroundChecked} title="Text flow around image"/>
        `)
        .add('</form>');
}

/**
 * Creates the HTML for image size control buttons.
 *
 * @param currentSize - The current image size
 * @returns HTML string for size controls
 */
function createImageSizeControls(currentSize: string): string {
    return `
        <label>Image size:</label>
        <button id="${ELEMENT_IDS.RESIZE_BUTTON_PREFIX}25" class="pm-menu-btn ${currentSize ===  '25' ? 'active' : ''}" title="${IMAGE_SIZE_LABELS[25]}">${IMAGE_SIZE_LABELS[25]}</button>
        <button id="${ELEMENT_IDS.RESIZE_BUTTON_PREFIX}50" class="pm-menu-btn ${currentSize ===  '50' ? 'active' : ''}" title="${IMAGE_SIZE_LABELS[50]}">${IMAGE_SIZE_LABELS[50]}</button>
        <button id="${ELEMENT_IDS.RESIZE_BUTTON_PREFIX}75" class="pm-menu-btn ${currentSize ===  '75' ? 'active' : ''}" title="${IMAGE_SIZE_LABELS[75]}">${IMAGE_SIZE_LABELS[75]}</button>
        <button id="${ELEMENT_IDS.RESIZE_BUTTON_PREFIX}100" class="pm-menu-btn ${currentSize ===  '100' ? 'active' : ''}" title="${IMAGE_SIZE_LABELS[100]}">${IMAGE_SIZE_LABELS[100]}</button>
        <input type="hidden" id="${ELEMENT_IDS.IMG_SIZE_INPUT}" value="${currentSize}" />
    `;
}



/* -------------------- Image dialog event listener -------------------- */

/**
 * Attaches event listeners for image selection via file picker and drag-and-drop.
 *
 * @param dialog - The EditDialog to attach listeners to
 * @param editorView - The editor view to insert images into
 * @param imgType - The node type for images
 */
function addImageSelectListener(dialog: EditDialog,
                                editorView: PmEditorView,
                                imgType: NodeType): void {
    // File input change listener
    dialog.addListener(ELEMENT_IDS.FILE_INPUT, 'change', (event: InputEvent): void => {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
            insertImages(files, editorView, imgType);
            dialog.close(editorView);
        }
    });

    // External URL input OK button listener
    dialog.addListener(ELEMENT_IDS.FORM, 'submit', (event: Event): void => {
        event.preventDefault();

        const externalImageUrl = document.getElementById(ELEMENT_IDS.EXTERNAL_FILE_INPUT) as HTMLInputElement;
        insertExternalImage(externalImageUrl.value, editorView, imgType);
        dialog.close(editorView);
    });

    // Drag and drop listeners
    const dropZone = document.getElementById(ELEMENT_IDS.DROP_ZONE);
    if (!dropZone) {
        return;
    }

    setupDragDropListeners({
        dialog,
        dropZone,
        onDrop: (files: Array<File>): void => {
            insertImages(files, editorView, imgType);
            dialog.close(editorView);
        },
        validateDrop: hasImageFiles,
    });
}

/**
 * Attaches event listeners for updating an existing image's properties.
 *
 * @param selectedImage - The currently selected image to update
 * @param dialog - The EditDialog to attach listeners to
 * @param editorView - The editor view containing the image
 * @param imgType - The node type for images
 * @param figureType - The node type for figures
 */
function addImageUpdateListener(selectedImage: ImageProperties,
                                dialog: EditDialog,
                                editorView: PmEditorView,
                                imgType: NodeType,
                                figureType: NodeType): void {
    // Collect all resize buttons. These are needed to manage active state (click on button must deactivate others)
    const resizeButtons: Array<HTMLButtonElement> = IMAGE_SIZES
        .map((size: 25 | 50 | 75 | 100): HTMLButtonElement => document.getElementById(`${ELEMENT_IDS.RESIZE_BUTTON_PREFIX}${size}`) as HTMLButtonElement)
        .filter(Boolean);

    // Attach resize button listeners
    for (const [index, size] of IMAGE_SIZES.entries()) {
        const button = resizeButtons[index];
        if (button) {
            dialog.addListener(button, 'click', createResizeListener(size, resizeButtons));
        }
    }

    // Update image on OK button click
    dialog.addListener(ELEMENT_IDS.FORM, 'submit', (event: Event): void => {
        event.preventDefault();

        const imgSizeInput = document.getElementById(ELEMENT_IDS.IMG_SIZE_INPUT) as HTMLInputElement;
        const imgTitleInput = document.getElementById(ELEMENT_IDS.TITLE_INPUT) as HTMLInputElement;
        const imgCaptionInput = document.getElementById(ELEMENT_IDS.CAPTION_INPUT) as HTMLInputElement;
        const imgTextAroundInput = document.getElementById(ELEMENT_IDS.FLOAT_SETTING) as HTMLInputElement;

        if (!imgSizeInput || !imgTitleInput || !imgCaptionInput || !imgTextAroundInput) {
            return;
        }

        const imgSize = imgSizeInput.value;
        const imgTitle = imgTitleInput.value;
        const imgCaption = imgCaptionInput.value;
        const imgTextAround = imgTextAroundInput.checked;

        updateImage(
            selectedImage,
            {
                ...selectedImage,
                title: imgTitle,
                alt: imgTitle,
                caption: imgCaption,
                size: imgSize === DEFAULT_IMAGE_SIZE ? null : imgSize,
                textaround: imgTextAround,
            },
            editorView,
            imgType,
            figureType
        );

        dialog.close(editorView);
    });
}


/**
 * Creates a resize button click handler that updates the active state and hidden input.
 *
 * @param size - The size to set when clicked
 * @param allButtons - All resize buttons for toggling active state
 * @returns An event handler function
 */
function createResizeListener(size: number, allButtons: Array<HTMLButtonElement>): (event: Event) => void {
    return (event: Event): void => {
        // event.preventDefault();

        // Remove active class from all buttons
        for (const button of allButtons) {
            button.classList.remove('active');
        }

        // Add active class to clicked button
        (event.target as HTMLElement).classList.add('active');

        // Update hidden input value
        const sizeInput = document.getElementById(ELEMENT_IDS.IMG_SIZE_INPUT) as HTMLInputElement;
        if (sizeInput) {
            sizeInput.value = size.toString();
        }
    };
}

