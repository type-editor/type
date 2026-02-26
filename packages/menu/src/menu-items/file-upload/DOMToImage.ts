// Originally adapted from: https://github.com/1904labs/dom-to-image-more

/**
 * DOM to Image library
 * Converts DOM nodes to various image formats (SVG, PNG, WebP, etc.)
 *
 * This library provides functionality to render DOM elements as images by:
 * 1. Cloning the DOM tree
 * 2. Inlining all external resources
 * 3. Converting to SVG with embedded styles
 * 4. Rendering to canvas for raster output
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Configuration options for DOM to Image conversion
 */
export interface DomToImageOptions {
    /** Image quality (0-1) for lossy formats like WebP/JPEG */
    quality?: number;
    /** Maximum width in pixels for the output image */
    maxWidth?: number;
    /** Maximum height in pixels for the output image */
    maxHeight?: number;
    /** Pixel ratio for high-DPI rendering (default: 2) */
    pixelRatio?: number;
    /**  Background color to use for the output image */
    backgroundColor?: string;
}

/**
 * Tracks DOM modifications that need to be restored after rendering
 */
interface Restoration {
    /** Original parent node */
    readonly parent: Node;
    /** Original child node */
    readonly child: Node;
    /** Temporary wrapper element */
    readonly wrapper: HTMLSpanElement;
}

/**
 * Cache for computed default styles by tag hierarchy
 */
type DefaultStyleCache = Record<string, Record<string, string>>;

// ============================================================================
// Constants
// ============================================================================

/** Placeholder image used for external images that cannot be loaded */
const PLACEHOLDER_IMAGE = new Image(30, 31);
PLACEHOLDER_IMAGE.src = 'data:image/jpeg;base64,/9j/4QDKRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAADygAwAEAAAAAQAAADCkBgADAAAAAQAAAAAAAAAAAAD/2wCEAAEBAQEBAQIBAQIDAgICAwQDAwMDBAUEBAQEBAUGBQUFBQUFBgYGBgYGBgYHBwcHBwcICAgICAkJCQkJCQkJCQkBAQEBAgICBAICBAkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCf/dAAQABP/AABEIADAAPAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP6y9A8OLr8lzulMXkkdBnrn6elbX/CEab/0EV/8c/8AiqseA1JTUvoP/Zq8xih81lijXLNhQPc8CgD0b/hCNO/6CK/+Of8AxVL/AMIRpv8A0Ek/8d/+KrQg+Glv9lxc3BE2OdqjaD6Y6n9K801LTZNLvpNPuQN8RxkdCOxH4UAd1/whGnf9BFf/ABz/AOKo/wCEI03/AKCK/wDjn/xVecbE9BRsT0FAHpcfgK0lz5N9v2/3Qp/ka4qxB8tsf3v6Cuz+HC/6RehR/wAs1/ma5HT/APVN/vf0FAH/0P68fAXTU/oP/Zq8yt5nt5Y7iP70ZDD8Oa9N8BdNT+g/9mry0dBQB7pB4+0CS18+d2jfHMe0k59scGvIdb1M6xqkuoldgcjavooGBWVVyy0++1F/LsIXlP8Asjj8+lAGnomg3GtQXckHW3j3KPVv7v5A1z9e/wDhDRptF0nyrpQs0jF3A5x2A/AV5N4u04aZr00SDCSfvE9MN2/A0AdL8Nv+Pi9/65p/M1x2n/6pv97+grsfht/x8Xv/AFzT+ZrjtP8A9U3+9/QUAf/R/rt8BsQmpfQf+zV5eGXA5FddoHiJdAkud0Jl80jocYxn2962h4305SCNOUY/3P8A4mgC54T8HrtXUtYjzn7kTfzYfyFenx7YkEcahVHQAYH5CvMP+Fjp/wA+h/77H+FH/Cx0/wCfQ/8AfY/woA9S3mvP/Hujz6hax6hapue3yGA67D/hWb/wsdP+fQ/99j/Cj/hY6f8APof++x/hQBV+HDYuL3b/AM81/ma5HT/9U3+9/QV2CePbSLPlWOzd12lR/Ja4qxJ8tsf3v6CgD//Z';

/** Node type constant for element nodes */
const ELEMENT_NODE = Node.ELEMENT_NODE;

/** Styles to position elements off-screen during processing */
const OFFSCREEN_STYLES: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    left: '-9999px',
    visibility: 'hidden',
};

/** Block-level elements that stop hierarchy traversal for style computation */
const ASCENT_STOPPERS: ReadonlySet<string> = new Set([
    'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DETAILS', 'DIALOG',
    'DD', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
    'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
    'HGROUP', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION',
    'SVG', 'TABLE', 'UL',
    'math', 'svg', // intentionally lowercase for Safari compatibility
    'BODY', 'HEAD', 'HTML',
]);

/** CSS properties that require vendor prefixes */
const PROPERTIES_NEEDING_PREFIX: ReadonlySet<string> = new Set(['background-clip']);

/** Default pixel ratio for high-DPI rendering */
const DEFAULT_PIXEL_RATIO = 2;

/** Timeout duration (ms) before clearing the style cache */
const CACHE_CLEAR_TIMEOUT_MS = 20_000;

/** Zero-width space character for ensuring layout computation */
const ZERO_WIDTH_SPACE = '\u200b';

/** Singleton XMLSerializer instance for performance */
let xmlSerializer: XMLSerializer | null = null;

/**
 * Gets the singleton XMLSerializer instance
 * @returns The XMLSerializer instance
 */
function getXmlSerializer(): XMLSerializer {
    if (!xmlSerializer) {
        xmlSerializer = new XMLSerializer();
    }
    return xmlSerializer;
}


// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Utility class providing helper methods for DOM manipulation,
 * type checking, and data conversion operations.
 */
class Util {
    /** Counter for generating unique IDs */
    private uidIndex = 0;

    // ========================================================================
    // String and Data Manipulation
    // ========================================================================

    /**
     * Checks if a URL is a data URL (inline data)
     * @param url - The URL string to check
     * @returns True if the URL is a data URL
     */
    public isDataUrl(url: string): boolean {
        return url.startsWith('data:');
    }

    /**
     * Generates a unique ID string
     * Combines random characters with an incrementing counter for uniqueness
     * @returns A unique identifier string
     */
    public uid(): string {
        const randomChars = Math.floor(Math.random() * Math.pow(36, 4))
            .toString(36)
            .padStart(4, '0');
        return `u${randomChars}${this.uidIndex++}`;
    }

