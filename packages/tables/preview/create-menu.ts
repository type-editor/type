import {
    MenuBarBuilder,
    paragraphItem,
    headingItem,
    blockquoteItem,
    codeBlockItem,
    strongItem,
    italicItem,
    linkItem,
    strikethroughItem,
    codeItem,
    bulletListItem,
    orderedListItem,
    alignItem,
    horizontalRuleItem,
    subscriptItem,
    superscriptItem,
    undoItem,
    redoItem,
    imageItem,
    MenuItem,
} from '@type-editor/menu';
import { Plugin as PmPlugin } from '@type-editor/state';
import {
    addColumnAfter,
    addColumnBefore, addRowAfter,
    addRowBefore,
    deleteColumn, deleteRow, deleteTable, mergeCells, setCellAttr, splitCell, toggleHeaderCell,
    toggleHeaderColumn,
    toggleHeaderRow,
} from '../src';


export function createMenu(): PmPlugin {

    /**
     * Build menu, optional parameters:
     * - isLegacy: boolean - default to false. Set to true for backward compatibility
     * - floatingMenu: boolean - default to false. Use true to create a floating menu bar (I have not tested it yet)
     */
    const menuBarBuilder = new MenuBarBuilder()

        .addDropDown(
            { title: 'Format', label: 'Format' },
            paragraphItem(),
            headingItem('1'),
            headingItem('2'),
            headingItem('3'),
            headingItem('4'),
            headingItem('5'),
            headingItem('6'),
            blockquoteItem(),
            codeBlockItem(),
        )
        .addMenuGroup(
            strongItem(),
            italicItem(),
            strikethroughItem(),
            codeItem(),
        )
        .addMenuGroup(
            bulletListItem(),
            orderedListItem(),
        )
        .addMenuGroup(
            alignItem('left'),
            alignItem('center'),
            alignItem('right'),
            alignItem('justify'),
        )
        .addMenuGroup(
            horizontalRuleItem(),
            subscriptItem(),
            superscriptItem(),
            imageItem(),
            linkItem(),
        )
        .addMenuGroup(
            // Note: undo and redo require the history plugin to work
            undoItem,
            redoItem,
        )

        .addStaticDropDown(
            { title: 'Table', label: 'Table' },
            MenuBarBuilder.createMenuItem({ label: 'Insert column before', run: addColumnBefore }),
            MenuBarBuilder.createMenuItem({ label: 'Insert column after', run: addColumnAfter }),
            MenuBarBuilder.createMenuItem({ label: 'Delete column', run: deleteColumn }),
            MenuBarBuilder.createMenuItem({ label: 'Insert row before', run: addRowBefore }),
            MenuBarBuilder.createMenuItem({ label: 'Insert row after', run: addRowAfter }),
            MenuBarBuilder.createMenuItem({ label: 'Delete row', run: deleteRow }),
            MenuBarBuilder.createMenuItem({ label: 'Delete table', run: deleteTable }),
            MenuBarBuilder.createMenuItem({ label: 'Merge cells', run: mergeCells }),
            MenuBarBuilder.createMenuItem({ label: 'Split cell', run: splitCell }),
            MenuBarBuilder.createMenuItem({ label: 'Toggle header column', run: toggleHeaderColumn }),
            MenuBarBuilder.createMenuItem({ label: 'Toggle header row', run: toggleHeaderRow }),
            MenuBarBuilder.createMenuItem({ label: 'Toggle header cells', run: toggleHeaderCell }),
            MenuBarBuilder.createMenuItem({ label: 'Make cell green', run: setCellAttr('background', '#dfd') }),
            MenuBarBuilder.createMenuItem({ label: 'Make cell not-green', run: setCellAttr('background', null) }),
        )

        .addMenuGroup(
            // Custom Fullscreen Menu Item for demo purposes
            new MenuItem({
                title: 'Fullscreen',
                label: 'Fullscreen',
                run: () => {
                    if(document.body.classList.contains('fullscreen')) {
                        document.body.classList.remove('fullscreen');
                    } else {
                        document.body.classList.add('fullscreen');
                    }
                    return true;
                },
                icon: {
                    width: 24, height: 24,
                    path: 'M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm-1 2H4v14h16zm-7 12v-2h3v-3h2v5zM11 7v2H8v3H6V7z'
                }
            }),
        );

    return menuBarBuilder.build();
}
