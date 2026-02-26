import { type ExtendedSelectionResult, findExtendedMarkSelection, isCodeBlock } from '@type-editor/commands';
import type { PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type DispatchFunction } from '@type-editor/editor-types';
import { type Attrs, type Mark, type MarkType, type NodeType, type PmNode, type ResolvedPos } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { GlobalWorkerOptions } from 'pdfjs-dist';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { ThumbnailGenerator } from './file-upload/ThumbnailGenerator';
import { createHandleDropFinishedPlugin } from './image-item-plugins/create-handle-drop-finished-plugin';
import { createHandleDropPlugin } from './image-item-plugins/create-handle-drop-plugin';
import { createHandlePastePlugin } from './image-item-plugins/create-handle-paste-plugin';
import { documentIsNotEmpty } from './util/document-is-not-empty';
import { COMMON_ELEMENT_IDS, createDropZoneHtml, setupDragDropListeners } from './util/drag-drop-helper';
import { EditDialog } from './util/EditDialog';
import { isSelectionLengthInRange } from './util/is-len-in-range';


/**
 * Element IDs used in the file upload dialog.
 * These IDs are used to reference DOM elements within the dialog.
 */
const ELEMENT_IDS = {
    ...COMMON_ELEMENT_IDS,
    FORM: 'pm-link-form',
    OK_BUTTON: 'pm-ok-btn',
    REMOVE_BUTTON: 'pm-remove-link-btn',
    OPEN_BUTTON: 'pm-open-link-btn',
} as const;


/**
 * Represents the properties of a file attachment in the editor.
 * These properties are stored as mark attributes on file link marks.
 */
interface FileProperties {
    /** URL pointing to the file resource (blob URL or external URL) */
    href: string;
    /** Original filename of the uploaded file */
    name: string;
    /** Timestamp of when the file was last modified */
    lastModified: string;
    /** File size in bytes */
    size: string;
    /** MIME type of the file (e.g., 'application/pdf', 'image/png') */
    type: string;
    /** Unique identifier for the file attachment */
    id: string;
}

/**
 * Represents a generated thumbnail preview for a file.
 */
interface ThumbnailPreview {
    /** Data URL or blob URL of the thumbnail image */
    src: string;
    /** Width of the thumbnail in pixels */
    width: number;
    /** Height of the thumbnail in pixels */
    height: number;
}


// Worker is copied to /public/worker/ by vite-plugin-static-copy in root vite.config.ts
// In dev mode, it's served from /worker/pdf.worker.min.mjs
// In production, consuming apps should configure this path or copy the worker themselves
GlobalWorkerOptions.workerSrc = '/worker/pdf.worker.min.mjs';


/**
 * Creates a menu item for uploading and managing file attachments in the editor.
 *
 * This menu item provides functionality to:
 * - Upload new files via file picker or drag-and-drop
 * - Generate thumbnail previews for supported file types (images, PDFs)
 * - Update existing file attachments
 * - Download attached files
 *
 * When the selection is empty, files are inserted as thumbnail previews (if available)
 * or as text links. When text is selected, the file mark is applied to the selection.
 *
 * @param title - The display title for the menu item. Defaults to 'File Upload'.
 * @param fileType - The mark type used for file attachments. Defaults to `schema.marks.file`.
 * @param codeBlockNodeType - The node type for code blocks (used to disable the item in code blocks).
 *                            Defaults to `schema.nodes.code_block`.
 * @returns A configured MenuItem instance for file uploads.
 *
 * @example
 * ```typescript
 * import { fileUploadItem } from '@type-editor/menu';
 *
 * const menuItem = fileUploadItem('Attach File');
 * ```
 */
