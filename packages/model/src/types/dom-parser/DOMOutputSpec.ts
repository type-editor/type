import type {DOMOutputSpecArray} from './DOMOutputSpecArray';

/**
 * A description of a DOM structure. Can be either a string, which is
 * interpreted as a text node, a DOM node, which is interpreted as
 * itself, a `{dom, contentDOM}` object, or an array.
 *
 * An array describes a DOM element. The first value in the array
 * should be a string—the name of the DOM element, optionally prefixed
 * by a namespace URL and a space. If the second element is plain
 * object, it is interpreted as a set of attributes for the element.
 * Any elements after that (including the 2nd if it's not an attribute
 * object) are interpreted as children of the DOM elements, and must
 * either be valid `DOMOutputSpec` values, or the number zero.
 *
 * The number zero (pronounced "hole") is used to indicate the place
 * where a node's child nodes should be inserted. If it occurs in an
 * output spec, it should be the only child element in its parent
 * node.
 */
export type DOMOutputSpec =
    | string
    | Node
    | { dom: Node; contentDOM?: HTMLElement }
    | DOMOutputSpecArray;
