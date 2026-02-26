import {describe, it, expect, beforeEach} from 'vitest';
import {TextViewDesc} from '@src/view-desc/TextViewDesc';
import {ViewDescType} from '@src/view-desc/ViewDescType';
import {ViewDirtyState} from '@src/view-desc/ViewDirtyState';
import {schema, setupJSDOMMocks} from '@type-editor/test-builder';
import type {PmNode} from '@type-editor/model';

setupJSDOMMocks();

describe('TextViewDesc', () => {
    let textNode: Text;
    let outerDom: HTMLElement;
    let pmTextNode: PmNode;
    let textViewDesc: TextViewDesc;

    beforeEach(() => {
        textNode = document.createTextNode('Hello world');
        outerDom = document.createElement('span');
        outerDom.appendChild(textNode);

        pmTextNode = schema.text('Hello world');
        textViewDesc = new TextViewDesc(
            undefined,
            pmTextNode,
            [],
            null,
            outerDom,
            textNode
        );
    });

    describe('constructor', () => {
        it('should create TextViewDesc with correct properties', () => {
            expect(textViewDesc.node).toBe(pmTextNode);
            expect(textViewDesc.dom).toBe(outerDom);
            expect(textViewDesc.nodeDOM).toBe(textNode);
            expect(textViewDesc.contentDOM).toBeNull();
        });
    });

    describe('getType', () => {
        it('should return TEXT type', () => {
            expect(textViewDesc.getType()).toBe(ViewDescType.TEXT);
        });
    });

    describe('domAtom', () => {
        it('should return false', () => {
            expect(textViewDesc.domAtom).toBe(false);
        });
    });

    describe('parseRule', () => {
        it('should return parse rule with skip property', () => {
            const rule = textViewDesc.parseRule();
            expect(rule).toBeDefined();
            expect(rule.skip).toBeDefined();
        });

        it('should skip to parent node', () => {
            const rule = textViewDesc.parseRule();
            expect(rule.skip).toBe(outerDom);
        });
    });

    describe('update', () => {
        it('should update text content', () => {
            const newTextNode = schema.text('New text');
            const mockView = {
                trackWrites: null,
                clearTrackWrites: () => {}
            } as any;

            const result = textViewDesc.update(newTextNode, [], null, mockView);

            expect(result).toBe(true);
            expect(textNode.nodeValue).toBe('New text');
            expect(textViewDesc.node).toBe(newTextNode);
        });

        it('should return false if node is NODE_DIRTY', () => {
            textViewDesc.dirty = ViewDirtyState.NODE_DIRTY;
            const newTextNode = schema.text('New text');
            const mockView = {} as any;

            const result = textViewDesc.update(newTextNode, [], null, mockView);
            expect(result).toBe(false);
        });

        it('should return false if markup does not match', () => {
            const strongMark = schema.mark('strong');
            const markedText = schema.text('text', [strongMark]);
            const mockView = {} as any;

            const result = textViewDesc.update(markedText, [], null, mockView);
            expect(result).toBe(false);
        });

        it('should set dirty state to NOT_DIRTY after successful update', () => {
            // Setup parent with contentDOM
            const parentDom = document.createElement('div');
            parentDom.appendChild(outerDom);
            const parentViewDesc = {
                contentDOM: parentDom
            } as any;
            textViewDesc.parent = parentViewDesc;

            textViewDesc.dirty = ViewDirtyState.CHILD_DIRTY;
            const newTextNode = schema.text('Updated');
            const mockView = {
                trackWrites: null,
                clearTrackWrites: () => {}
            } as any;

            textViewDesc.update(newTextNode, [], null, mockView);
            expect(textViewDesc.dirty).toBe(ViewDirtyState.NOT_DIRTY);
        });

        it('should clear track writes if needed', () => {
            const newTextNode = schema.text('Test');
            let cleared = false;
            const mockView = {
                trackWrites: textNode,
                clearTrackWrites: () => { cleared = true; }
            } as any;

            textViewDesc.update(newTextNode, [], null, mockView);
            expect(cleared).toBe(true);
        });
    });

    describe('inParent', () => {
        it('should return true when text node is in parent contentDOM', () => {
            const parentContentDom = document.createElement('div');
            parentContentDom.appendChild(outerDom);

            const parentViewDesc = {
                contentDOM: parentContentDom
            } as any;

            textViewDesc.parent = parentViewDesc;
            expect(textViewDesc.inParent()).toBe(true);
        });

        it('should return false when text node is not in parent', () => {
            const parentContentDom = document.createElement('div');
            const parentViewDesc = {
                contentDOM: parentContentDom
            } as any;

            textViewDesc.parent = parentViewDesc;
            expect(textViewDesc.inParent()).toBe(false);
        });
    });

    describe('stopEvent', () => {
        it('should return false for events', () => {
            const event = new Event('click');
            expect(textViewDesc.stopEvent(event)).toBe(false);
        });
    });

    describe('markDirty', () => {
        it('should mark text as dirty', () => {
            textViewDesc.markDirty(0, 5);
            expect(textViewDesc.dirty).not.toBe(ViewDirtyState.NOT_DIRTY);
        });
    });
});

