import {browser, ELEMENT_NODE} from '@type-editor/commons';
import type {PmEditorView, PmMouseDown, PmSelection} from '@type-editor/editor-types';
import type {Slice} from '@type-editor/model';
import {SelectionFactory} from '@type-editor/state';
import type {NodeViewDesc} from '@type-editor/viewdesc';
import {ViewDescUtil} from '@type-editor/viewdesc';

import {serializeForClipboard} from '../../clipboard/serialize-for-clipboard';
import {brokenClipboardAPI} from '../util/broken-clipboard-api';
import {Dragging} from './Dragging';
import {dragMoves} from './util/drag-moves';

const EMPTY_IMAGE = new Image(30, 31);
EMPTY_IMAGE.src = 'data:image/jpeg;base64,/9j/4QDKRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAADygAwAEAAAAAQAAADCkBgADAAAAAQAAAAAAAAAAAAD/2wCEAAEBAQEBAQIBAQIDAgICAwQDAwMDBAUEBAQEBAUGBQUFBQUFBgYGBgYGBgYHBwcHBwcICAgICAkJCQkJCQkJCQkBAQEBAgICBAICBAkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCf/dAAQABP/AABEIADAAPAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP6y9A8OLr8lzulMXkkdBnrn6elbX/CEab/0EV/8c/8AiqseA1JTUvoP/Zq8xih81lijXLNhQPc8CgD0b/hCNO/6CK/+Of8AxVL/AMIRpv8A0Ek/8d/+KrQg+Glv9lxc3BE2OdqjaD6Y6n9K801LTZNLvpNPuQN8RxkdCOxH4UAd1/whGnf9BFf/ABz/AOKo/wCEI03/AKCK/wDjn/xVecbE9BRsT0FAHpcfgK0lz5N9v2/3Qp/ka4qxB8tsf3v6Cuz+HC/6RehR/wAs1/ma5HT/APVN/vf0FAH/0P68fAXTU/oP/Zq8yt5nt5Y7iP70ZDD8Oa9N8BdNT+g/9mry0dBQB7pB4+0CS18+d2jfHMe0k59scGvIdb1M6xqkuoldgcjavooGBWVVyy0++1F/LsIXlP8Asjj8+lAGnomg3GtQXckHW3j3KPVv7v5A1z9e/wDhDRptF0nyrpQs0jF3A5x2A/AV5N4u04aZr00SDCSfvE9MN2/A0AdL8Nv+Pi9/65p/M1x2n/6pv97+grsfht/x8Xv/AFzT+ZrjtP8A9U3+9/QUAf/R/rt8BsQmpfQf+zV5eGXA5FddoHiJdAkud0Jl80jocYxn2962h4305SCNOUY/3P8A4mgC54T8HrtXUtYjzn7kTfzYfyFenx7YkEcahVHQAYH5CvMP+Fjp/wA+h/77H+FH/Cx0/wCfQ/8AfY/woA9S3mvP/Hujz6hax6hapue3yGA67D/hWb/wsdP+fQ/99j/Cj/hY6f8APof++x/hQBV+HDYuL3b/AM81/ma5HT/9U3+9/QV2CePbSLPlWOzd12lR/Ja4qxJ8tsf3v6CgD//Z';
/**
 * Handles dragstart events. Determines what content is being dragged
 * (selected content or a draggable node), serializes it, and sets up
 * the drag data transfer.
 */
export function dragStartHandler(view: PmEditorView, event: DragEvent): boolean {
    const CHROME_FILE_CLEAR_MIN_VERSION = 120;

    const mouseDown: PmMouseDown = view.input.mouseDown;
    if (mouseDown) {
        mouseDown.done();
    }

    if (!event.dataTransfer) {
        return false;
    }

    const selection: PmSelection = view.state.selection;
    const pos: { pos: number; inside: number } = selection.empty
        ? null
        : view.posAtCoords({left: event.clientX, top: event.clientY});
    let node: undefined | PmSelection;

    // Determine what content is being dragged
    const isDragFromSelection = pos
        && pos.pos >= selection.from
        && pos.pos <= (selection.isNodeSelection() ? selection.to - 1 : selection.to);

    if (isDragFromSelection) {
        // Dragging from within the current selection - use that selection
    } else if (mouseDown?.mightDrag) {
        // Dragging a node that was detected during mousedown
        node = SelectionFactory.createNodeSelection(view.state.doc, mouseDown.mightDrag.pos);
    } else if (event.target && (event.target as HTMLElement).nodeType === ELEMENT_NODE) {
        // Check if the drag target is a draggable node descriptor
        const desc: NodeViewDesc = ViewDescUtil.nearestNodeViewDesc(view.docView, event.target as HTMLElement);

        if (desc && desc.node.type.spec.draggable && desc !== view.docView) {
            node = SelectionFactory.createNodeSelection(view.state.doc, desc.posBefore);
        }
    }

    const draggedSlice: Slice = (node || view.state.selection).content();
    const { dom, text, slice } = serializeForClipboard(view, draggedSlice);

    // Chrome versions before 120 have a bug where calling clearData() removes files
    // from the dataTransfer, which breaks file dragging (#1472)
    const shouldClearData = !event.dataTransfer.files.length
        || !browser.chrome
        || browser.chrome_version > CHROME_FILE_CLEAR_MIN_VERSION;

    if (shouldClearData) {
        event.dataTransfer.clearData();
    }

    event.dataTransfer.setData(brokenClipboardAPI ? 'Text' : 'text/html', dom.innerHTML);

    // Allow both copy and move operations - the actual operation will be determined
    // by modifier keys when the drop occurs
    event.dataTransfer.effectAllowed = 'copyMove';

    event.dataTransfer.setDragImage(EMPTY_IMAGE, 0, 0);

    if (!brokenClipboardAPI) {
        event.dataTransfer.setData('text/plain', text);
    }
    view.dragging = new Dragging(slice, dragMoves(view, event), node);
    return false;
}