    /**
     * Converts array-like objects (NodeList, HTMLCollection, etc.) to arrays
     * @param arrayLike - An array-like object to convert
     * @returns A standard JavaScript array
     */
    public asArray<T>(arrayLike: ArrayLike<T>): Array<T> {
        return Array.from(arrayLike);
    }

    /**
     * Escapes special characters for XHTML/SVG compatibility
     * Encodes percent signs, hashes, and newlines to prevent parsing issues
     * @param string - The string to escape
     * @returns The escaped string safe for use in XHTML/SVG
     */
    public escapeXhtml(string: string): string {
        return string
            .replace(/%/g, '%25')
            .replace(/#/g, '%23')
            .replace(/\n/g, '%0A');
    }

    // ========================================================================
    // Image and Resource Handling
    // ========================================================================

    /**
     * Creates an HTMLImageElement from a URI
     * @param uri - The image URI (data URL or regular URL)
     * @returns A promise that resolves to an image element, or undefined for empty data URLs
     * @throws Error if the image fails to load
     */
    public async makeImage(uri: string): Promise<HTMLImageElement | undefined> {
        if (uri === 'data:,') {
            return undefined;
        }

        let image: HTMLImageElement | undefined;
        try {
            image = await this.loadImage(uri);
        } catch(e) {

        }

        if(!image) {
            // Try it again
            try {
                image = await this.loadImage(uri);
            } catch(e) {

            }
        }

        if(image && !image.complete) {
            return new Promise((resolve, _reject) => {
                setTimeout(() => { resolve(image); }, 300);
            });
        } else {
            return image;
        }
    }

    private loadImage(uri: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = () => { resolve(image); };
            image.onerror = (error: string|Event) => { reject(Error(`Image loading failed ${JSON.stringify(error)}`)); };
            image.src = uri;
        });
    }

    // ========================================================================
    // DOM and Window Utilities
    // ========================================================================

    /**
     * Gets the owner window for a given DOM node
     * Falls back to the global window if no owner document is available
     * @param node - The DOM node to get the window from
     * @returns The window object that owns this node
     */
    public getWindow(node: Node): Window & typeof globalThis {
        const ownerDocument = node?.ownerDocument;
        return (ownerDocument?.defaultView || window);
    }

    /**
     * Checks if a dimension value is missing or invalid
     * @param value - The dimension value to check
     * @returns True if the value is NaN or less than or equal to zero
     */
    public isDimensionMissing(value: number): boolean {
        return isNaN(value) || value <= 0;
    }

    // ========================================================================
    // Type Guards - DOM Elements
    // ========================================================================

    /**
     * Type guard for Element nodes
     * @param value - The value to check
     * @returns True if the value is an Element
     */
    public isElement(value: unknown): value is Element {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).Element;
    }

    /**
     * Type guard for elements with open shadow roots
     * @param value - The value to check
     * @returns True if the value is an Element with an attached shadow root
     */
    public isElementHostForOpenShadowRoot(value: unknown): value is Element {
        return this.isElement(value) && value.shadowRoot !== null;
    }

    /**
     * Type guard for ShadowRoot nodes
     * @param value - The value to check
     * @returns True if the value is a ShadowRoot
     */
    public isShadowRoot(value: unknown): value is ShadowRoot {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).ShadowRoot;
    }

    /**
     * Checks if a node is inside a shadow DOM
     * @param value - The value to check
     * @returns True if the value is within a shadow root
     */
    public isInShadowRoot(value: unknown): boolean {
        if (value === null || value === undefined || (value as Node).getRootNode === undefined) {
            return false;
        }
        return this.isShadowRoot((value as Node).getRootNode());
    }

    // ========================================================================
    // Type Guards - HTML Elements
    // ========================================================================

    /**
     * Type guard for HTMLCanvasElement
     * @param value - The value to check
     * @returns True if the value is a canvas element
     */
    public isHTMLCanvasElement(value: unknown): value is HTMLCanvasElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLCanvasElement;
    }

    /**
     * Type guard for HTMLImageElement
     * @param value - The value to check
     * @returns True if the value is an image element
     */
    public isHTMLImageElement(value: unknown): value is HTMLImageElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLImageElement;
    }

    /**
     * Type guard for HTMLInputElement
     * @param value - The value to check
     * @returns True if the value is an input element
     */
    public isHTMLInputElement(value: unknown): value is HTMLInputElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLInputElement;
    }

    /**
     * Type guard for HTMLLinkElement
     * @param value - The value to check
     * @returns True if the value is a link element
     */
    public isHTMLLinkElement(value: unknown): value is HTMLLinkElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLLinkElement;
    }

    /**
     * Type guard for HTMLScriptElement
     * @param value - The value to check
     * @returns True if the value is a script element
     */
    public isHTMLScriptElement(value: unknown): value is HTMLScriptElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLScriptElement;
    }

    /**
     * Type guard for HTMLStyleElement
     * @param value - The value to check
     * @returns True if the value is a style element
     */
    public isHTMLStyleElement(value: unknown): value is HTMLStyleElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLStyleElement;
    }

    /**
     * Type guard for HTMLTextAreaElement
     * @param value - The value to check
     * @returns True if the value is a textarea element
     */
    public isHTMLTextAreaElement(value: unknown): value is HTMLTextAreaElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).HTMLTextAreaElement;
    }

    /**
     * Type guard for HTMLSlotElement (shadow DOM slots)
     * @param value - The value to check
     * @returns True if the value is a slot element within shadow DOM
     */
    public isShadowSlotElement(value: unknown): value is HTMLSlotElement {
        return this.isInShadowRoot(value) &&
            value instanceof this.getWindow(value as Node).HTMLSlotElement;
    }

    // ========================================================================
    // Type Guards - SVG Elements
    // ========================================================================

    /**
     * Type guard for SVGElement
     * @param value - The value to check
     * @returns True if the value is an SVG element
     */
    public isSVGElement(value: unknown): value is SVGElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).SVGElement;
    }

    /**
     * Type guard for SVGRectElement
     * @param value - The value to check
     * @returns True if the value is an SVG rect element
     */
    public isSVGRectElement(value: unknown): value is SVGRectElement {
        return this.isObject(value) && value instanceof this.getWindow(value as Node).SVGRectElement;
    }

    // ========================================================================
    // Private Helpers
    // ========================================================================

    /**
     * Type guard for checking if a value is an object
     * @param value - The value to check
     * @returns True if the value is a non-null object
     */
    private isObject(value: unknown): value is object {
        return value !== null && typeof value === 'object';
    }
}


// ============================================================================
// Images - Handles image inlining
// ============================================================================

/**
 * Handles image processing and inlining for DOM nodes
 * Replaces external image sources with placeholder images
 */
