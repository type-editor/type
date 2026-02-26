import { useNodeViewContext } from '@type-editor/adapter-react';
import { useEffect } from 'react';

export function Paragraph() {
    const { dom, node } = useNodeViewContext();

    useEffect(() => {
        if (!dom) {
            return;
        }

        // Apply paragraph-specific styling directly to the <p> element.
        // Add any custom attributes or styles here.
        dom.style.backgroundImage = 'url(\'/React.svg\')';
        dom.style.backgroundRepeat = 'no-repeat';
        dom.style.backgroundPosition = 'center 0.1rem';
        dom.style.backgroundSize = '1rem 1rem';

        if (node.attrs.align) {
            dom.style.textAlign = node.attrs.align as string;
        }
    }, [dom, node]);

    // No DOM output — the <p> is created by the `as` factory in Editor.tsx.
    // With contentAs: 'self', ProseMirror manages the content directly inside it.
    return null;
}

