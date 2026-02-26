/**
 * Represents an SVG-based icon with path data and dimensions.
 */
export interface SvgIcon {
    /** SVG path data string */
    path: string;
    /** Icon width in pixels */
    width: number | string;
    /** Icon height in pixels */
    height: number | string;
    /** Optional stroke color */
    stroke?: string;
    /** Optional stroke width */
    strokeWidth?: string;
    /** Optional stroke line cap style */
    strokeLinecap?: string;
    /** Optional stroke line join style */
    strokeLinejoin?: string;
    /** Optional custom viewBox attribute */
    viewBox?: string;
    /** Optional fill color */
    fill?: string;
}

/**
 * Represents a DOM node-based icon.
 */
export interface DomIcon {
    /** DOM node to be cloned and used as the icon */
    dom: Node;
}

/**
 * Represents a text-based icon with optional CSS styling.
 */
export interface TextIcon {
    /** Text content for the icon */
    text: string;
    /** Optional inline CSS styles */
    css?: string;
}

/**
 * Union type representing all possible icon types.
 * An icon can be SVG-based, DOM-based, or text-based.
 */
export type Icon = SvgIcon | DomIcon | TextIcon;
