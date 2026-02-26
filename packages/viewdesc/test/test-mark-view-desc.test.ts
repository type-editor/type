import {describe, it, expect, beforeEach} from 'vitest';
import {MarkViewDesc} from '@src/view-desc/MarkViewDesc';
import {NodeViewDesc} from '@src/view-desc/NodeViewDesc';
import {ViewDescType} from '@src/view-desc/ViewDescType';
import {ViewDirtyState} from '@src/view-desc/ViewDirtyState';
import {schema, setupJSDOMMocks, strong, em, p} from '@type-editor/test-builder';
import type {Mark} from '@type-editor/model';
import {ViewDesc} from '@src/view-desc/ViewDesc';

setupJSDOMMocks();

describe('MarkViewDesc', () => {
    let markDom: HTMLElement;
    let contentDom: HTMLElement;
    let strongMark: Mark;
    let parentViewDesc: ViewDesc;
    let markViewDesc: MarkViewDesc;

    beforeEach(() => {
        markDom = document.createElement('strong');
        contentDom = markDom;
        strongMark = schema.mark('strong');

        const parentDom = document.createElement('div');
        parentViewDesc = new ViewDesc(undefined, [], parentDom, parentDom);

        markViewDesc = new MarkViewDesc(
            parentViewDesc,
            strongMark,
            markDom,
            contentDom,
            {dom: markDom, contentDOM: contentDom}
        );
    });

    describe('constructor', () => {
        it('should create MarkViewDesc with correct properties', () => {
            expect(markViewDesc.dom).toBe(markDom);
            expect(markViewDesc.contentDOM).toBe(contentDom);
            expect(markViewDesc.parent).toBe(parentViewDesc);
        });
    });

    describe('create', () => {
        it('should create a MarkViewDesc from mark', () => {
            const mockView = {
                nodeViews: {}
            } as any;

            const desc = MarkViewDesc.create(parentViewDesc, strongMark, true, mockView);

            expect(desc).toBeInstanceOf(MarkViewDesc);
            expect(desc.getType()).toBe(ViewDescType.MARK);
        });

        it('should use custom mark view if available', () => {
            const customDom = document.createElement('b');
            const customView = () => ({
                dom: customDom,
                contentDOM: customDom
            });

            const mockView = {
                nodeViews: {
                    'strong': customView
                }
            } as any;

            const desc = MarkViewDesc.create(parentViewDesc, strongMark, true, mockView);
            expect(desc.dom).toBe(customDom);
        });
    });

    describe('getType', () => {
        it('should return MARK type', () => {
            expect(markViewDesc.getType()).toBe(ViewDescType.MARK);
        });
    });

    describe('parseRule', () => {
        it('should return parse rule with mark info', () => {
            const rule = markViewDesc.parseRule();
            expect(rule).toBeDefined();
            expect(rule.mark).toBe('strong');
            expect(rule.contentElement).toBe(contentDom);
        });

        it('should return null when NODE_DIRTY', () => {
            markViewDesc.dirty = ViewDirtyState.NODE_DIRTY;
            const rule = markViewDesc.parseRule();
            expect(rule).toBeNull();
        });
    });

    describe('matchesMark', () => {
        it('should return true for same mark when not dirty', () => {
            expect(markViewDesc.matchesMark(strongMark)).toBe(true);
        });

        it('should return false when NODE_DIRTY', () => {
            markViewDesc.dirty = ViewDirtyState.NODE_DIRTY;
            expect(markViewDesc.matchesMark(strongMark)).toBe(false);
        });

        it('should return false for different mark', () => {
            const emMark = schema.mark('em');
            expect(markViewDesc.matchesMark(emMark)).toBe(false);
        });

        it('should return false for mark with different attrs', () => {
            const linkMark1 = schema.mark('link', {href: 'http://example.com'});
            const linkMark2 = schema.mark('link', {href: 'http://different.com'});

            const linkDom = document.createElement('a');
            const linkDesc = new MarkViewDesc(
                parentViewDesc,
                linkMark1,
                linkDom,
                linkDom,
                {dom: linkDom, contentDOM: linkDom}
            );

            expect(linkDesc.matchesMark(linkMark2)).toBe(false);
        });
    });

    describe('markDirty', () => {
        it('should mark as dirty within range', () => {
            // Setup proper parent node view with NodeViewDesc which has proper node property
            const pmNode = p('test');
            const nodeParentDom = document.createElement('div');
            const nodeParent = new NodeViewDesc(undefined, pmNode, [], null, nodeParentDom, nodeParentDom, nodeParentDom);
            markViewDesc.parent = nodeParent;

            markViewDesc.markDirty(0, 10);
            // After markDirty, the dirty state is moved to parent, so markViewDesc should be NOT_DIRTY
            expect(nodeParent.dirty).not.toBe(ViewDirtyState.NOT_DIRTY);
        });
    });

    describe('stopEvent', () => {
        it('should return false by default', () => {
            const event = new Event('click');
            expect(markViewDesc.stopEvent(event)).toBe(false);
        });
    });

    describe('ignoreMutation', () => {
        it('should handle mutations', () => {
            const mutation = {
                type: 'childList',
                target: markDom
            } as any;
            const result = markViewDesc.ignoreMutation(mutation);
            expect(typeof result).toBe('boolean');
        });
    });

    describe('size and border', () => {
        it('should return 0 for size', () => {
            expect(markViewDesc.size).toBe(0);
        });

        it('should return 0 for border', () => {
            expect(markViewDesc.border).toBe(0);
        });
    });
});

