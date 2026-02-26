import type { EditorState } from '@type-editor-compat/state';
import {
    blockTypeItem,
    Dropdown,
    DropdownSubmenu,
    icons,
    joinUpItem,
    liftItem,
    type MenuElement,
    MenuItem,
    type MenuItemSpec,
    redoItem,
    selectParentNodeItem,
    undoItem,
    wrapItem,
} from '@type-editor-compat/menu';
import { wrapInList } from '@type-editor-compat/schema';
import { toggleMark } from '@type-editor-compat/commands';
import type { MarkType, NodeType, Schema } from '@type-editor-compat/model';
import type { Command } from '@type-editor-compat/commands';

import { openPrompt, TextField } from './prompt';

// Helpers to create specific types of items

function canInsert(state: EditorState, nodeType: NodeType) {
    const $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        const index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) {
            return true;
        }
    }
    return false;
}

function insertImageItem(nodeType: NodeType) {
    return new MenuItem({
        title: 'Insert image',
        label: 'Image',
        enable(state) {
            return canInsert(state, nodeType);
        },
        run(state, _, view) {
            const { from, to } = state.selection;
            let attrs = null;
            if (state.selection.isNodeSelection() && state.selection.node.type === nodeType) {
                attrs = state.selection.node.attrs;
            }
            openPrompt({
                title: 'Insert image',
                fields: {
                    src: new TextField({ label: 'Location', required: true, value: attrs?.src }),
                    title: new TextField({ label: 'Title', value: attrs?.title }),
                    alt: new TextField({
                        label: 'Description',
                        value: attrs ? attrs.alt : state.doc.textBetween(from, to, ' '),
                    }),
                },
                callback(attrs) {
                    view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
                    view.focus();
                },
            });
            return true;
        },
    });
}

function cmdItem(cmd: Command, options: Partial<MenuItemSpec>) {
    const passedOptions: MenuItemSpec = {
        label: options.title as string | undefined,
        run: cmd,
    };
    for (const prop in options) {
        (passedOptions as any)[prop] = (options as any)[prop];
    }
    if (!options.enable && !options.select) {
        passedOptions[options.enable ? 'enable' : 'select'] = state => cmd(state);
    }

    return new MenuItem(passedOptions);
}

function markActive(state: EditorState, type: MarkType): boolean {
    if (state.selection.empty) {
        return !!type.isInSet(state.storedMarks || state.selection.$from.marks());
    } else {
        return state.doc.rangeHasMark(state.selection.from, state.selection.to, type);
    }
}

function markItem(markType: MarkType, options: Partial<MenuItemSpec>): MenuItem {
    const passedOptions: Partial<MenuItemSpec> = {
        active(state: EditorState): boolean {
            return markActive(state, markType);
        },
    };
    for (const prop in options) {
        (passedOptions as any)[prop] = (options as any)[prop];
    }
    return cmdItem(toggleMark(markType), passedOptions);
}

function linkItem(markType: MarkType) {
    return new MenuItem({
        title: 'Add or remove link',
        icon: icons.link,
        active(state) {
            return markActive(state, markType);
        },
        enable(state) {
            return !state.selection.empty;
        },
        run(state, dispatch, view) {
            if (markActive(state, markType)) {
                toggleMark(markType)(state, dispatch);
                return true;
            }
            openPrompt({
                title: 'Create a link',
                fields: {
                    href: new TextField({
                        label: 'Link target',
                        required: true,
                    }),
                    title: new TextField({ label: 'Title' }),
                },
                callback(attrs) {
                    toggleMark(markType, attrs)(view.state, view.dispatch);
                    view.focus();
                },
            });
        },
    });
}

function wrapListItem(nodeType: NodeType, options: Partial<MenuItemSpec>) {
    return cmdItem(wrapInList(nodeType, (options as any).attrs), options);
}

export interface MenuItemResult {
    // A menu item to toggle the [strong mark](#schema-basic.StrongMark).
    toggleStrong?: MenuItem;

    // A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
    toggleEm?: MenuItem;

    // A menu item to toggle the [code font mark](#schema-basic.CodeMark).
    toggleCode?: MenuItem;

    // A menu item to toggle the [link mark](#schema-basic.LinkMark).
    toggleLink?: MenuItem;

    // A menu item to insert an [image](#schema-basic.Image).
    insertImage?: MenuItem;

    // A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
    wrapBulletList?: MenuItem;

    // A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
    wrapOrderedList?: MenuItem;

    // A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
    wrapBlockQuote?: MenuItem;

    // A menu item to set the current textblock to be a normal
    // [paragraph](#schema-basic.Paragraph).
    makeParagraph?: MenuItem;

