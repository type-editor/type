import { useNodeViewFactory } from '@type-editor/adapter-react';
import { schema } from '@type-editor/schema';
import { EditorView } from '@type-editor/view';
import type { FC } from 'react';
import { useRef, useState } from 'react';

import type { NodeViewFactory } from '../../adapters/react/src';
import { defaultPlugins } from '../default-plugins';
import { initialContent } from '../initial-content';
import { getHeadingFactory, getParagraphFactory } from './custom-components-factory';

export const Editor: FC = () => {

    const editorRef = useRef<HTMLDivElement | null>(null);
    const readonlyRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [readonlyHtml, setReadonlyHtml] = useState('');
    
    const nodeViewFactory: NodeViewFactory = useNodeViewFactory();

    // Display initial content if no content has been saved yet
    const displayContent = readonlyHtml || initialContent;

    /** Create the editor instance */
    const createEditor = () => {
        const editorContainer = editorRef.current;
        if (!editorContainer || editorViewRef.current) {
            return;
        }

        editorViewRef.current = EditorView.fromHTML(

            // HTML element the ProseMirror editor is added to
            editorContainer,
            // Schema for the editor content
            schema,
            // Initial content for the editor, parsed from the readonly div
            readonlyRef.current,
            // Menu and shortcuts as Plugins
            defaultPlugins,

            // These custom components are optional and demonstrate how to use nodeViews
            // to render ProseMirror nodes with React components.
            {
                paragraph: getParagraphFactory(nodeViewFactory),
                heading: getHeadingFactory(nodeViewFactory),
            }
        );

        // Focus the editor after creation
        setTimeout(() => {
            (editorContainer.querySelector('.ProseMirror') as HTMLElement)?.focus();
        }, 0);
    };

    /** Destroy the editor instance */
    const destroyEditor = () => {
        if (editorViewRef.current) {
            editorViewRef.current.destroy();
            editorViewRef.current = null;
        }
    };

    /** Switch to edit mode */
    const switchToEditMode = () => {
        setIsEditMode(true);
        setTimeout(() => {
            createEditor();
        }, 0);
    };

    /** Switch to readonly mode */
    const switchToReadonlyMode = () => {
        if (editorViewRef.current) {
            // Save the editor content as HTML
            setReadonlyHtml(editorViewRef.current.toHtml());
        }
        destroyEditor();
        setIsEditMode(false);
        // Focus readonly content after switching
        setTimeout(() => {
            readonlyRef.current?.focus();
        }, 0);
    };

    /** Toggle between edit and readonly mode */
    const toggleEditor = (toEditMode: boolean) => {
        if (toEditMode) {
            switchToEditMode();
        } else {
            switchToReadonlyMode();
        }
    };

    return (
        <>
            {/* Edit and Save buttons */}
            <div className="edit-buttons">
                <button onClick={() => { toggleEditor(true); }} className="pm-button">Edit</button>
                <button onClick={() => { toggleEditor(false); }} className="pm-button">Save</button>
            </div>

            {/* ProseMirror editor container */}
            <div ref={editorRef} className="demo" style={{ display: isEditMode ? 'block' : 'none' }}></div>

            {/* Static readonly content container */}
            <div className="demo" style={{ display: !isEditMode ? 'block' : 'none' }}>
                {/* ProseMirror-menubar-wrapper is used here to apply the same CSS styling */}
                <div className="ProseMirror-menubar-wrapper">
                    <div
                        ref={readonlyRef}
                        className="ProseMirror"
                        tabIndex={0}
                        dangerouslySetInnerHTML={{ __html: displayContent }}
                    />
                </div>
            </div>
        </>
    );
};
