import { EditDialog } from './EditDialog';

/**
 * Common element IDs used across file upload dialogs.
 * These IDs are shared between image-item and file-upload-item.
 */
export const COMMON_ELEMENT_IDS = {
    DROP_ZONE: 'pm-drop-zone',
    FILE_INPUT: 'pm-file-input',
    FORM: 'pm-form',
    CAPTION_INPUT: 'pm-caption-input',
    TITLE_INPUT: 'pm-title-input',
    IMG_SIZE_INPUT: 'pm-img-size',
    FLOAT_SETTING: 'pm-setting-float-btn',
    RESIZE_BUTTON_PREFIX: 'pm-resize-img-',
} as const;

/**
 * Extracts file items from a drag event.
 *
 * @param dragEvent - The drag event to extract files from
 * @returns Array of file DataTransferItems
 */
export function getFileItemsFromDragEvent(dragEvent: DragEvent): Array<DataTransferItem> {
    return [...dragEvent.dataTransfer.items].filter(
        (item: DataTransferItem): boolean => item.kind === 'file'
    );
}

/**
 * Extracts File objects from a drop event.
 *
 * @param dragEvent - The drag event to extract files from
 * @returns Array of File objects (null values filtered out)
 */
export function extractFilesFromDropEvent(dragEvent: DragEvent): Array<File> {
    return [...dragEvent.dataTransfer.items]
        .map((item: DataTransferItem): File => item.getAsFile())
        .filter((file: File | null): file is File => file !== null);
}

/**
 * Checks if any file item is an image.
 *
 * @param fileItems - Array of file DataTransferItems
 * @returns True if at least one item is an image
 */
export function hasImageFiles(fileItems: Array<DataTransferItem>): boolean {
    return fileItems.some((item: DataTransferItem): boolean => item.type.startsWith('image/'));
}

/**
 * Options for configuring drag-drop listeners.
 */
export interface DragDropListenerOptions {
    /** The EditDialog to attach listeners to */
    dialog: EditDialog;
    /** The drop zone element ID or element */
    dropZone: HTMLElement;
    /** Callback when files are dropped */
    onDrop: (files: Array<File>) => void;
    /** Optional validator to determine if drop should be allowed (affects drop effect) */
    validateDrop?: (items: Array<DataTransferItem>) => boolean;
}

/**
 * Sets up drag-and-drop event listeners for file uploads.
 *
 * This function configures:
 * - Window-level drop prevention to avoid accidental file opens
 * - Drop zone handlers for drag-and-drop file uploads
 * - Dragover handlers for visual feedback during drag operations
 *
 * @param options - Configuration options for the drag-drop listeners
 */
export function setupDragDropListeners(options: DragDropListenerOptions): void {
    const { dialog, dropZone, onDrop, validateDrop } = options;

    // Prevent default drop behavior on window
    dialog.addListener('window', 'drop', (dragEvent: DragEvent): void => {
        if (getFileItemsFromDragEvent(dragEvent).length > 0) {
            dragEvent.preventDefault();
        }
    });

    // Handle drop on drop zone
    dialog.addListener(dropZone, 'drop', (dragEvent: DragEvent): void => {
        dragEvent.preventDefault();
        const files = extractFilesFromDropEvent(dragEvent);
        onDrop(files);
    });

    // Handle dragover on window
    dialog.addListener('window', 'dragover', (dragEvent: DragEvent): void => {
        const fileItems: Array<DataTransferItem> = getFileItemsFromDragEvent(dragEvent);
        if (fileItems.length > 0) {
            dragEvent.preventDefault();
            // Disable drop effect if not over drop zone
            if (!dropZone.contains(dragEvent.target as HTMLElement)) {
                dragEvent.dataTransfer.dropEffect = 'none';
            }
        }
    });

    // Handle dragover on drop zone
    dialog.addListener(dropZone, 'dragover', (dragEvent: DragEvent): void => {
        const fileItems: Array<DataTransferItem> = getFileItemsFromDragEvent(dragEvent);

        if (fileItems.length > 0) {
            dragEvent.preventDefault();

            // Set appropriate drop effect based on validator or default to 'copy'
            dragEvent.dataTransfer.dropEffect = validateDrop ? (validateDrop(fileItems) ? 'copy' : 'none') : 'copy';
        }
    });
}

/**
 * Creates HTML for a drop zone with file input.
 *
 * @param dropZoneId - The ID for the drop zone label element
 * @param fileInputId - The ID for the file input element
 * @param labelText - The text to display in the drop zone
 * @param accept - The accepted file types (e.g., 'image/\*', '\*\/\*')
 * @param multiple - Whether to allow multiple file selection
 * @returns HTML string for the drop zone
 */
export function createDropZoneHtml(dropZoneId: string,
                                   fileInputId: string,
                                   labelText: string,
                                   accept: string,
                                   multiple = false): string {
    const multipleAttr = multiple ? 'multiple' : '';
    return `
        <label id="${dropZoneId}">${labelText}
            <input type="file" id="${fileInputId}" ${multipleAttr} accept="${accept}" title="${labelText}" />
        </label>
    `;
}