class Images {

    private readonly util: Util;

    /**
     * Creates an Images instance
     * @param util - Utility instance for type checking and DOM operations
     */
    constructor(util: Util) {
        this.util = util;
    }

    /**
     * Recursively inlines all images in a node tree
     * Replaces non-data URL image sources with placeholder images
     * to avoid loading external resources
     *
     * @param node - The root node to process
     * @returns The processed node with inlined images
     */
    public inlineAll(node: Node): Node {
        if (!this.util.isElement(node)) {
            return node;
        }

        if (this.util.isHTMLImageElement(node)) {
            if (!this.util.isDataUrl(node.src)) {
                node.src = PLACEHOLDER_IMAGE.src;
            }
        } else {
            const children = this.util.asArray(node.childNodes);
            children.forEach((child) => this.inlineAll(child));
        }

        return node;
    }
}

// ============================================================================
// Sandbox Management
// ============================================================================

/** Singleton iframe used for computing default styles */
let sandbox: HTMLIFrameElement | null = null;

/** Timeout ID for clearing the style cache */
let removeDefaultStylesTimeoutId: ReturnType<typeof setTimeout> | null = null;

/** Cache of default styles by tag hierarchy */
let tagNameDefaultStyles: DefaultStyleCache = {};

/**
 * Ensures a sandbox iframe exists and returns its window
 * The sandbox is used to compute default browser styles for elements in isolation
 * Creates a new sandbox if one doesn't exist, otherwise returns the existing one
 * @returns The window object of the sandbox iframe
 */
function ensureSandboxWindow(): Window {
    // Clear any pending cache cleanup timeout to prevent race conditions
    if (removeDefaultStylesTimeoutId) {
        clearTimeout(removeDefaultStylesTimeoutId);
        removeDefaultStylesTimeoutId = null;
    }

    if (sandbox) {
        return sandbox.contentWindow;
    }

    const charsetToUse = document.characterSet || 'UTF-8';
    const docType = document.doctype;
    const docTypeDeclaration = docType
        ? `<!DOCTYPE ${escapeHTML(docType.name)} ${escapeHTML(docType.publicId)} ${escapeHTML(docType.systemId)}`.trim() + '>'
        : '';

    sandbox = document.createElement('iframe');
    sandbox.id = `domtoimage-sandbox-${util.uid()}`;
    Object.assign(sandbox.style, OFFSCREEN_STYLES);
    document.body.appendChild(sandbox);

    return initializeSandbox(sandbox, docTypeDeclaration, charsetToUse, 'domtoimage-sandbox');
}

/**
 * Escapes HTML text to prevent XSS attacks
 * Converts special HTML characters to their safe entity equivalents
 * @param unsafeText - The text to escape (null values return empty string)
 * @returns HTML-escaped text safe for insertion into the DOM
 */
function escapeHTML(unsafeText: string | null): string {
    if (!unsafeText) {return '';}

    const div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}

/**
 * Initializes the sandbox iframe with a valid HTML document
 * Tries multiple methods for cross-browser compatibility:
 * 1. document.write (fastest)
 * 2. srcdoc attribute (more compatible)
 * 3. contentDocument manipulation (most compatible)
 * @param sandbox - The iframe element to initialize
 * @param doctype - The DOCTYPE declaration string
 * @param charset - The character set to use (e.g., 'UTF-8')
 * @param title - The document title for the sandbox
 * @returns The window object of the initialized sandbox
 */
function initializeSandbox(
    sandbox: HTMLIFrameElement,
    doctype: string,
    charset: string,
    title: string
): Window {
    const contentWindow = sandbox.contentWindow;
    const contentDocument = sandbox.contentDocument;

    if (!contentWindow) {
        throw new Error('Failed to access sandbox contentWindow');
    }

    // Try document.write first (fastest method)
    try {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        contentWindow.document.write(
            `${doctype}<html lang="en"><head><meta charset='${charset}'><title>${title}</title></head><body></body></html>`
        );
        return contentWindow;
    } catch (_) {
        // Fall through to next technique
    }

    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', charset);

    // Try srcdoc attribute (more compatible)
    try {
        const sandboxDocument = document.implementation.createHTMLDocument(title);
        sandboxDocument.head.appendChild(metaCharset);
        const sandboxHTML = doctype + sandboxDocument.documentElement.outerHTML;
        sandbox.setAttribute('srcdoc', sandboxHTML);
        return contentWindow;
    } catch (_) {
        // Fall through to simplest path
    }

    // Use contentDocument directly (most compatible)
    if (!contentDocument) {
        throw new Error('Failed to access sandbox contentDocument');
    }
    contentDocument.head.appendChild(metaCharset);
    contentDocument.title = title;
    return contentWindow;
}

/**
 * Removes the sandbox iframe from the DOM and schedules cache cleanup
 * The cache is cleared after a timeout to improve performance for
 * multiple sequential operations
 */
function removeSandbox(): void {
    if (sandbox) {
        document.body.removeChild(sandbox);
        sandbox = null;
    }

    if (removeDefaultStylesTimeoutId) {
        clearTimeout(removeDefaultStylesTimeoutId);
    }

    removeDefaultStylesTimeoutId = setTimeout(() => {
        removeDefaultStylesTimeoutId = null;
        tagNameDefaultStyles = {};
    }, CACHE_CLEAR_TIMEOUT_MS);
}

// ============================================================================
// Default Style Computation
// ============================================================================

/**
 * Computes and caches the default browser styles for an element
 * Uses the sandbox iframe to create a clean element and compute its styles
 * Results are cached by tag hierarchy to improve performance
 * @param sourceElement - The element to get default styles for (determines tag hierarchy)
 * @returns A record of CSS property names to their default values
 */
function getDefaultStyle(sourceElement: Element): Record<string, string> {
    const tagHierarchy = computeTagHierarchy(sourceElement);
    const tagKey = computeTagKey(tagHierarchy);

    if (tagNameDefaultStyles[tagKey]) {
        return tagNameDefaultStyles[tagKey];
    }

    const sandboxWindow = ensureSandboxWindow();
    const defaultElement = constructElementHierarchy(sandboxWindow.document, tagHierarchy);
    const defaultStyle = computeStyleForDefaults(sandboxWindow, defaultElement);
    destroyElementHierarchy(defaultElement);

    tagNameDefaultStyles[tagKey] = defaultStyle;
    return defaultStyle;
}

