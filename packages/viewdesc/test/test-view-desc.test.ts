import {describe, it, expect, beforeEach} from 'vitest';
import {ViewDesc} from '@src/view-desc/ViewDesc';
import {ViewDirtyState} from '@src/view-desc/ViewDirtyState';
import {ViewDescType} from '@src/view-desc/ViewDescType';
import {doc, p, schema, setupJSDOMMocks} from '@type-editor/test-builder';

setupJSDOMMocks();

describe('ViewDesc', () => {
    let testDoc: HTMLDivElement;
    let textNode: Text;
    let parentViewDesc: ViewDesc;
    let childViewDesc: ViewDesc;

    beforeEach(() => {
        testDoc = document.createElement('div');
        textNode = document.createTextNode('test');
        testDoc.appendChild(textNode);

        const childDom = document.createElement('span');
        childViewDesc = new ViewDesc(undefined, [], childDom, childDom);
        parentViewDesc = new ViewDesc(undefined, [childViewDesc], testDoc, testDoc);
    });

    describe('constructor', () => {
        it('should create a ViewDesc with correct properties', () => {
            expect(parentViewDesc.dom).toBe(testDoc);
            expect(parentViewDesc.contentDOM).toBe(testDoc);
            expect(parentViewDesc.children.length).toBe(1);
            expect(parentViewDesc.parent).toBeUndefined();
        });

        it('should set pmViewDesc on DOM node', () => {
            expect((testDoc as any).pmViewDesc).toBe(parentViewDesc);
        });

        it('should initialize with NOT_DIRTY state', () => {
            expect(parentViewDesc.dirty).toBe(ViewDirtyState.NOT_DIRTY);
        });
    });

    describe('dirty state management', () => {
        it('should get and set dirty state', () => {
            parentViewDesc.dirty = ViewDirtyState.CHILD_DIRTY;
            expect(parentViewDesc.dirty).toBe(ViewDirtyState.CHILD_DIRTY);

            parentViewDesc.dirty = ViewDirtyState.NODE_DIRTY;
            expect(parentViewDesc.dirty).toBe(ViewDirtyState.NODE_DIRTY);
        });
    });

    describe('parent-child relationships', () => {
        it('should manage parent relationship', () => {
            childViewDesc.parent = parentViewDesc;
            expect(childViewDesc.parent).toBe(parentViewDesc);
        });

        it('should manage children array', () => {
            const newChild = new ViewDesc(parentViewDesc, [], document.createElement('div'), null);
            parentViewDesc.children = [childViewDesc, newChild];
            expect(parentViewDesc.children.length).toBe(2);
        });
    });

    describe('getType', () => {
        it('should return VIEW type by default', () => {
            expect(parentViewDesc.getType()).toBe(ViewDescType.VIEW);
        });
    });

    describe('posFromDOM', () => {
        it('should return -1 for non-matching DOM node', () => {
            const otherNode = document.createElement('div');
            expect(parentViewDesc.posFromDOM(otherNode, 0, 0)).toBe(-1);
        });
    });

    describe('getDesc', () => {
        it('should return self when called on own DOM node', () => {
            expect(parentViewDesc.getDesc(testDoc)).toBe(parentViewDesc);
        });

        it('should return undefined for unknown node', () => {
            const unknownNode = document.createElement('div');
            expect(parentViewDesc.getDesc(unknownNode)).toBeUndefined();
        });
    });


    describe('size and border', () => {
        it('should return 0 for size by default', () => {
            expect(parentViewDesc.size).toBe(0);
        });

        it('should return 0 for border by default', () => {
            expect(parentViewDesc.border).toBe(0);
        });
    });

    describe('domAtom', () => {
        it('should return false by default', () => {
            expect(parentViewDesc.domAtom).toBe(false);
        });
    });

    describe('contentDOM', () => {
        it('should return the contentDOM element', () => {
            expect(parentViewDesc.contentDOM).toBe(testDoc);
        });

        it('should handle null contentDOM', () => {
            const viewDesc = new ViewDesc(undefined, [], testDoc, null);
            expect(viewDesc.contentDOM).toBeNull();
        });
    });
});

