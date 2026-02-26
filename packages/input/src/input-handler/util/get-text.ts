

/**
 * Extracts text content from clipboard data, falling back to URI list if
 * plain text is not available.
 * @param clipboardData - The clipboard data transfer object
 * @returns The extracted text content
 */
export function getText(clipboardData: DataTransfer): string {
    const text: string = clipboardData.getData('text/plain') || clipboardData.getData('Text');
    if (text) {
        return text;
    }

    const uris: string = clipboardData.getData('text/uri-list');
    return uris ? uris.replace(/\r?\n/g, ' ') : '';
}
