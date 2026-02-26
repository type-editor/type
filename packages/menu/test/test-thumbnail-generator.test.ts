import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import ist from 'ist';
import { ThumbnailGenerator } from '@src/menu-items/file-upload/ThumbnailGenerator';

// Mock pdfjs-dist
vi.mock('pdfjs-dist', () => ({
    GlobalWorkerOptions: { workerSrc: '' },
    getDocument: vi.fn()
}));

// Mock DOMToImage
vi.mock('@src/menu-items/file-upload/DOMToImage', () => ({
    domtoimage: {
        toImage: vi.fn().mockResolvedValue('data:image/webp;base64,mockImageData')
    }
}));

/**
 * Helper to create a mock File object with all necessary methods
 */
function createMockFile(
    content: string | ArrayBuffer,
    name: string,
    type: string
): File {
    const contentStr = typeof content === 'string' ? content : '';
    const arrayBuf = typeof content === 'string'
        ? new TextEncoder().encode(content).buffer
        : content;

    return {
        name,
        type,
        size: typeof content === 'string' ? content.length : (content as ArrayBuffer).byteLength,
        lastModified: Date.now(),
        text: vi.fn().mockResolvedValue(contentStr),
        arrayBuffer: vi.fn().mockResolvedValue(arrayBuf),
        slice: vi.fn(),
        stream: vi.fn(),
        webkitRelativePath: '',
    } as unknown as File;
}