    // A menu item to set the current textblock to be a
    // [code block](#schema-basic.CodeBlock).
    makeCodeBlock?: MenuItem;

    // Menu items to set the current textblock to be a
    // [heading](#schema-basic.Heading) of level _N_.
    makeHead1?: MenuItem;
    makeHead2?: MenuItem;
    makeHead3?: MenuItem;
    makeHead4?: MenuItem;
    makeHead5?: MenuItem;
    makeHead6?: MenuItem;

    // A menu item to insert a horizontal rule.
    insertHorizontalRule?: MenuItem;

    // A dropdown containing the `insertImage` and
    // `insertHorizontalRule` items.
    insertMenu: Dropdown;

    // A dropdown containing the items for making the current
    // textblock a paragraph, code block, or heading.
    typeMenu: Dropdown;

    // Array of block-related menu items.
    blockMenu: Array<Array<MenuElement>>;

    // Inline-markup related menu items.
    inlineMenu: Array<Array<MenuElement>>;

    // An array of arrays of menu elements for use as the full menu
    // for, for example the [menu
    // bar](https://github.com/prosemirror/prosemirror-menu#user-content-menubar).
    fullMenu: Array<Array<MenuElement>>;
}

// Given a schema, look for default mark and node types in it and
// return an object with relevant menu items relating to those marks.
export function buildMenuItems(schema: Schema): MenuItemResult {
    const r: MenuItemResult = {} as any;
    let mark: MarkType | undefined;
    if (mark = schema.marks.strong) {
        r.toggleStrong = markItem(mark, { title: 'Toggle strong style', icon: icons.strong });
    }
    if (mark = schema.marks.em) {
        r.toggleEm = markItem(mark, { title: 'Toggle emphasis', icon: icons.em });
    }
    if (mark = schema.marks.code) {
        r.toggleCode = markItem(mark, { title: 'Toggle code font', icon: icons.code });
    }
    if (mark = schema.marks.link) {
        r.toggleLink = linkItem(mark);
    }

    let node: NodeType | undefined;
    if (node = schema.nodes.image) {
        r.insertImage = insertImageItem(node);
    }
    if (node = schema.nodes.bullet_list) {
        r.wrapBulletList = wrapListItem(node, {
            title: 'Wrap in bullet list',
            icon: icons.bulletList,
        });
    }
    // if (node = schema.nodes.ordered_list)
    node = schema.nodes.ordered_list;
    console.log('buildMenuItems ordered_list node:', node);
    {
        r.wrapOrderedList = wrapListItem(node, {
            title: 'Wrap in ordered list',
            icon: icons.orderedList,
        });
    }
    if (node = schema.nodes.blockquote) {
        r.wrapBlockQuote = wrapItem(node, {
            title: 'Wrap in block quote',
            icon: icons.blockquote,
        });
    }
    if (node = schema.nodes.paragraph) {
        r.makeParagraph = blockTypeItem(node, {
            title: 'Change to paragraph',
            label: 'Plain',
        });
    }
    if (node = schema.nodes.code_block) {
        r.makeCodeBlock = blockTypeItem(node, {
            title: 'Change to code block',
            label: 'Code',
        });
    }
    if (node = schema.nodes.heading) {
        for (let i = 1; i <= 10; i++) {
            (r as any)['makeHead' + i] = blockTypeItem(node, {
                title: 'Change to heading ' + i,
                label: 'Level ' + i,
                attrs: { level: i },
            });
        }
    }
    if (node = schema.nodes.horizontal_rule) {
        const hr = node;
        r.insertHorizontalRule = new MenuItem({
            title: 'Insert horizontal rule',
            label: 'Horizontal rule',
            enable(state) {
                return canInsert(state, hr);
            },
            run(state, dispatch) {
                dispatch(state.tr.replaceSelectionWith(hr.create()));
                return true;
            },
        });
    }

    const cut = <T>(arr: Array<T>) => arr.filter(x => x) as Array<NonNullable<T>>;
    r.insertMenu = new Dropdown(cut([r.insertImage, r.insertHorizontalRule]), { label: 'Insert' });
    r.typeMenu = new Dropdown(cut([r.makeParagraph, r.makeCodeBlock, r.makeHead1 && new DropdownSubmenu(cut([
        r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6,
    ]), { label: 'Heading' })]), { label: 'Type...' });

    r.inlineMenu = [cut([r.toggleStrong, r.toggleEm, r.toggleCode, r.toggleLink])];
    r.blockMenu = [cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, joinUpItem,
        liftItem, selectParentNodeItem])];
    r.fullMenu = r.inlineMenu.concat([[r.insertMenu, r.typeMenu]], [[undoItem, redoItem]], r.blockMenu);
    return r;
}