/**
 * Computes the tag hierarchy from an element up to a block-level ancestor
 * Traverses from the element up through its parents until reaching a stopping element
 * Stops at elements defined in ASCENT_STOPPERS (block-level elements)
 * @param sourceNode - The node to compute the hierarchy for
 * @returns Array of tag names from leaf to root (e.g., ['SPAN', 'DIV', 'BODY'])
 */
function computeTagHierarchy(sourceNode: Node): Array<string> {
    const tagNames: Array<string> = [];
    let node: Node | null = sourceNode;
    const MAX_ITERATIONS = 1000; // Guard against infinite loops in corrupt DOM
    let iterations = 0;

    while (node && iterations < MAX_ITERATIONS) {
        iterations++;
        if (node.nodeType === ELEMENT_NODE) {
            const tagName = (node as Element).tagName;
            tagNames.push(tagName);

            if (ASCENT_STOPPERS.has(tagName)) {
                break;
            }
        }
        node = node.parentNode;
    }

    return tagNames;
}

/**
 * Creates a cache key from a tag hierarchy
 * Joins tag names with '>' separator for efficient caching
 * @param tagHierarchy - Array of tag names from leaf to root
 * @returns A string key for caching (e.g., 'SPAN>DIV>BODY')
 */
function computeTagKey(tagHierarchy: Array<string>): string {
    return tagHierarchy.join('>');
}

/**
 * Constructs a nested element hierarchy in the sandbox document
 * Creates elements from root to leaf based on the tag hierarchy
 * Adds zero-width space content to ensure proper style computation
 * @param sandboxDocument - The sandbox document to create elements in
 * @param tagHierarchy - Array of tag names from leaf to root (will not be mutated)
 * @returns The deepest (leaf) element in the constructed hierarchy
 */
function constructElementHierarchy(sandboxDocument: Document, tagHierarchy: Array<string>): Element {
    let element: Element = sandboxDocument.body;
    const hierarchy = [...tagHierarchy]; // Don't mutate the original

    while (hierarchy.length > 0) {
        const childTagName = hierarchy.pop();
        const childElement = sandboxDocument.createElement(childTagName);
        element.appendChild(childElement);
        element = childElement;
    }

    // Ensure there's content so properties like margin are applied
    // Using zero-width space to handle Firefox adding a pixel
    element.textContent = ZERO_WIDTH_SPACE;
    return element;
}

/**
 * Computes all CSS properties and their default values for an element
 * Width and height are set to 'auto' as their default value
 * @param sandboxWindow - The sandbox window containing the element
 * @param defaultElement - The element to compute styles for
 * @returns A record of all CSS properties and their default values
 */
function computeStyleForDefaults(sandboxWindow: Window, defaultElement: Element): Record<string, string> {
    const defaultStyle: Record<string, string> = {};
    const defaultComputedStyle = sandboxWindow.getComputedStyle(defaultElement);

    Array.from(defaultComputedStyle).forEach((name) => {
        // 'width' and 'height' get default value of 'auto'
        defaultStyle[name] = (name === 'width' || name === 'height')
            ? 'auto'
            : defaultComputedStyle.getPropertyValue(name);
    });

    return defaultStyle;
}

/**
 * Removes an element and all its parents from the DOM up to the body
 * Cleans up the temporary hierarchy created in the sandbox
 * Traverses upward from leaf to root removing each element
 * @param element - The leaf element to start removing from
 */
function destroyElementHierarchy(element: Element): void {
    let current: Element | null = element;

    while (current && current.tagName !== 'BODY') {
        const parent: Element | null = current.parentElement;
        if (parent) {
            parent.removeChild(current);
        }
        current = parent;
    }
}

// ============================================================================
// Style Processing
// ============================================================================

/**
 * Sets a CSS property on a target style, with vendor prefixing if needed
 * Automatically adds -webkit- prefix for properties that require it (defined in PROPERTIES_NEEDING_PREFIX)
 * @param targetStyle - The CSS style declaration to modify
 * @param name - The CSS property name
 * @param value - The CSS property value
 * @param priority - Optional priority flag (e.g., 'important')
 */
function setStyleProperty(
    targetStyle: CSSStyleDeclaration,
    name: string,
    value: string,
    priority?: string
): void {
    const needsPrefixing = PROPERTIES_NEEDING_PREFIX.has(name);

    if (priority) {
        targetStyle.setProperty(name, value, priority);
        if (needsPrefixing) {
            targetStyle.setProperty(`-webkit-${name}`, value, priority);
        }
    } else {
        targetStyle.setProperty(name, value);
        if (needsPrefixing) {
            targetStyle.setProperty(`-webkit-${name}`, value);
        }
    }
}

/**
 * Copies computed styles from source to target element efficiently
 * Only copies styles that differ from default browser styles or parent styles
 * This optimization significantly reduces the inline CSS size
 * @param sourceElement - The original element to copy styles from
 * @param sourceComputedStyles - Pre-computed styles of the source element
 * @param parentComputedStyles - Computed styles of the parent element (null for root)
 * @param targetElement - The cloned element to apply styles to
 */
function copyUserComputedStyleFast(
    sourceElement: Element,
    sourceComputedStyles: CSSStyleDeclaration,
    parentComputedStyles: CSSStyleDeclaration | null,
    targetElement: HTMLElement
): void {
    const defaultStyle = getDefaultStyle(sourceElement);
    const targetStyle = targetElement.style;

    Array.from(sourceComputedStyles).forEach((name) => {

        const sourceValue = sourceComputedStyles.getPropertyValue(name);
        const defaultValue = defaultStyle[name];
        const parentValue = parentComputedStyles?.getPropertyValue(name);

        // Skip if clone already has a style (through adjustCloneNode)
        if (targetStyle.getPropertyValue(name)) {return;}

        // Set style if it differs from default or parent
        if (sourceValue !== defaultValue ||
            (parentComputedStyles && sourceValue !== parentValue)) {
            const priority = sourceComputedStyles.getPropertyPriority(name);
            setStyleProperty(targetStyle, name, sourceValue, priority);
        }
    });
}

// ============================================================================
// Node Cloning
// ============================================================================

/**
 * Recursively clones a DOM node with all its children and computed styles
 * Filters out script, style, and link elements, and the sandbox iframe
 * Handles shadow DOM, canvas elements, and form input states
 * @param node - The node to clone
 * @param options - Rendering options
 * @param parentComputedStyles - Computed styles of the parent element (null for root)
 * @param ownerWindow - The window that owns the node
 * @returns A promise resolving to the cloned node, or null if the node should be filtered
 */
