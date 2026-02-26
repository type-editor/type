import {
    alignItem,
    blockquoteItem,
    bulletListItem,
    codeBlockItem,
    codeItem,
    headingItem,
    horizontalRuleItem,
    imageItem,
    italicItem,
    linkItem,
    MenuBarBuilder,
    MenuItem,
    orderedListItem,
    paragraphItem,
    redoItem,
    strikethroughItem,
    strongItem,
    subscriptItem,
    superscriptItem,
    undoItem,
} from '@type-editor/menu';
import { Plugin as PmPlugin } from '@type-editor/state';


export function createMenu(): PmPlugin {

    /**
     * Build menu, optional parameters:
     * - isLegacy: boolean - default to false. Set to true for backward compatibility
     * - floatingMenu: boolean - default to false. Use true to create a floating menu bar (I have not tested it yet)
     */
    const menuBarBuilder = new MenuBarBuilder()
        .addDropDown(
            { title: 'Format', label: 'Format', showLabel: true },
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
            })
        );

    return menuBarBuilder.build();
}