export function fileUploadItem(
    title = 'File Upload',
    fileType: MarkType = schema.marks.file,
    codeBlockNodeType: NodeType = schema.nodes.code_block
): MenuItem {

    return new MenuItem({
        title,
        label: title,

        run: (state: PmEditorState, _dispatch: DispatchFunction, editorView: PmEditorView): boolean => {
            const dialog = new EditDialog();
            const selectedFile: FileProperties = retrieveSelectedFileLink(state, fileType);

            createFileUploadForm(dialog, editorView, selectedFile);

            if (selectedFile) {
                attachOpenLinkHandler(dialog, selectedFile, editorView);
            }
            addFileSelectListener(dialog, editorView, fileType, selectedFile);

            return true;
        },

        enable: (state: PmEditorState): boolean =>
            documentIsNotEmpty(state) &&
            isSelectionLengthInRange(state, 500, 0) &&
            !isCodeBlock(state, codeBlockNodeType),

        active: (state: PmEditorState): boolean => isMarkActive(state, fileType),

        render: (editorView: PmEditorView): HTMLElement | null => {
            // Register plugins to handle paste/drop of files
            // These plugins automatically handle file drops and pastes in the editor
            editorView.addPlugin(createHandlePastePlugin());
            editorView.addPlugin(createHandleDropPlugin(editorView));
            editorView.addPlugin(createHandleDropFinishedPlugin());
            return null;
        },

        icon: icons.file,
    });

}


/* -------------------- Insert / update files(s) -------------------- */

/**
 * Creates the file attributes object from a File.
 *
 * @param file - The file to create attributes from.
 * @returns The file attributes for the mark.
 */
function createFileAttrs(file: File): Attrs {
    return {
        href: URL.createObjectURL(file),
        previewImage: null,
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        type: file.type,
    };
}

/**
 * Inserts a file as an image node with a thumbnail preview.
 *
 * @param editorView - The editor view to insert the image into.
 * @param fileType - The mark type for file links.
 * @param fileAttrs - The file attributes for the mark.
 * @param previewImage - The generated thumbnail preview.
 * @param fileName - The original filename for alt text.
 */
function insertFileAsImage(
    editorView: PmEditorView,
    fileType: MarkType,
    fileAttrs: Attrs,
    previewImage: ThumbnailPreview,
    fileName: string
): void {
    const imageAttrs: Attrs = {
        src: previewImage.src,
        alt: fileName || 'File preview',
        title: fileName,
        width: previewImage.width,
        height: previewImage.height,
        cssClass: 'thumbnail',
        size: 50
    };

    const imgType: NodeType = schema.nodes.image;
    const fileMark: Mark = fileType.create(fileAttrs);
    const imgNode: PmNode = imgType.createAndFill(imageAttrs, null, [fileMark]);

    if (imgNode) {
        const transaction: PmTransaction = editorView.state.transaction;
        // Pass false to inheritMarks to preserve the marks we explicitly set on the node
        transaction.replaceSelectionWith(imgNode, false);
        editorView.dispatch(transaction);
    }
}

/**
 * Inserts a file as a text node with the file mark applied.
 *
 * @param editorView - The editor view to insert the text into.
 * @param fileType - The mark type for file links.
 * @param fileAttrs - The file attributes for the mark.
 * @param fileName - The text to display for the link.
 */
function insertFileAsText(
    editorView: PmEditorView,
    fileType: MarkType,
    fileAttrs: Attrs,
    fileName: string
): void {
    const transaction: PmTransaction = editorView.state.transaction;
    const { from } = editorView.state.selection;

    const textNode: PmNode = schema.text(fileName || 'file', [fileType.create(fileAttrs)]);
    transaction.insert(from, textNode);
    editorView.dispatch(transaction);
}

/**
 * Applies the file mark to the currently selected text range.
 *
 * @param editorView - The editor view containing the selection.
 * @param fileType - The mark type for file links.
 * @param fileAttrs - The file attributes for the mark.
 */
function applyFileMarkToSelection(
    editorView: PmEditorView,
    fileType: MarkType,
    fileAttrs: Attrs
): void {
    const state: PmEditorState = editorView.state;
    const transaction: PmTransaction = state.transaction;
    const { from, to } = state.selection;

    transaction.addMark(from, to, fileType.create(fileAttrs));
    editorView.dispatch(transaction);
}

