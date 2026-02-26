import {DOCUMENT_NODE} from '@type-editor/commons';

import type {DomIcon, Icon, SvgIcon, TextIcon} from '../../types/Icon';

/** SVG namespace URI for creating SVG elements */
const SVG = 'http://www.w3.org/2000/svg';

/** XLink namespace URI for SVG references */
const XLINK = 'http://www.w3.org/1999/xlink';

/** CSS class prefix for icon elements */
const ICON_PREFIX = 'ProseMirror-icon';

/** Collection ID for SVG symbol definitions */
const COLLECTION_ID = `${ICON_PREFIX}-collection`;

/** Icon name prefix */
const ICON_NAME_PREFIX = 'pm-icon-';

/** Cache for hash values to avoid recomputing hashes for the same paths */
const hashCache = new Map<string, number>();

/** Precompiled regex for extracting base URL (performance optimization) */
const URL_HASH_REGEX = /([^#]*)/;


/**
 * Creates an HTML element representation of an icon.
 * Supports three icon types: SVG-based, DOM-based, and text-based.
 *
 * @param root - The root element (Document or ShadowRoot) where the icon will be created
 * @param icon - The icon configuration object
 * @param title - The title attribute for accessibility
 * @param showLabel - Whether to show the label (title) alongside the icon (e.g. in DropdownMenu)
 * @param isLegacy - Backward compatibility mode
 * @returns An HTMLElement containing the rendered icon
 */
export function getIcon(root: Document | ShadowRoot,
                        icon: Icon,
                        title: string,
                        showLabel = false,
                        isLegacy = false): HTMLElement {
    const doc: Document = getDocument(root);
    const node: HTMLDivElement | HTMLButtonElement = doc.createElement(isLegacy ? 'div' : 'button');
    node.className = ICON_PREFIX;
    node.tabIndex = -1;
    node.addEventListener('focus', (): void => {
        node.tabIndex = 0;
    });
    node.addEventListener('blur', (): void => {
        node.tabIndex = -1;
    });

    const wcagLabel: HTMLSpanElement = title && !isLegacy ? createWcagLabel(doc, title, showLabel) : undefined;

    if (isSvgIcon(icon)) {
        createSvgIcon(root, doc, node, icon, wcagLabel);
    } else if (isDomIcon(icon)) {
        createDomIcon(node, icon, wcagLabel);
    } else if (isTextIcon(icon)) {
        createTextIcon(doc, node, icon);
    }

    return node;
}

/**
 * Extracts the document from a Document or ShadowRoot.
 *
 * @param root - The root element (Document or ShadowRoot)
 * @returns The document object
 */
function getDocument(root: Document | ShadowRoot): Document {
    return root.nodeType === DOCUMENT_NODE
        ? root as Document
        : root.ownerDocument || document;
}

/**
 * Type guard to check if an icon is an SVG icon.
 * Checks for the 'path' property which is unique to SVG icons.
 *
 * @param icon - The icon to check
 * @returns True if the icon has a path property (SVG icon)
 */
function isSvgIcon(icon: Icon): icon is SvgIcon {
    return 'path' in icon && typeof icon.path === 'string';
}

/**
 * Type guard to check if an icon is a DOM-based icon.
 * Checks for the 'dom' property which is unique to DOM icons.
 *
 * @param icon - The icon to check
 * @returns True if the icon has a dom property
 */
function isDomIcon(icon: Icon): icon is DomIcon {
    return 'dom' in icon && !('path' in icon) && !('text' in icon);
}

/**
 * Type guard to check if an icon is a text-based icon.
 * Checks for the 'text' property which is unique to text icons.
 *
 * @param icon - The icon to check
 * @returns True if the icon has a text property
 */
function isTextIcon(icon: Icon): icon is TextIcon {
    return 'text' in icon && !('path' in icon) && !('dom' in icon);
}

/**
 * Creates an SVG icon element with proper sizing and reference.
 *
 * @param root - The root element (Document or ShadowRoot)
 * @param doc - The document object
 * @param node - The container div element
 * @param icon - The SVG icon configuration
 * @param wcagLabel - Optional hidden WCAG label span element for accessibility
 */
function createSvgIcon(root: Document | ShadowRoot,
                       doc: Document,
                       node: HTMLDivElement | HTMLButtonElement,
                       icon: SvgIcon,
                       wcagLabel?: HTMLSpanElement): void {
    const {path, width, height} = icon;
    const iconName = `${ICON_NAME_PREFIX}${hashPath(path).toString(16)}`;

    // Ensure the SVG symbol is defined in the document
    if (!doc.getElementById(iconName)) {
        buildSVG(root, iconName, icon);
    }

    // Create SVG element with proper aspect ratio
    const svgElement: SVGSVGElement = doc.createElementNS(SVG, 'svg');
    const numWidth = Number(width);
    const numHeight = Number(height);

    // Guard against division by zero and invalid dimensions
    if (numHeight > 0 && numWidth > 0 && isFinite(numWidth) && isFinite(numHeight)) {
        // Backward compatibility: should better set in css file
        if(!wcagLabel) {
            const aspectRatio: number = numWidth / numHeight;
            svgElement.style.width = `${aspectRatio}em`;
        }
    }
    // Backward compatibility: should better set in css file
    else if (!wcagLabel) {
        // Fallback to 1em if dimensions are invalid
        svgElement.style.width = '1em';
    }

    node.appendChild(svgElement);

    svgElement.ariaHidden = 'true';
    if(wcagLabel) {
        node.appendChild(wcagLabel);
    }


    // Create use element that references the symbol
    const svgUseElement: SVGUseElement = doc.createElementNS(SVG, 'use');
    const href = `${getBaseUrl(doc)}#${iconName}`;
    svgUseElement.setAttributeNS(XLINK, 'href', href);
    svgElement.appendChild(svgUseElement);
}

/**
 * Creates a DOM-based icon by cloning the provided node.
 *
 * @param node - The container div element
 * @param icon - The DOM icon configuration
 * @param wcagLabel - Optional hidden WCAG label span element for accessibility
 */
function createDomIcon(node: HTMLDivElement | HTMLButtonElement,
                       icon: DomIcon,
                       wcagLabel?: HTMLSpanElement): void {
    const iconNode = icon.dom.cloneNode(true);
    (iconNode as HTMLElement).ariaHidden = 'true';
    node.appendChild(iconNode);
    if(wcagLabel) {
        node.appendChild(wcagLabel);
    }
}

/**
 * Creates a text-based icon with optional CSS styling.
 *
 * @param doc - The document object
 * @param node - The container div element
 * @param icon - The text icon configuration
 */
function createTextIcon(doc: Document,
                        node: HTMLDivElement | HTMLButtonElement,
                        icon: TextIcon): void {
    const span: HTMLSpanElement = doc.createElement('span');
    span.textContent = icon.text || '';

    if (icon.css) {
        span.style.cssText = icon.css;
    }

    node.appendChild(span);
}


/**
 * Builds and registers an SVG symbol definition in the document.
 * This allows the icon to be referenced multiple times without duplicating the path data.
 *
 * @param root - The root element (Document or ShadowRoot) where the symbol will be stored
 * @param iconName - The unique identifier for the icon symbol
 * @param iconData - The SVG icon configuration containing path and dimensions
 */
function buildSVG(root: Document | ShadowRoot, iconName: string, iconData: SvgIcon): void {
    const [doc, container] = getDocumentAndContainer(root);
    const collection: SVGSVGElement = getOrCreateSymbolCollection(doc, container);
    const symbol: SVGSymbolElement = createSymbolElement(doc, iconName, iconData);

    collection.appendChild(symbol);
}

/**
 * Retrieves the document and container element for SVG symbol storage.
 *
 * @param root - The root element (Document or ShadowRoot)
 * @returns A tuple containing the document and the container element
 * @throws Error if document body is not available
 */
function getDocumentAndContainer(root: Document | ShadowRoot): [Document, Node] {
    if (root.nodeType === DOCUMENT_NODE) {
        const doc = root as Document;
        // Ensure document body exists (critical for DOM operations)
        if (!doc.body) {
            throw new Error('Document body is not available. Ensure icons are created after DOM is ready.');
        }
        return [doc, doc.body];
    } else {
        const doc: Document = root.ownerDocument || document;
        return [doc, root];
    }
}

/**
 * Retrieves or creates the SVG symbol collection element.
 * This collection stores all icon symbols as reusable SVG definitions.
 *
 * @param doc - The document object
 * @param container - The container element where the collection will be stored
 * @returns The SVG collection element
 */
function getOrCreateSymbolCollection(doc: Document, container: Node): SVGSVGElement {
    const existingCollection: HTMLElement = doc.getElementById(COLLECTION_ID);

    if (existingCollection) {
        return existingCollection as unknown as SVGSVGElement;
    }

    const collection: SVGSVGElement = doc.createElementNS(SVG, 'svg');
    collection.id = COLLECTION_ID;
    collection.style.display = 'none';
    container.insertBefore(collection, container.firstChild);

    return collection;
}

/**
 * Creates an SVG symbol element with the icon path data.
 *
 * @param doc - The document object
 * @param iconName - The unique identifier for the icon symbol
 * @param iconData - The SVG icon configuration
 * @returns The created SVG symbol element
 */
function createSymbolElement(doc: Document,
                             iconName: string,
                             iconData: SvgIcon): SVGSymbolElement {
    const symbol: SVGSymbolElement = doc.createElementNS(SVG, 'symbol');
    symbol.id = iconName;
    symbol.setAttribute('viewBox', `0 0 ${iconData.width} ${iconData.height}`);

    const path: SVGPathElement = doc.createElementNS(SVG, 'path');
    path.setAttribute('d', iconData.path);
    symbol.appendChild(path);

    return symbol;
}

/**
 * Extracts the base URL from the document location, removing any hash fragment.
 * Uses a precompiled regex for better performance.
 *
 * @param doc - The document object
 * @returns The base URL without hash fragment
 */
function getBaseUrl(doc: Document): string {
    const match = URL_HASH_REGEX.exec(doc.location.toString());
    return match ? match[1] : '';
}


/**
 * Generates a hash code from a string path for creating unique icon identifiers.
 * Uses a simple hash algorithm (djb2 variant) for consistent hash generation.
 * Implements caching to avoid recomputing hashes for the same paths.
 *
 * @param path - The SVG path string to hash
 * @returns A 32-bit integer hash code
 */
function hashPath(path: string): number {
    // Check cache first
    const cached = hashCache.get(path);
    if (cached !== undefined) {
        return cached;
    }

    let hash = 0;
    for (let i = 0; i < path.length; i++) {
        // (hash << 5) - hash is equivalent to hash * 31
        hash = (((hash << 5) - hash) + path.charCodeAt(i)) | 0;
    }

    // Store in cache
    hashCache.set(path, hash);

    return hash;
}

function createWcagLabel(doc: Document, label: string, showLabel = false): HTMLSpanElement {
    const span: HTMLSpanElement = doc.createElement('span');
    span.className = showLabel ? 'label' : 'wcag-label';
    span.textContent = label;
    return span;
}