async function cloneNode(
    node: Node,
    options: DomToImageOptions,
    parentComputedStyles: CSSStyleDeclaration | null,
    ownerWindow: Window
): Promise<Node | null> {

    if (
        node === sandbox ||
        util.isHTMLScriptElement(node) ||
        util.isHTMLStyleElement(node) ||
        util.isHTMLLinkElement(node)
    ) {
        return null;
    }

    let clone = await makeNodeCopy(node);
    if (!clone) {return null;}

    clone = await cloneChildren(clone, getParentOfChildren(node), options, ownerWindow);
    clone = await processClone(clone, node, parentComputedStyles, ownerWindow);

    return clone;
}

/**
 * Creates a shallow copy of a node
 * Converts canvas elements to images with their current content preserved
 * @param original - The node to copy
 * @returns A promise resolving to the node copy, or null if image conversion fails
 */
async function makeNodeCopy(original: Node): Promise<Node | null> {
    if (util.isHTMLCanvasElement(original)) {
        const image = await util.makeImage(original.toDataURL());
        return image ?? null;
    }
    return original.cloneNode(false);
}

/**
 * Gets the parent node that contains the children to clone
 * For elements with shadow roots, returns the shadow root to access shadow DOM children
 * Otherwise returns the node itself
 * @param original - The node to get the parent of children for
 * @returns The node or shadow root containing the children to be cloned
 */
function getParentOfChildren(original: Node): Node | ShadowRoot {
    if (util.isElementHostForOpenShadowRoot(original)) {
        return original.shadowRoot;
    }
    return original;
}

/**
 * Recursively clones all children of a node
 * Handles shadow DOM and slot elements properly
 * @param clone - The cloned parent node to append children to
 * @param original - The original parent node or shadow root containing children
 * @param options - Rendering options
 * @param ownerWindow - The window that owns the nodes
 * @returns A promise resolving to the clone with all children appended
 */
async function cloneChildren(
    clone: Node,
    original: Node | ShadowRoot,
    options: DomToImageOptions,
    ownerWindow: Window
): Promise<Node> {
    const originalChildren = getRenderedChildren(original);

    if (originalChildren.length === 0) {
        return clone;
    }

    const originalComputedStyles = ownerWindow.getComputedStyle(getRenderedParent(original) as Element);

    for (const originalChild of util.asArray(originalChildren)) {
        const clonedChild = await cloneNode(originalChild, options, originalComputedStyles, ownerWindow);
        if (clonedChild) {
            clone.appendChild(clonedChild);
        }
    }

    return clone;
}

/**
 * Gets the parent element for computing styles
 * For shadow roots, returns the host element since styles apply from the host
 * @param original - The node or shadow root
 * @returns The parent element to use for style computation
 */
function getRenderedParent(original: Node | ShadowRoot): Node | Element {
    if (util.isShadowRoot(original)) {
        return original.host;
    }
    return original;
}

/**
 * Gets the children to render for a node
 * For slot elements in shadow DOM, returns assigned nodes if available, otherwise fallback content
 * @param original - The node or shadow root
 * @returns The children to render (either slot-assigned nodes or regular child nodes)
 */
function getRenderedChildren(original: Node | ShadowRoot): NodeListOf<ChildNode> | Array<Node> {
    if (util.isShadowSlotElement(original)) {
        const assignedNodes = (original).assignedNodes();
        if (assignedNodes?.length > 0) {
            return assignedNodes;
        }
    }
    return original.childNodes;
}

/**
 * Processes a cloned node by applying styles and fixes
 * Applies styles, pseudo-elements, form values, SVG fixes, and responsive image fixes
 * @param clone - The cloned node to process
 * @param original - The original node to copy properties from
 * @param parentComputedStyles - Computed styles of the parent element (null for root)
 * @param ownerWindow - The window that owns the original node
 * @returns A promise resolving to the processed clone
 */
async function processClone(
    clone: Node,
    original: Node,
    parentComputedStyles: CSSStyleDeclaration | null,
    ownerWindow: Window
): Promise<Node> {
    if (!util.isElement(clone) || util.isShadowSlotElement(original)) {
        return clone;
    }

    cloneStyle(clone as HTMLElement, original as Element, parentComputedStyles, ownerWindow);
    clonePseudoElements(clone as HTMLElement, original as Element, ownerWindow);
    copyUserInput(clone as HTMLElement, original as HTMLElement);
    fixSvg(clone);
    fixResponsiveImages(clone as HTMLElement, original as HTMLElement);

    return clone;
}

/**
 * Clones the computed styles from source to target element
 * Uses fast cssText copy if available, otherwise copies individual properties
 * Removes absolute positioning for root elements
 * @param clone - The cloned element to apply styles to
 * @param original - The original element to copy styles from
 * @param parentComputedStyles - Computed styles of the parent element (null for root)
 * @param ownerWindow - The window that owns the original element
 */
function cloneStyle(
    clone: HTMLElement,
    original: Element,
    parentComputedStyles: CSSStyleDeclaration | null,
    ownerWindow: Window
): void {
    const sourceComputedStyles = ownerWindow.getComputedStyle(original);

    if (sourceComputedStyles.cssText) {
        clone.style.cssText = sourceComputedStyles.cssText;
        copyFont(sourceComputedStyles, clone.style);
    } else {
        copyUserComputedStyleFast(original, sourceComputedStyles, parentComputedStyles, clone);

        // Remove positioning of initial element
        if (parentComputedStyles === null) {
            ['inset-block', 'inset-block-start', 'inset-block-end'].forEach(
                (prop) => clone.style.removeProperty(prop)
            );
            ['left', 'right', 'top', 'bottom'].forEach((prop) => {
                if (clone.style.getPropertyValue(prop)) {
                    clone.style.setProperty(prop, '0px');
                }
            });
        }
    }
}

/**
 * Copies font properties from source to target style
 * Ensures all font-related properties are properly transferred
 * @param source - The source computed style to copy from
 * @param target - The target style declaration to copy to
 */
function copyFont(source: CSSStyleDeclaration, target: CSSStyleDeclaration): void {
    const fontProperties = [
        'font', 'fontFamily', 'fontFeatureSettings', 'fontKerning',
        'fontSize', 'fontStretch', 'fontStyle', 'fontVariant',
        'fontVariantCaps', 'fontVariantEastAsian', 'fontVariantLigatures',
        'fontVariantNumeric', 'fontVariationSettings', 'fontWeight'
    ] as const;

    fontProperties.forEach((prop) => {
        (target as unknown as Record<string, string>)[prop] = (source as unknown as Record<string, string>)[prop];
    });
}

/**
 * Clones pseudo-elements (::before and ::after) to the cloned element
 * Creates inline style elements to preserve pseudo-element styles
 * Assigns a unique class to the clone to scope the pseudo-element styles
 * @param clone - The cloned element to add pseudo-element styles to
 * @param original - The original element to copy pseudo-element styles from
 * @param ownerWindow - The window that owns the original element
 */