/**
 * Inserts file links into the editor at the current selection.
 *
 * For empty selections:
 * - Generates a thumbnail preview if possible (for images and PDFs)
 * - Inserts an image node with the file mark if a preview is available
 * - Otherwise, inserts a text node with the filename and file mark
 *
 * For non-empty selections:
 * - Applies the file mark to the selected text range
 *
 * @param files - Array of File objects or FileList to insert.
 * @param editorView - The editor view to insert file links into.
 * @param fileType - The mark type for file links.
 */
async function insertFiles(
    files: Array<File> | FileList,
    editorView: PmEditorView,
    fileType: MarkType
): Promise<void> {
    const thumbnailGenerator = new ThumbnailGenerator();

    for (const file of files) {
        const fileAttrs = createFileAttrs(file);

        if (editorView.state.selection.empty) {
            // Generate a thumbnail for the file if possible (e.g., for images and PDFs)
            const previewImage: ThumbnailPreview | null = await thumbnailGenerator.generateThumbnail(file);

            if (previewImage) {
                insertFileAsImage(editorView, fileType, fileAttrs, previewImage, file.name);
            } else {
                insertFileAsText(editorView, fileType, fileAttrs, file.name);
            }
        } else {
            applyFileMarkToSelection(editorView, fileType, fileAttrs);
        }

        editorView.focus();
    }
}


/**
 * Updates an existing file attachment with a new file.
 *
 * This function replaces the file attributes of an existing file mark while
 * preserving the marked text or image node. It validates that the new file
 * has the same name as the original to prevent accidental replacements.
 *
 * @param file - The new file to replace the existing attachment with.
 * @param editorView - The editor view containing the file mark.
 * @param fileMarkType - The mark type for file attachments.
 * @param selectedFile - The properties of the currently selected file to update.
 */
function updateFile(
    file: File,
    editorView: PmEditorView,
    fileMarkType: MarkType,
    selectedFile: FileProperties
): void {
    // Validate that the new file matches the original filename
    if (file.name !== selectedFile.name) {
        return;
    }

    const fileAttrs = createFileAttrs(file);
    const state: PmEditorState = editorView.state;
    const transaction: PmTransaction = state.transaction;
    let { from, to } = state.selection;

    // For empty selections within a file mark, extend to the full mark range
    if (state.selection.empty) {
        const extendedSelection: ExtendedSelectionResult = findExtendedMarkSelection(
            state.doc,
            state.selection.$cursor,
            fileMarkType,
            false
        );

        if (extendedSelection.found) {
            from = extendedSelection.from;
            to = extendedSelection.to;
        }
    }

    // Remove existing file mark and add the updated one
    transaction.removeMark(from, to, fileMarkType);
    transaction.addMark(from, to, fileMarkType.create(fileAttrs));

    editorView.dispatch(transaction);
}


/**
 * Retrieves the properties of the currently selected file in the editor.
 *
 * @param state - The current editor state
 * @param fileMarkType - The node type for files
 * @returns The file properties if a file is selected, null otherwise
 */
function retrieveSelectedFileLink(state: PmEditorState, fileMarkType: MarkType): FileProperties | null {
    if(!isMarkActive(state, fileMarkType)) {
        return null;
    }

    const linkMark: Mark = findLinkMark(state, fileMarkType);

    if (!linkMark?.attrs?.href) {
        return null;
    }

    return {
        href: linkMark.attrs.href as string,
        name: linkMark.attrs.name as string,
        lastModified: linkMark.attrs.lastModified as string,
        size: linkMark.attrs.size as string,
        type: linkMark.attrs.type as string,
        id: linkMark.attrs.id as string,
    };
}

