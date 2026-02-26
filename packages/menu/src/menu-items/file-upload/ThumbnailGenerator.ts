import type { PageViewport, PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { getDocument as getPdfDocument } from 'pdfjs-dist';

import { domtoimage } from './DOMToImage';

/**
 * Represents a generated thumbnail with its dimensions.
 */
export interface Thumbnail {
    /** Base64 data URL of the thumbnail image */
    src: string;
    /** Width of the thumbnail in pixels */
    width: number;
    /** Height of the thumbnail in pixels */
    height: number;
}

/**
 * Configuration options for the ThumbnailGenerator.
 */
export interface ThumbnailGeneratorOptions {
    /** Target width for standard thumbnails in pixels (default: 283) */
    targetWidth?: number;
    /** Target height for standard thumbnails in pixels (default: 400) */
    targetHeight?: number;
    /** Target width for text file thumbnails in pixels (default: 708) */
    targetWidthTextFile?: number;
    /** Target height for text file thumbnails in pixels (default: 1000) */
    targetHeightTextFile?: number;
    /** Font size for filename display in pixels (default: 20) */
    fontSizeFilename?: number;
    /** Font size for text file content in pixels (default: 28) */
    fontSizeTextFile?: number;
}

/** MIME types that should be rendered with monospace font */
const CODE_MIME_TYPES = new Set([
    'application/json',
    'text/json',
    'text/css',
    'text/javascript',
    'application/xml',
    'text/xml',
]);

/** System font stack for consistent cross-platform rendering */
const SYSTEM_FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

/** Default scale factor for high-DPI rendering */
const RETINA_SCALE_FACTOR = 2;

/**
 * Generates thumbnail images from various file types including PDFs, images, and text files.
 *
 * The generator supports multiple file formats and automatically selects the best
 * thumbnail generation strategy based on the file's MIME type.
 *
 * @example
 * ```typescript
 * const generator = new ThumbnailGenerator({ targetWidth: 200, targetHeight: 300 });
 * const thumbnail = await generator.generateThumbnail(file);
 * if (thumbnail) {
 *     img.src = thumbnail.src;
 * }
 * ```
 */
export class ThumbnailGenerator {
    private static readonly DEFAULT_OPTIONS: Required<ThumbnailGeneratorOptions> = {
        targetWidth: 283,
        targetHeight: 400,
        targetWidthTextFile: 708,
        targetHeightTextFile: 1000,
        fontSizeFilename: 20,
        fontSizeTextFile: 28,
    };

    private readonly options: Required<ThumbnailGeneratorOptions>;

    /**
     * Creates a new ThumbnailGenerator instance.
     *
     * @param options - Configuration options for thumbnail generation
     */
    constructor(options: ThumbnailGeneratorOptions = {}) {
        this.options = { ...ThumbnailGenerator.DEFAULT_OPTIONS, ...options };
    }

    /**
     * Generates a thumbnail for the given file.
     *
     * The method selects the appropriate thumbnail generation strategy based on
     * the file's MIME type:
     * - PDF files: Renders the first page
     * - Image files: Creates a scaled preview
     * - Text/code files: Renders the content
     * - Other files: Falls back to displaying the filename
     *
     * @param file - The file to generate a thumbnail for
     * @returns A Promise resolving to a Thumbnail object, or null if generation fails
     */
    public async generateThumbnail(file: File): Promise<Thumbnail | null> {
        const fileType: string = file.type.toLowerCase();

        // Try PDF-specific generation first
        if (fileType === 'application/pdf') {
            const pdfThumbnail: Thumbnail = await this.createThumbnailFromPdf(file);
            if (pdfThumbnail) {
                return pdfThumbnail;
            }
        }

        // Try image or text-based generation
        const contentThumbnail: Thumbnail = fileType.startsWith('image/')
            ? await this.createThumbnailFromImage(file)
            : await this.createThumbnailFromText(file);

        if (contentThumbnail) {
            return contentThumbnail;
        }

        // Fall back to filename-based thumbnail
        return this.createThumbnailFromFilename(file);
    }

    /**
     * Creates a thumbnail by rendering the text content of a file.
     *
     * @param file - The text file to create a thumbnail from
     * @returns A Promise resolving to a Thumbnail object, or null if generation fails
     */
    private async createThumbnailFromText(file: File): Promise<Thumbnail | null> {
        try {
            const textContent: string = await file.text();
            return await this.createThumbnailFromTextContent(textContent, file.type, false);
        } catch (error) {
            console.error('Failed to create thumbnail from text file:', error);
            return null;
        }
    }

    /**
     * Creates a thumbnail from an image file.
     *
     * @param file - The image file to create a thumbnail from
     * @returns A Promise resolving to a Thumbnail object, or null if generation fails
     */
    private async createThumbnailFromImage(file: File): Promise<Thumbnail | null> {
        try {
            const dataUrl: string = await this.fileToDataUrl(file);
            return await this.createThumbnailFromTextContent(dataUrl, file.type, false);
        } catch (error) {
            console.error('Failed to create thumbnail from image:', error);
            return null;
        }
    }

    /**
     * Converts a file to a base64 data URL.
     *
     * @param file - The file to convert
     * @returns A Promise resolving to the data URL string
     */
    private async fileToDataUrl(file: File): Promise<string> {
        const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Convert bytes to base64 using chunked approach for better memory efficiency
        const chunkSize = 8192;
        let binary = '';
        for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk: Uint8Array<ArrayBuffer> = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
            binary += String.fromCharCode(...chunk);
        }

        return `data:${file.type};base64,${btoa(binary)}`;
    }

    /**
     * Creates a fallback thumbnail displaying only the filename.
     *
     * @param file - The file to create a thumbnail for
     * @returns A Promise resolving to a Thumbnail object, or null if generation fails
     */
    private async createThumbnailFromFilename(file: File): Promise<Thumbnail | null> {
        return this.createThumbnailFromTextContent(file.name, file.type, true);
    }

    /**
     * Creates a thumbnail from a PDF file by rendering its first page.
     *
     * @param file - The PDF file to create a thumbnail from
     * @returns A Promise resolving to a Thumbnail object, or null if generation fails
     * @throws Error if the PDF cannot be loaded or rendered
     */
    private async createThumbnailFromPdf(file: File): Promise<Thumbnail | null> {
        const arrayBuffer: ArrayBuffer = await this.readFileAsArrayBuffer(file);
        const pdf: PDFDocumentProxy = await this.loadPdfDocument(arrayBuffer);

        try {
            return await this.renderPdfPageToThumbnail(pdf);
        } finally {
            await pdf.destroy();
        }
    }

    /**
     * Reads a file as an ArrayBuffer.
     *
     * @param file - The file to read
     * @returns A Promise resolving to the ArrayBuffer
     * @throws Error if file reading fails
     */
    private async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        try {
            return await file.arrayBuffer();
        } catch (error) {
            throw new Error(`Error reading file: ${(error as Error).message}`);
        }
    }

    /**
     * Loads a PDF document from an ArrayBuffer.
     *
     * @param arrayBuffer - The PDF data as an ArrayBuffer
     * @returns A Promise resolving to the PDFDocumentProxy
     * @throws Error if the PDF cannot be loaded
     */
    private async loadPdfDocument(arrayBuffer: ArrayBuffer): Promise<PDFDocumentProxy> {
        try {
            const loadingTask: PDFDocumentLoadingTask = getPdfDocument({ data: arrayBuffer });
            return await loadingTask.promise;
        } catch (error) {
            throw new Error(`Failed to load PDF document: ${(error as Error).message}`);
        }
    }

    /**
     * Renders the first page of a PDF to a thumbnail image.
     *
     * @param pdf - The loaded PDF document
     * @returns A Promise resolving to a Thumbnail object, or null if rendering fails
     */
    private async renderPdfPageToThumbnail(pdf: PDFDocumentProxy): Promise<Thumbnail | null> {
        const page: PDFPageProxy = await pdf.getPage(1);
        const viewportUnscaled: PageViewport = page.getViewport({ scale: 1.0 });

        const maxWidth: number = this.options.targetWidth * RETINA_SCALE_FACTOR;
        const maxHeight: number = this.options.targetHeight * RETINA_SCALE_FACTOR;

        const scale: number = this.calculateOptimalScale(viewportUnscaled, maxWidth, maxHeight);
        const viewportScaled: PageViewport = page.getViewport({ scale });

        const canvas: HTMLCanvasElement = this.createCanvas(maxWidth, maxHeight);
        const context: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false });

        if (!context) {
            console.warn('Failed to get 2D canvas context');
            return null;
        }

        const { offsetX, offsetY } = this.calculateCenteringOffsets(viewportScaled, maxWidth, maxHeight);

        const renderContext = {
            canvasContext: context,
            viewport: viewportScaled,
            canvas: null,
            transform: offsetY > 0 || offsetX > 0 ? [1, 0, 0, 1, offsetX, offsetY] : null
        };

        await page.render(renderContext).promise;

        return {
            src: canvas.toDataURL('image/webp'),
            width: canvas.width / RETINA_SCALE_FACTOR,
            height: canvas.height / RETINA_SCALE_FACTOR,
        };
    }

    /**
     * Calculates the optimal scale factor to fit content within bounds.
     *
     * @param viewport - The unscaled viewport
     * @param maxWidth - Maximum width constraint
     * @param maxHeight - Maximum height constraint
     * @returns The optimal scale factor
     */
    private calculateOptimalScale(viewport: PageViewport, maxWidth: number, maxHeight: number): number {
        const scaleByHeight: number = maxHeight / viewport.height;
        const scaleByWidth: number = maxWidth / viewport.width;
        return Math.min(scaleByHeight, scaleByWidth);
    }

    /**
     * Creates a canvas element with the specified dimensions.
     *
     * @param width - Canvas width in pixels
     * @param height - Canvas height in pixels
     * @returns The created canvas element
     */
    private createCanvas(width: number, height: number): HTMLCanvasElement {
        // TODO: Check if OffscreenCanvas is supported and use it if available
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    /**
     * Calculates offsets to center content within a container.
     *
     * @param viewport - The scaled viewport
     * @param containerWidth - Container width
     * @param containerHeight - Container height
     * @returns Object containing offsetX and offsetY values
     */
    private calculateCenteringOffsets(
        viewport: PageViewport,
        containerWidth: number,
        containerHeight: number
    ): { offsetX: number; offsetY: number } {
        return {
            offsetX: (containerWidth - viewport.width) / 2,
            offsetY: (containerHeight - viewport.height) / 2,
        };
    }

    /**
     * Creates a thumbnail by rendering content as a DOM element and converting it to an image.
     *
     * @param content - The content to render (text, filename, or image data URL)
     * @param type - The MIME type of the content
     * @param isFilename - Whether the content represents a filename (fallback display)
     * @returns A Promise resolving to a Thumbnail object, or null if generation fails
     */
    private async createThumbnailFromTextContent(content: string, type: string, isFilename: boolean): Promise<Thumbnail | null> {
        const htmlElement: HTMLElement | null = this.createDOMElement(
            content,
            type,
            isFilename
        );

        if(!htmlElement) {
            return null;
        }

        try {
            const imgUrl: string = await domtoimage
                .toImage(htmlElement, {
                    maxHeight: this.options.targetHeight,
                    maxWidth: this.options.targetWidth,
                    pixelRatio: window.devicePixelRatio || 2,  // Use device pixel ratio for sharp text
                    backgroundColor: '#ffffff',
                });
            return {
                src: imgUrl,
                width: this.options.targetWidth,
                height: this.options.targetHeight,
            };
        } catch (error) {
            console.error('Failed to create thumbnail from DOM element:', error);
            return null;
        }
    }

    /**
     * Creates a DOM element representing the thumbnail content.
     *
     * This method builds an HTML element structure based on the content type,
     * which can then be rendered to an image.
     *
     * @param content - The content to display (text, filename, or image data URL)
     * @param type - The MIME type of the content
     * @param isFilename - Whether the content represents a filename (fallback display)
     * @returns An HTMLElement configured for thumbnail rendering, or null if the type is unsupported
     */
    private createDOMElement(content: string, type: string, isFilename: boolean): HTMLElement | null {
        const container: HTMLDivElement = document.createElement('div');

        if (isFilename) {
            return this.createFilenameElement(container, content);
        }

        return this.createContentElement(container, content, type);
    }

    /**
     * Creates a styled element for displaying a filename.
     *
     * @param container - The container element to style
     * @param filename - The filename to display
     * @returns The styled container element
     */
    private createFilenameElement(container: HTMLDivElement, filename: string): HTMLDivElement {
        Object.assign(container.style, {
            width: `${this.options.targetWidth}px`,
            height: `${this.options.targetHeight}px`,
            padding: '30px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            fontSize: `${this.options.fontSizeFilename}px`,
            fontFamily: SYSTEM_FONT_STACK,
            backgroundColor: '#ffffff',
        });
        container.innerText = filename;
        return container;
    }

    /**
     * Creates a styled element for displaying file content.
     *
     * @param container - The container element to style
     * @param content - The content to display
     * @param type - The MIME type of the content
     * @returns The styled container element, or null if the type is unsupported
     */
    private createContentElement(container: HTMLDivElement, content: string, type: string): HTMLDivElement | null {
        Object.assign(container.style, {
            width: `${this.options.targetWidthTextFile}px`,
            height: `${this.options.targetHeightTextFile}px`,
            padding: '30px',
        });

        if (CODE_MIME_TYPES.has(type)) {
            container.innerHTML = this.createCodePreviewHtml(content);
        } else if (type === 'text/plain') {
            container.innerHTML = this.createPlainTextHtml(content);
        } else if (type.startsWith('text/')) {
            container.innerHTML = content;
        } else if (type.startsWith('image/')) {
            this.applyImageContainerStyles(container);
            container.innerHTML = this.createImagePreviewHtml(content);
        } else {
            return null;
        }

        return container;
    }

    /**
     * Creates HTML for rendering code content with monospace font.
     *
     * @param content - The code content to render
     * @returns HTML string for the code preview
     */
    private createCodePreviewHtml(content: string): string {
        const fontSize: number = this.options.fontSizeTextFile;
        return `<pre style="font-family: monospace; white-space: pre-wrap; word-break: break-word; font-size: ${fontSize}px;">${this.escapeHtml(content)}</pre>`;
    }

    /**
     * Creates HTML for rendering plain text content.
     *
     * @param content - The plain text content to render
     * @returns HTML string for the text preview
     */
    private createPlainTextHtml(content: string): string {
        const fontSize: number = this.options.fontSizeTextFile;
        return `<div style="font-family: ${SYSTEM_FONT_STACK.replace(/"/g, '\'')}; white-space: pre-wrap; word-break: break-word; font-size: ${fontSize}px;">${this.escapeHtml(content)}</div>`;
    }

    /**
     * Creates HTML for rendering an image preview.
     *
     * @param dataUrl - The image data URL
     * @returns HTML string for the image preview
     */
    private createImagePreviewHtml(dataUrl: string): string {
        return `<img src="${dataUrl}" style="max-width: 100%; max-height: 100%;" alt="Preview"/>`;
    }

    /**
     * Applies image container styles to an element.
     *
     * @param element - The element to style
     */
    private applyImageContainerStyles(element: HTMLDivElement): void {
        Object.assign(element.style, {
            padding: '0',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
    }

    /**
     * Escapes HTML special characters to prevent XSS attacks.
     *
     * @param text - The text to escape
     * @returns The escaped text safe for use in innerHTML
     */
    private escapeHtml(text: string): string {
        const htmlEscapeMap: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
        };
        return text.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
    }
}