function clonePseudoElements(clone: HTMLElement, original: Element, ownerWindow: Window): void {
    const cloneClassName = util.uid();

    ([':before', ':after'] as const).forEach((element) => {
        const style = ownerWindow.getComputedStyle(original, element);
        const content = style.getPropertyValue('content');

        if (content === '' || content === 'none') {
            return;
        }

        const currentClass = clone.getAttribute('class') || '';
        clone.setAttribute('class', `${currentClass} ${cloneClassName}`);

        const styleElement = document.createElement('style');
        styleElement.appendChild(formatPseudoElementStyle(cloneClassName, element, style, content));
        clone.appendChild(styleElement);
    });
}

/**
 * Formats a pseudo-element style as a text node containing CSS
 * Creates a CSS rule string for the pseudo-element with all its styles
 * @param className - The unique class name for the clone element
 * @param element - The pseudo-element selector (':before' or ':after')
 * @param style - The computed style of the pseudo-element
 * @param content - The content property value from the pseudo-element
 * @returns A text node containing the formatted CSS rule
 */
function formatPseudoElementStyle(
    className: string,
    element: string,
    style: CSSStyleDeclaration,
    content: string
): Text {
    const selector = `.${className}:${element}`;
    const cssText = style.cssText
        ? `${style.cssText} content: ${content};`
        : formatCssProperties(style);

    return document.createTextNode(`${selector}{${cssText}}`);
}

/**
 * Formats a CSSStyleDeclaration as a CSS property list string
 * Converts all style properties to a semicolon-separated string with !important flags preserved
 * @param style - The style declaration to format
 * @returns A string containing all CSS properties formatted for inline styles
 */
function formatCssProperties(style: CSSStyleDeclaration): string {
    const properties = Array.from(style).map((name) => {
        const value = style.getPropertyValue(name);
        const priority = style.getPropertyPriority(name) ? ' !important' : '';
        return `${name}: ${value}${priority}`;
    });

    return `${properties.join('; ')};`;
}

/**
 * Copies user input values from form elements to their clones
 * Preserves the current state of textarea and input elements in the cloned DOM
 * @param clone - The cloned form element to update
 * @param original - The original form element to copy values from
 */
function copyUserInput(clone: HTMLElement, original: HTMLElement): void {
    if (util.isHTMLTextAreaElement(original)) {
        (clone as HTMLTextAreaElement).innerHTML = (original).value;
    }
    if (util.isHTMLInputElement(original)) {
        clone.setAttribute('value', (original).value);
    }
}

/**
 * Fixes SVG elements to ensure they render correctly
 * Sets the xmlns attribute and fixes rect element dimensions by copying to style
 * @param clone - The cloned SVG element to fix
 */
function fixSvg(clone: Element): void {
    if (util.isSVGElement(clone)) {
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        if (util.isSVGRectElement(clone)) {
            (['width', 'height'] as const).forEach((attribute) => {
                const value = clone.getAttribute(attribute);
                if (value) {
                    (clone).style.setProperty(attribute, value);
                }
            });
        }
    }
}

/**
 * Fixes responsive images by removing srcset/sizes and using currentSrc
 * Ensures images render with the correct source that was displayed originally
 * Also removes the loading attribute to ensure immediate rendering
 * @param clone - The cloned image element to fix
 * @param original - The original image element to copy the current source from
 */
function fixResponsiveImages(clone: HTMLElement, original: HTMLElement): void {
    if (!util.isHTMLImageElement(clone)) {return;}

    clone.removeAttribute('loading');

    const originalImg = original as HTMLImageElement;
    const cloneImg = clone;

    if (originalImg.srcset || originalImg.sizes) {
        cloneImg.removeAttribute('srcset');
        cloneImg.removeAttribute('sizes');
        cloneImg.src = originalImg.currentSrc || originalImg.src;
    }
}

// ============================================================================
// Font and Image Embedding
// ============================================================================

/**
 * Inlines all images in a node tree
 * Replaces external image sources with placeholder images to avoid loading external resources
 * @param node - The root node to process recursively
 * @returns The processed node with inlined images
 */
function inlineImages(node: Node): Node {
    images.inlineAll(node);
    return node;
}

// ============================================================================
// Canvas Creation and Drawing
// ============================================================================

/**
 * Creates a canvas element with specified dimensions
 * @param width - The canvas width in pixels
 * @param height - The canvas height in pixels
 * @returns A new HTMLCanvasElement with the specified dimensions
 */
function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

/**
 * Configures canvas context for high-quality rendering
 * @param ctx - The canvas 2D rendering context
 * @param pixelRatio - The device pixel ratio for scaling
 */
function configureCanvasContext(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
    // Disable image smoothing for sharp text rendering
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(pixelRatio, pixelRatio);
}

/**
 * Draws an HTML element onto a canvas with high-DPI support
 * First converts the element to SVG, then renders to canvas
 * @param element - The HTML element to draw
 * @param options - Rendering options including pixel ratio and quality
 * @returns A promise resolving to a canvas with the rendered element
 * @throws Error if the SVG to image conversion fails
 */
async function draw(element: HTMLElement, options: DomToImageOptions = {}): Promise<HTMLCanvasElement> {
    const svgDataUri = await toSvg(element, options);
    const image = await util.makeImage(svgDataUri);

    if (!image) {
        throw new Error('Failed to create image from SVG data URI');
    }

    const width = image.naturalWidth;
    const height = image.naturalHeight;

    const targetWidth = Math.max(width, options.maxWidth || 0);
    const targetHeight = Math.max(height, options.maxHeight || 0);

    // Create canvas with high-DPI support
    const devicePixelRatio = options.pixelRatio || DEFAULT_PIXEL_RATIO;
    const canvas = createCanvas(targetWidth * devicePixelRatio, targetHeight * devicePixelRatio);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = options.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!ctx) {
        throw new Error('Failed to get 2D canvas context');
    }

    configureCanvasContext(ctx, devicePixelRatio);

    // Calculate centered position if image is smaller than target dimensions
    const x = (targetWidth - width) / 2;
    const y = (targetHeight - height) / 2;

    // Draw the image
    ctx.drawImage(image, x, y);

    return canvas;
}

// ============================================================================
// Main Export Functions
// ============================================================================

/**
 * Calculates the scale factor to fit element within maximum dimensions
 * @param width - The element width
 * @param height - The element height
 * @param maxWidth - The maximum allowed width
 * @param maxHeight - The maximum allowed height
 * @returns The scale factor (uses the smaller of width/height scales)
 */