/**
 * Finds the link mark in the current selection or at the cursor position.
 *
 * @param state - The current editor state
 * @param linkMarkType - The mark type to search for
 * @returns The link mark if found, or undefined
 */
function findLinkMark(state: PmEditorState, linkMarkType: MarkType): Mark | undefined {
    const { $from, $to, empty } = state.selection;

    if (empty) {
        // For empty selections, check stored marks or marks at cursor position
        return linkMarkType.isInSet(state.storedMarks || $from.marks());
    }

    // For range selections, check if the range has the mark
    // Use the document's rangeHasMark to check, then find the actual mark
    if (state.doc.rangeHasMark($from.pos, $to.pos, linkMarkType)) {
        // Find the actual mark by checking nodes in the range
        let foundMark: Mark | undefined;
        state.doc.nodesBetween($from.pos, $to.pos, (node) => {
            if (!foundMark && node.isInline) {
                foundMark = linkMarkType.isInSet(node.marks);
            }
            return !foundMark;
        });
        return foundMark;
    }

    return undefined;
}


/* -------------------- Create file dialog -------------------- */


/**
 * Creates and displays the file upload or edit form dialog.
 *
 * @param dialog - The EditDialog instance to populate
 * @param editorView - The editor view for dialog positioning
 * @param selectedFile - The currently selected file (null for new files)
 */
function createFileUploadForm(dialog: EditDialog,
                              editorView: PmEditorView,
                              selectedFile: FileProperties | null): void {
    if (!selectedFile) {
        // Show file upload interface for new files
        createFileUploadDialog(dialog, editorView.state.selection.empty);
    } else {
        createFileUpdateDialog(dialog, selectedFile);
    }

    dialog.open(editorView, 500, 200);
}

/**
 * Creates the file upload interface for new file attachments.
 *
 * Generates a drop zone with a file input that allows users to either
 * click to select files or drag and drop them.
 *
 * @param dialog - The EditDialog instance to populate with the upload UI.
 * @param allowMultipleFiles - Whether to allow selecting multiple files.
 *                             When true, the file input accepts multiple files.
 */
function createFileUploadDialog(dialog: EditDialog, allowMultipleFiles: boolean): void {
    dialog.add(createDropZoneHtml(
        ELEMENT_IDS.DROP_ZONE,
        ELEMENT_IDS.FILE_INPUT,
        'Drop files here, or click to upload.',
        '*/*',
        allowMultipleFiles
    ));
}

/**
 * Creates the file update dialog for modifying existing file attachments.
 *
 * Displays a tabbed dialog with:
 * - Properties page: Contains a download button for the current file
 * - Update File page: Contains a drop zone for replacing the file
 *
 * @param dialog - The EditDialog instance to populate with the update UI.
 * @param selectedFile - The properties of the currently selected file.
 */
function createFileUpdateDialog(dialog: EditDialog, selectedFile: FileProperties): void {
    dialog.addPage('Properties');
    dialog.add(`<form id="${ELEMENT_IDS.FORM}">`);
    dialog.add(`
        <button 
            id="${ELEMENT_IDS.OPEN_BUTTON}" 
            title="Download file" 
            class="pm-menu-btn"
        >Download</button>
    `);
    dialog.add('</form>');
    dialog.addPage('Update File');
    dialog.add(createDropZoneHtml(
        ELEMENT_IDS.DROP_ZONE,
        ELEMENT_IDS.FILE_INPUT,
        'Drop file here, or click to upload.',
        selectedFile.type,
        false
    ));
}



/* -------------------- File dialog event listener -------------------- */

/**
 * Attaches event listeners for file selection via file picker and drag-and-drop.
 *
 * Sets up the following listeners:
 * - File input change handler for standard file picker selection
 * - Window-level drop prevention to avoid accidental file opens
 * - Drop zone handlers for drag-and-drop file uploads
 * - Dragover handlers for visual feedback during drag operations
 *
 * @param dialog - The EditDialog to attach listeners to.
 * @param editorView - The editor view to insert file links into.
 * @param fileType - The mark type for file links.
 * @param selectedFile - Optional. The currently selected file properties for update operations.
 *                       If provided, the file input will update the existing file instead of inserting a new one.
 */
