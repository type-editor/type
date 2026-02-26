import type {ViewMutationRecord} from '@type-editor/editor-types';

import {ViewDesc} from './ViewDesc';
import {ViewDescType} from './ViewDescType';


/**
 * A composition view desc is used to handle ongoing composition input,
 * temporarily representing composed text that hasn't been committed yet.
 *
 * Composition is the process of entering complex characters (e.g., accented
 * characters, CJK characters) using an Input Method Editor (IME). During
 * composition, the browser creates temporary DOM nodes that don't yet
 * correspond to actual document content. This class protects those nodes
 * from being removed during updates until composition is complete.
 */
export class CompositionViewDesc extends ViewDesc {

    private readonly textDOM: Text;
    private readonly text: string;

    /**
     * Creates a new CompositionViewDesc.
     *
     * @param parent - The parent view description in the tree hierarchy
     * @param dom - The outer DOM node containing the composition
     * @param textDOM - The text node containing the composed (uncommitted) text
     * @param text - The current composed text content
     */
    constructor(parent: ViewDesc,
                dom: Node,
                textDOM: Text,
                text: string) {
        super(parent, [], dom, null);
        this.textDOM = textDOM;
        this.text = text;
    }

    /**
     * The size of the composition in characters.
     */
    get size(): number {
        return this.text.length;
    }

    /**
     * Converts a DOM position to a document position within the composition.
     *
     * @param dom - The DOM node containing the position
     * @param offset - The offset within the DOM node
     * @returns The document position
     */
    localPosFromDOM(dom: Node, offset: number): number {
        if (dom !== this.textDOM) {
            return this.posAtStart + (offset ? this.size : 0);
        }
        return this.posAtStart + offset;
    }

    /**
     * Converts a document position to a DOM position within the composition.
     *
     * @param pos - The document position (relative to start of composition)
     * @returns Object containing the text node and offset
     */
    domFromPos(pos: number): { node: Text; offset: number } {
        return {node: this.textDOM, offset: pos};
    }

    /**
     * Ignores character data mutations that don't actually change the text.
     * This prevents unnecessary updates during composition.
     *
     * @param mut - The mutation record to check
     * @returns True if the mutation should be ignored
     */
    ignoreMutation(mut: ViewMutationRecord): boolean {
        return mut.type === 'characterData'
            && mut.target.nodeValue === mut.oldValue;
    }

    getType(): ViewDescType {
        return ViewDescType.COMPOSITION;
    }
}