function calculateScaleFactor(width: number, height: number, maxWidth: number, maxHeight: number): number {
    const scaleByHeight = Number(Number.parseFloat(String(maxHeight / height)).toFixed(1));
    const scaleByWidth = Number(Number.parseFloat(String(maxWidth / width)).toFixed(1));

    // Use the smaller scale to ensure element fits within both constraints
    return Math.min(scaleByHeight, scaleByWidth);
}

/**
 * Applies rendering optimizations to a cloned element
 * @param clone - The cloned element to optimize
 * @param scale - The scale factor to apply
 */
function applyRenderingOptimizations(clone: HTMLElement, scale: number): void {
    clone.style.zoom = String(scale);
    clone.style.setProperty('-webkit-font-smoothing', 'antialiased');
    clone.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
}

/**
 * Converts a DOM element to an SVG data URI
 * Clones the element, inlines all resources, and wraps in an SVG foreignObject
 * @param element - The HTML element to convert
 * @param options - Rendering options including dimensions and scaling
 * @returns A promise resolving to an SVG data URI
 * @throws Error if the node cloning fails or dimensions cannot be determined
 */
async function toSvg(element: HTMLElement, options: DomToImageOptions = {}): Promise<string> {

    const ownerWindow = util.getWindow(element);

    const restorations: Array<Restoration> = [];

    try {
        const processedNode: Element = ensureElement(element, restorations);
        let clone = await cloneNode(processedNode, options, null, ownerWindow);

        if (!clone) {
            throw new Error('Failed to clone node');
        }

        const elementDimensions = getOriginalDimensions(element);
        if (!elementDimensions) {
            throw new Error('Unable to determine element dimensions');
        }

        (clone as HTMLElement).style.width = `${elementDimensions.innerWidth}px`;
        (clone as HTMLElement).style.height = `${elementDimensions.innerHeight}px`;

        const width = elementDimensions.width;
        const height = elementDimensions.height;

        // Use maxWidth/maxHeight from options, or default to element size
        const maxWidth = options.maxWidth || width;
        const maxHeight = options.maxHeight || height;

        const scale = calculateScaleFactor(width, height, maxWidth, maxHeight);

        applyRenderingOptimizations(clone as HTMLElement, scale);

        clone = inlineImages(clone);

        return makeSvgDataUri(clone as Element, width * scale, height * scale);
    } finally {
        restoreWrappers(restorations);
        clearCache();
    }
}

/**
 * Stores original style values for hidden parent elements
 * Used to temporarily make elements visible for measurement
 */
interface ParentStyleRestoration {
    /** The parent element being modified */
    element: HTMLElement;
    /** Original display style value */
    originalDisplay: string;
    /** Original position style value */
    originalPosition: string;
    /** Original left style value */
    originalLeft: string;
}

/**
 * Dimensions calculated from an element's style properties
 */
interface StyleDimensions {
    /** Combined left and right margin width */
    marginWidth: number;
    /** Combined top and bottom margin height */
    marginHeight: number;
    /** Combined left and right padding width */
    paddingWidth: number;
    /** Combined top and bottom padding height */
    paddingHeight: number;
    /** Combined left and right border width */
    borderWidth: number;
    /** Combined top and bottom border height */
    borderHeight: number;
}

/**
 * Parses a style property value as a float, defaulting to 0 if invalid
 * @param value - The CSS property value to parse
 * @returns The parsed float value or 0
 */
function parseStyleValue(value: string | null | undefined): number {
    return parseFloat(value || '0') || 0;
}

/**
 * Calculates the total dimensions from margin, padding, and border styles
 * @param element - The element to calculate dimensions for
 * @returns An object containing all calculated style dimensions
 */
function getStyleDimensions(element: HTMLElement): StyleDimensions {
    const style = getComputedStyle(element);

    return {
        marginWidth: parseStyleValue(style.marginLeft || element.style.marginLeft || element.style.margin) + parseStyleValue(style.marginRight || element.style.marginRight || element.style.margin),
        marginHeight: parseStyleValue(style.marginTop || element.style.marginTop || element.style.margin) + parseStyleValue(style.marginBottom || element.style.marginBottom || element.style.margin),
        paddingWidth: parseStyleValue(style.paddingLeft || element.style.paddingLeft || element.style.padding) + parseStyleValue(style.paddingRight || element.style.paddingRight || element.style.padding),
        paddingHeight: parseStyleValue(style.paddingTop || element.style.paddingTop || element.style.padding) + parseStyleValue(style.paddingBottom || element.style.paddingBottom || element.style.padding),
        borderWidth: parseStyleValue(style.borderLeftWidth || element.style.borderLeftWidth || element.style.border) + parseStyleValue(style.borderRightWidth || element.style.borderRightWidth || element.style.border),
        borderHeight: parseStyleValue(style.borderTopWidth || element.style.borderTopWidth || element.style.border) + parseStyleValue(style.borderBottomWidth || element.style.borderBottomWidth || element.style.border)
    };
}

/**
 * Element dimensions including borders, padding, and margins
 */
interface ElementDimensions {
    /** Total width including all spacing */
    width: number;
    /** Total height including all spacing */
    height: number;
    /** Inner width (excluding border, padding, margin) */
    innerWidth: number;
    /** Inner height (excluding border, padding, margin) */
    innerHeight: number;
}

/**
 * Calculates element dimensions from computed styles
 * Falls back to null if dimensions cannot be determined
 * @param element - The element to measure
 * @returns Element dimensions or null if not measurable
 */
function getDimensionsFromComputedStyle(element: HTMLElement): ElementDimensions | null {
    const style = getComputedStyle(element);
    const width = parseFloat(style.width || element.style.width);
    const height = parseFloat(style.height || element.style.height);

    if (isNaN(width) || isNaN(height)) {
        return null;
    }

    const styleDimensions = getStyleDimensions(element);

    return {
        width: width + styleDimensions.borderWidth + styleDimensions.paddingWidth + styleDimensions.marginWidth,
        height: height + styleDimensions.borderHeight + styleDimensions.paddingHeight + styleDimensions.marginHeight,
        innerWidth: width,
        innerHeight: height
    };
}

/**
 * Finds and temporarily modifies all parent elements with display: none
 * Positions them off-screen to make child elements measurable
 * @param element - The element whose parents should be checked
 * @returns Array of restoration objects to revert the changes
 */