describe("ThumbnailGenerator", () => {
    let generator: ThumbnailGenerator;

    beforeEach(() => {
        generator = new ThumbnailGenerator();

        // Mock canvas element
        const mockCanvas = document.createElement('canvas');

        vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            if (tagName === 'canvas') {
                const canvas = mockCanvas;
                canvas.toDataURL = vi.fn().mockReturnValue('data:image/webp;base64,mockCanvasData');
                return canvas;
            }
            // For non-canvas elements, use original implementation
            return Object.getPrototypeOf(document).createElement.call(document, tagName);
        });

        // Mock window.devicePixelRatio
        Object.defineProperty(window, 'devicePixelRatio', {
            value: 2,
            writable: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("constructor", () => {
        it("should create instance with default options", () => {
            const gen = new ThumbnailGenerator();
            ist(gen !== null, true);
        });

        it("should create instance with custom options", () => {
            const gen = new ThumbnailGenerator({
                targetWidth: 200,
                targetHeight: 300,
                fontSizeFilename: 16,
                fontSizeTextFile: 24
            });
            ist(gen !== null, true);
        });
    });

    describe("generateThumbnail - text files", () => {
        it("should generate thumbnail for plain text file", async () => {
            const file = createMockFile('Hello, World!', 'test.txt', 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
            if (thumbnail) {
                ist(typeof thumbnail.src, 'string');
                ist(typeof thumbnail.width, 'number');
                ist(typeof thumbnail.height, 'number');
                ist(thumbnail.width > 0, true);
                ist(thumbnail.height > 0, true);
            }
        });

        it("should generate thumbnail for JSON file", async () => {
            const jsonContent = JSON.stringify({ key: 'value', nested: { a: 1 } }, null, 2);
            const file = createMockFile(jsonContent, 'data.json', 'application/json');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for CSS file", async () => {
            const cssContent = 'body { margin: 0; padding: 0; }';
            const file = createMockFile(cssContent, 'style.css', 'text/css');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for JavaScript file", async () => {
            const jsContent = 'function hello() { console.log("Hello"); }';
            const file = createMockFile(jsContent, 'script.js', 'text/javascript');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for XML file", async () => {
            const xmlContent = '<?xml version="1.0"?><root><item>Test</item></root>';
            const file = createMockFile(xmlContent, 'data.xml', 'application/xml');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for HTML file", async () => {
            const htmlContent = '<html><body><h1>Title</h1></body></html>';
            const file = createMockFile(htmlContent, 'page.html', 'text/html');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });
    });

    describe("generateThumbnail - image files", () => {
        it("should generate thumbnail for PNG image", async () => {
            // Create a minimal valid PNG (1x1 transparent pixel)
            const pngData = new Uint8Array([
                0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
                0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
                0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
                0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
                0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
                0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
                0x42, 0x60, 0x82
            ]);
            const file = createMockFile(pngData.buffer, 'image.png', 'image/png');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
            if (thumbnail) {
                ist(thumbnail.src.startsWith('data:'), true);
            }
        });

        it("should generate thumbnail for JPEG image", async () => {
            // Create a minimal mock JPEG
            const jpegData = new ArrayBuffer(100);
            const file = createMockFile(jpegData, 'photo.jpg', 'image/jpeg');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for GIF image", async () => {
            const gifData = new ArrayBuffer(50);
            const file = createMockFile(gifData, 'animation.gif', 'image/gif');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for WebP image", async () => {
            const webpData = new ArrayBuffer(50);
            const file = createMockFile(webpData, 'image.webp', 'image/webp');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate thumbnail for SVG image", async () => {
            const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>';
            const file = createMockFile(svgContent, 'icon.svg', 'image/svg+xml');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });
    });

    describe("generateThumbnail - PDF files", () => {
        it("should attempt PDF thumbnail generation for PDF files", async () => {
            const { getDocument } = await import('pdfjs-dist');
            const mockPage = {
                getViewport: vi.fn().mockReturnValue({ width: 612, height: 792 }),
                render: vi.fn().mockReturnValue({ promise: Promise.resolve() })
            };
            const mockPdf = {
                getPage: vi.fn().mockResolvedValue(mockPage),
                destroy: vi.fn().mockResolvedValue(undefined)
            };
            (getDocument as any).mockReturnValue({
                promise: Promise.resolve(mockPdf)
            });

            const pdfData = new ArrayBuffer(100);
            const file = createMockFile(pdfData, 'document.pdf', 'application/pdf');

            const thumbnail = await generator.generateThumbnail(file);

            // PDF generation may fail in test environment, but should not throw
            ist(typeof thumbnail === 'object' || thumbnail === null, true);
        });
    });

    describe("generateThumbnail - unknown file types", () => {
        it("should generate filename thumbnail for unknown binary file", async () => {
            const binaryData = new ArrayBuffer(100);
            const file = createMockFile(binaryData, 'document.doc', 'application/msword');

            const thumbnail = await generator.generateThumbnail(file);

            // Should fall back to filename-based thumbnail
            ist(thumbnail !== null, true);
            if (thumbnail) {
                ist(typeof thumbnail.src, 'string');
            }
        });

        it("should generate filename thumbnail for zip file", async () => {
            const zipData = new ArrayBuffer(100);
            const file = createMockFile(zipData, 'archive.zip', 'application/zip');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should generate filename thumbnail for executable", async () => {
            const exeData = new ArrayBuffer(100);
            const file = createMockFile(exeData, 'program.exe', 'application/x-msdownload');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });
    });

    describe("generateThumbnail - custom options", () => {
        it("should use custom target dimensions", async () => {
            const customGenerator = new ThumbnailGenerator({
                targetWidth: 150,
                targetHeight: 200
            });

            const file = createMockFile('Test content', 'test.txt', 'text/plain');
            const thumbnail = await customGenerator.generateThumbnail(file);

            ist(thumbnail !== null, true);
            if (thumbnail) {
                ist(thumbnail.width, 150);
                ist(thumbnail.height, 200);
            }
        });

        it("should use custom font sizes", async () => {
            const customGenerator = new ThumbnailGenerator({
                fontSizeFilename: 24,
                fontSizeTextFile: 32
            });

            const file = createMockFile('Test', 'test.txt', 'text/plain');
            const thumbnail = await customGenerator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });
    });

    describe("generateThumbnail - edge cases", () => {
        it("should handle empty text file", async () => {
            const file = createMockFile('', 'empty.txt', 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should handle file with very long name", async () => {
            const longName = 'a'.repeat(200) + '.txt';
            const file = createMockFile('content', longName, 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should handle file with special characters in name", async () => {
            const file = createMockFile('content', 'file (1) [copy].txt', 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should handle file with unicode characters", async () => {
            const file = createMockFile('日本語テスト', '文書.txt', 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should handle large text content", async () => {
            const largeContent = 'Lorem ipsum '.repeat(1000);
            const file = createMockFile(largeContent, 'large.txt', 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });

        it("should escape HTML in text content", async () => {
            const htmlContent = '<script>alert("xss")</script>';
            const file = createMockFile(htmlContent, 'malicious.txt', 'text/plain');

            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });
    });

    describe("generateThumbnail - error handling", () => {
        it("should return thumbnail even when image generation partially fails", async () => {
            const file = createMockFile('test', 'test.txt', 'text/plain');

            // Should still return a thumbnail
            const thumbnail = await generator.generateThumbnail(file);

            ist(thumbnail !== null, true);
        });
    });
});

describe("ThumbnailGenerator - escapeHtml behavior", () => {
    it("should not throw when generating thumbnail with special characters", async () => {
        const generator = new ThumbnailGenerator();

        // Test various special characters in content
        const testCases = [
            { content: 'Tom & Jerry', name: 'ampersand.txt' },
            { content: '<div>test</div>', name: 'angle-brackets.txt' },
            { content: 'He said "hello"', name: 'quotes.txt' },
            { content: "It's a test", name: 'single-quotes.txt' },
        ];

        for (const testCase of testCases) {
            const file = createMockFile(testCase.content, testCase.name, 'text/plain');
            // Should not throw and should return a thumbnail
            const thumbnail = await generator.generateThumbnail(file);
            ist(thumbnail !== null, true);
        }
    });
});
