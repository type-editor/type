import { useNodeViewContext } from '@type-editor/adapter-react';
import { useEffect } from 'react';

const headingStyles = {
    backgroundImage: 'url("/React.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
};

export function Heading() {
    const { dom, node } = useNodeViewContext();

    useEffect(() => {
        if (!dom) {
            return;
        }

        dom.style.backgroundImage = headingStyles.backgroundImage;
        dom.style.backgroundRepeat = headingStyles.backgroundRepeat;
        dom.style.backgroundPosition = headingStyles.backgroundPosition;
        dom.style.backgroundSize = '1rem 1rem';

        if (node.attrs.align) {
            dom.style.textAlign = node.attrs.align as string;
        }
    }, [dom, node]);

    // No DOM output — the <h1>–<h6> element is created by the `as` factory in Editor.tsx.
    return null;
}