function addFileSelectListener(
    dialog: EditDialog,
    editorView: PmEditorView,
    fileType: MarkType,
    selectedFile?: FileProperties
): void {
    // File input change listener
    dialog.addListener(ELEMENT_IDS.FILE_INPUT, 'change', (event: InputEvent): void => {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
            if(selectedFile) {
                updateFile(files[0], editorView, fileType, selectedFile);
                dialog.close(editorView);
                return;
            }

            insertFiles(files, editorView, fileType)
                .then(_ => { dialog.close(editorView); })
                .catch((err: unknown) => { console.error('Error inserting files:', err); });
        }
    });

    // Drag and drop listeners
    const dropZone: HTMLElement = document.getElementById(ELEMENT_IDS.DROP_ZONE);
    if (!dropZone) {
        return;
    }

    setupDragDropListeners({
        dialog,
        dropZone,
        onDrop: (files: Array<File>): void => {
            if (selectedFile) {
                updateFile(files[0], editorView, fileType, selectedFile);
                dialog.close(editorView);
                return;
            }

            insertFiles(files, editorView, fileType)
                .then(_ => { dialog.close(editorView); })
                .catch((err: unknown): void => { console.error('Error inserting files:', err); });
        },
    });
}


/**
 * Attaches a click handler to the download button in the file dialog.
 *
 * When clicked, creates a temporary anchor element to trigger a file download
 * using the file's blob URL and original filename.
 *
 * @param dialog - The EditDialog containing the download button.
 * @param selectedFile - The properties of the file to download.
 * @param editorView - The editor view to return focus to after download.
 */
function attachOpenLinkHandler(
    dialog: EditDialog,
    selectedFile: FileProperties,
    editorView: PmEditorView
): void {
    dialog.addListener(ELEMENT_IDS.OPEN_BUTTON, 'click', (event: Event): void => {
        event.preventDefault();
        const downloadLink: HTMLAnchorElement = document.createElement('a');
        downloadLink.href = selectedFile.href;
        downloadLink.download = selectedFile.name || 'file';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        dialog.close(editorView);
    });
}



/**
 * Checks whether a specific mark type is active at the current selection.
 *
 * For empty selections (cursor), checks if the mark is present at the cursor position
 * by examining stored marks and marks on adjacent nodes. Returns false if the cursor
 * is adjacent to an image node (identified by the `src` attribute) to avoid treating
 * the mark as active at image boundaries.
 *
 * For range selections, checks if any part of the selected range has the mark.
 *
 * @param state - The current editor state.
 * @param type - The mark type to check for.
 * @returns True if the mark is active at the current selection, false otherwise.
 */
function isMarkActive(state: PmEditorState, type: MarkType): boolean {
    // For range selections, simply check if the range contains the mark
    if (!state.selection.empty) {
        return state.doc.rangeHasMark(state.selection.from, state.selection.to, type);
    }

    // Handle empty selections (cursor position)
    const $pos: ResolvedPos = state.selection.$from;
    const marks: ReadonlyArray<Mark> = state.storedMarks || $pos.marks();

    if (!type.isInSet(marks)) {
        return false;
    }

    const before: PmNode = $pos.nodeBefore;
    const after: PmNode = $pos.nodeAfter;

    const beforeMark: Mark = type.isInSet(before?.marks || []);
    const afterMark: Mark = type.isInSet(after?.marks || []);

    // Mark is active if present on both adjacent nodes
    if (beforeMark && afterMark) {
        return true;
    }

    // Don't treat mark as active if adjacent to an image node
    const isAdjacentToImage: boolean = Boolean(beforeMark && before?.attrs?.src) || Boolean(afterMark && after?.attrs?.src);
    return !isAdjacentToImage;
}
