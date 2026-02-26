import { Node as ProsemirrorNode } from '@type-editor/model';
import { EditorState } from '@type-editor/state';
import {toggleHeader} from "@src/commands/toggle-header";
import {TableMap} from "@src/tablemap/TableMap";
import type {TableRect} from "@src/types/commands/TableRect";
import {CellSelection} from "@src/index";
import {builders, schema} from "@type-editor/test-builder";
import {tableEditingPlugin} from "@src/table-editing-plugin";

export const tableEditing1 = tableEditingPlugin();
export const tableWithNodeSelection = tableEditingPlugin({
  allowTableNodeSelection: true,
});

const map = new TableMap(0, 0, [], null);
const builder = builders(schema, {
    table: {nodeType: 'table'}
}) as any;
const table = new ProsemirrorNode(builder.table, {});

toggleHeader('column');
toggleHeader('row');
toggleHeader('row');
toggleHeader('row');

export const tableRect: TableRect = {
  left: 10,
  top: 20,
  right: 30,
  bottom: 40,
  tableStart: 20,
  map,
  table,
};

EditorState.create({
  doc: table,
  selection: CellSelection.create(table, 0),
});
