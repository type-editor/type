import {type Node, type Schema} from '@type-editor/model';
import {SelectionFactory} from "@type-editor/state";
import {EditorState} from "@type-editor/state";
import type {PmSelection} from "@type-editor/editor-types";
import type {Transaction} from "@type-editor/state";
import type {Command} from "@type-editor/state";
import {Selection} from "@type-editor/state";

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
    state: EditorState;
    constructor (config: { selection?: PmSelection, doc?: Node, schema?: Schema; }) {
        if (!config.selection && config.doc) config.selection = selFor(config.doc);
        this.state = EditorState.create(config);
    }

    apply(tr: Transaction) {
        this.state = this.state.apply(tr);
    }

    command(cmd: Command) {
        cmd(this.state, tr => this.apply(tr));
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

    get tr(): Transaction { return this.state.transaction; }
}