function findAndModifyHiddenParents(element: HTMLElement): Array<ParentStyleRestoration> {
    const restorations: Array<ParentStyleRestoration> = [];
    let currentParent = element.parentElement;

    while (currentParent) {
        const computedStyle = getComputedStyle(currentParent);

        if (computedStyle.display === 'none') {
            // Save original styles
            const restoration: ParentStyleRestoration = {
                element: currentParent,
                originalDisplay: currentParent.style.display,
                originalPosition: currentParent.style.position,
                originalLeft: currentParent.style.left,
            };
            restorations.push(restoration);

            // Modify styles to make element measurable
            currentParent.style.display = '';
            currentParent.style.position = 'absolute';
            currentParent.style.left = '-10000px';
        }

        currentParent = currentParent.parentElement;
    }

    return restorations;
}

/**
 * Restores original styles to parent elements that were temporarily modified
 * @param restorations - Array of restoration objects containing original style values
 */
function restoreParentStyles(restorations: Array<ParentStyleRestoration>): void {
    for (const restoration of restorations) {
        restoration.element.style.display = restoration.originalDisplay;
        restoration.element.style.position = restoration.originalPosition;
        restoration.element.style.left = restoration.originalLeft;
    }
}

/**
 * Calculates element dimensions from offset dimensions
 * @param element - The element to measure
 * @param styleDimensions - Pre-calculated style dimensions
 * @returns Element dimensions object
 */
function calculateDimensionsFromOffset(element: HTMLElement, styleDimensions: StyleDimensions): ElementDimensions {
    return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        innerWidth: element.offsetWidth - styleDimensions.borderWidth - styleDimensions.paddingWidth - styleDimensions.marginWidth,
        innerHeight: element.offsetHeight - styleDimensions.borderHeight - styleDimensions.paddingHeight - styleDimensions.marginHeight,
    };
}

/**
 * Gets the original dimensions of an element, handling hidden elements
 * Temporarily makes hidden parent elements visible if necessary for measurement
 * @param element - The element to measure
 * @returns Element dimensions or null if dimensions cannot be determined
 */
function getOriginalDimensions(element: HTMLElement): ElementDimensions | null {
    const styleDimensions = getStyleDimensions(element);

    // If element has visible dimensions, return them immediately
    if (element.offsetWidth !== 0 && element.offsetHeight !== 0) {
        return calculateDimensionsFromOffset(element, styleDimensions);
    }

    // If element has no parent, get dimensions from computed styles
    if (element.parentElement === null) {
        return getDimensionsFromComputedStyle(element);
    }

    // If element has a parent, check if any parents have display: none
    const restorations = findAndModifyHiddenParents(element);

    try {
        // Now try to get dimensions with parents visible
        if (element.offsetWidth !== 0 && element.offsetHeight !== 0) {
            return calculateDimensionsFromOffset(element, styleDimensions);
        }

        // If still no dimensions, try computed style
        return getDimensionsFromComputedStyle(element);
    } finally {
        // Always restore original styles
        restoreParentStyles(restorations);
    }
}

/**
 * Ensures the node is an Element by wrapping text nodes if necessary
 * Text nodes are wrapped in a span element to enable measurement and cloning
 * @param node - The node to ensure is an element
 * @param restorations - Array to track DOM modifications that need restoration after processing
 * @returns An Element (either the original or a wrapper)
 */
function ensureElement(node: Node, restorations: Array<Restoration>): Element {
    if (node.nodeType === ELEMENT_NODE) {
        return node as Element;
    }

    const originalChild = node;
    const originalParent = node.parentNode;
    const wrappingSpan = document.createElement('span');

    originalParent.replaceChild(wrappingSpan, originalChild);
    wrappingSpan.append(node);

    restorations.push({
        parent: originalParent,
        child: originalChild,
        wrapper: wrappingSpan,
    });

    return wrappingSpan;
}

/**
 * Restores all temporary DOM modifications made during processing
 * Unwraps any text nodes that were wrapped in span elements
 * @param restorations - Array of DOM modifications to restore (processed in reverse order)
 */
function restoreWrappers(restorations: Array<Restoration>): void {
    while (restorations.length > 0) {
        const { parent, child, wrapper } = restorations.pop();
        parent.replaceChild(child, wrapper);
    }
}

/**
 * Clears the sandbox and style cache
 */
function clearCache(): void {
    removeSandbox();
}

/**
 * Creates an SVG data URI from a cloned element
 * Wraps the element in an SVG foreignObject for rendering
 * @param clone - The cloned element to convert to SVG
 * @param width - The width of the resulting SVG viewport
 * @param height - The height of the resulting SVG viewport
 * @returns An SVG data URI string ready for use as an image source
 */
function makeSvgDataUri(clone: Element, width: number, height: number): string {

    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const xhtml = util.escapeXhtml(getXmlSerializer().serializeToString(clone));

    const foreignObjectSizing =
        (util.isDimensionMissing(width) ? ' width="100%"' : ` width="${width}"`) +
        (util.isDimensionMissing(height) ? ' height="100%"' : ` height="${height}"`);

    const svgSizing =
        (util.isDimensionMissing(width) ? '' : ` width="${width}"`) +
        (util.isDimensionMissing(height) ? '' : ` height="${height}"`);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg"${svgSizing}><foreignObject${foreignObjectSizing}>${xhtml}</foreignObject></svg>`;

    return `data:image/svg+xml;charset=utf-8,${svg}`;
}

/**
 * Converts a DOM element to a raster image (WebP) data URL
 * First converts to SVG, then renders to canvas, then encodes as WebP
 * @param element - The HTML element to convert to an image
 * @param options - Rendering options including quality (0-1) and dimensions
 * @returns A promise resolving to a WebP image data URL
 */
async function toImage(element: HTMLElement, options?: DomToImageOptions): Promise<string> {
    const canvas = await draw(element, options);
    return canvas.toDataURL('image/webp', options?.quality || 1);
}

// ============================================================================
// Initialize Singleton Instances
// ============================================================================

/** Singleton utility instance */
const util = new Util();

/** Singleton images processor instance */
const images = new Images(util);

// ============================================================================
// Public API
// ============================================================================

/**
 * Main DomToImage API interface
 */
export interface DomToImage {
    /** Converts a DOM element to a raster image data URL */
    toImage: typeof toImage;
}

/**
 * Main export: DOM to Image conversion library
 *
 * @example
 * ```typescript
 * import { domtoimage } from './main';
 *
 * const element = document.getElementById('myElement');
 * const dataUrl = await domtoimage.toImage(element, {
 *   quality: 0.9,
 *   pixelRatio: 2,
 *   maxWidth: 1920,
 *   maxHeight: 1080
 * });
 * ```
 */
export const domtoimage: DomToImage = {
    toImage
};
