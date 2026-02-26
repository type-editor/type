import type {DecorationType, PmDecoration} from '@type-editor/editor-types';

import {Decoration} from './Decoration';

export class DecorationFactory {

    /**
     * Creates a decoration with the given range and type.
     *
     * This is a low-level method. In most cases, you should use
     * {@link Decoration.widget}, {@link Decoration.inline}, or {@link Decoration.node} instead.
     *
     * @param from - The start position of the decoration
     * @param to - The end position of the decoration
     * @param type - The decoration type (WidgetType, InlineType, or NodeType)
     * @returns A new decoration instance
     */
    public static createDecoration(from: number, to: number, type: DecorationType): PmDecoration {
        return new Decoration(from, to, type);
    }
}
