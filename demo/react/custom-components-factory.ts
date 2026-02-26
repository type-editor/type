import { type NodeViewFactory } from '@type-editor/adapter-react';
import type { NodeViewConstructor } from '@type-editor/editor-types';
import { PmNode } from '@type-editor/model';

import { Heading } from './Heading';
import { Paragraph } from './Paragraph';

export function getHeadingFactory(nodeViewFactory: NodeViewFactory): NodeViewConstructor {
    return nodeViewFactory({
        component: Heading,
        as: (node: PmNode): HTMLElement => {
            const level = node.attrs.level ?? 1;
            const heading: HTMLElement = document.createElement(`h${level}`);

            if (node.attrs.id) {
                heading.setAttribute('data-pmid', node.attrs.id);
            }

            if (node.attrs.align) {
                heading.style.textAlign = node.attrs.align;
            }

            return heading;
        },
        contentAs: 'self',
    });
}

export function getParagraphFactory(nodeViewFactory: NodeViewFactory): NodeViewConstructor {
    return nodeViewFactory({
        component: Paragraph,
        as: (node: PmNode): HTMLParagraphElement => {
            const paragraph: HTMLParagraphElement = document.createElement('p');

            if (node.attrs.id) {
                paragraph.setAttribute('data-pmid', node.attrs.id);
            }

            if (node.attrs.align) {
                paragraph.style.textAlign = node.attrs.align;
            }

            return paragraph;
        },
        contentAs: 'self',
    });
}

