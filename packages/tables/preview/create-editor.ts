import type { PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { DOMParser as PmDOMParser, Schema } from '@type-editor/model';
import { schema as baseSchema } from '@type-editor/schema';
import { EditorView } from '@type-editor/view';

import { defaultPlugins } from './default-plugins';
import { columnResizing, fixTables, goToNextCell, tableEditing, tableNodes } from '../src';
import { keymap } from '@type-editor/keymap';
import { EditorState } from '@type-editor/state';
import { initialContent } from './initial-content';

// HTML element to add the editor to
const editorContainer: HTMLElement = document.getElementById('editor-container');

// Create new ProseMirror editor instance
function createEditor(): PmEditorView {

    const schema = new Schema({
        nodes: baseSchema.spec.nodes.append(
            tableNodes({
                tableGroup: 'block',
                cellContent: 'block+',
                cellAttributes: {
                    background: {
                        default: null,
                        getFromDOM(dom: HTMLElement) {
                            return dom.style.backgroundColor || null;
                        },
                        setDOMAttr(value, attrs) {
                            if (value) {
                                attrs.style = [
                                    `background-color: ${value as string}`,
                                    attrs.style,
                                ]
                                    .filter(Boolean)
                                    .map(String)
                                    .join('; ');
                            }
                        },
                    },
                },
            }),
        ),
        marks: baseSchema.spec.marks,
    });

    let state: PmEditorState = EditorState.create({
        doc: PmDOMParser.fromSchema(schema).parse(initialContent),
        plugins: [
            ...defaultPlugins,
            columnResizing(),
            tableEditing(),
            keymap({
                Tab: goToNextCell(1),
                'Shift-Tab': goToNextCell(-1),
            }),
        ],
    });

    const fix: PmTransaction = fixTables(state);
    if (fix) {
        state = state.apply(fix.setMeta('addToHistory', false));
    }

    document.execCommand('enableObjectResizing', false, 'false');
    document.execCommand('enableInlineTableEditing', false, 'false');

    return new EditorView(editorContainer, { state });
}

createEditor();
