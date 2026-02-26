import {type Node, type Schema} from '@type-editor/model';
import {SelectionFactory} from "@src/selection/SelectionFactory";
import {EditorState} from "@src/editor-state/EditorState";
import type { Command, PmEditorState, PmSelection, PmTransaction } from '@type-editor/editor-types';
import type {Transaction} from "@src/Transaction";
import {Selection} from "@src/selection/Selection";

// Wrapper object to make writing state tests easier.

export function selFor(doc: Node) {
    let a = doc.tag.a;
    if (a != null) {
        let $a = doc.resolve(a);
        if ($a.parent.inlineContent)
            return SelectionFactory.createTextSelection($a, doc.tag.b != null ? doc.resolve(doc.tag.b) : undefined);
        else return SelectionFactory.createNodeSelection($a);
    }
    return Selection.atStart(doc);
}

export class TestState {
    state: PmEditorState;
    constructor (config: { selection?: PmSelection, doc?: Node, schema?: Schema; }) {
        if (!config.selection && config.doc) config.selection = selFor(config.doc);
        this.state = EditorState.create(config);
    }

    apply(tr: PmTransaction) {
        this.state = this.state.apply(tr);
    }

    command(cmd: Command) {
        cmd(this.state, tr => this.apply(tr as Transaction));
    }

    type(text: string) {
        this.apply(this.tr.insertText(text));
    }

    deleteSelection() {
        this.apply(this.state.transaction.deleteSelection());
    }

    textSel(anchor: number, head?: number) {
        let sel: PmSelection = SelectionFactory.createTextSelection(this.state.doc, anchor, head);
        this.state = this.state.apply(this.state.transaction.setSelection(sel as Selection));
    }

    nodeSel(pos: number) {
        let sel: PmSelection = SelectionFactory.createNodeSelection(this.state.doc, pos);
        this.state = this.state.apply(this.state.transaction.setSelection(sel as Selection));
    }

    get doc(): Node { return this.state.doc; }

    get selection(): PmSelection { return this.state.selection; }

    get tr(): PmTransaction { return this.state.transaction; }
}
