/**
 * Specifies an icon. May be either an SVG icon, in which case its
 * `path` property should be an [SVG path
 * spec](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d),
 * and `width` and `height` should provide the viewbox in which that
 * path exists. Alternatively, it may have a `text` property
 * specifying a string of text that makes up the icon, with an
 * optional `css` property giving additional CSS styling for the
 * text. _Or_ it may contain `dom` property containing a DOM node.
 */
export type IconSpec =
    | { path: string, width: number, height: number; }
    | { text: string, css?: string; }
    | { dom: Node; };
