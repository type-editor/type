import {describe, it, expect} from 'vitest';
import {ViewDescUtil} from '@src/view-desc/ViewDescUtil';
import {ViewDesc} from '@src/view-desc/ViewDesc';
import {NodeViewDesc} from '@src/view-desc/NodeViewDesc';
import {p, schema, setupJSDOMMocks} from '@type-editor/test-builder';
import type {PmNode} from '@type-editor/model';

setupJSDOMMocks();

describe('ViewDescUtil', () => {
    describe('nearestViewDesc', () => {
        it('should find the nearest ViewDesc ancestor', () => {
            const parentDom = document.createElement('div');
            const childDom = document.createElement('span');
            parentDom.appendChild(childDom);

            const parentViewDesc = new ViewDesc(undefined, [], parentDom, parentDom);
            const childViewDesc = new ViewDesc(parentViewDesc, [], childDom, childDom);

            const result = ViewDescUtil.nearestViewDesc(parentViewDesc, childDom);
            expect(result).toBe(childViewDesc);
        });

        it('should return the same ViewDesc if dom matches', () => {
            const dom = document.createElement('div');
            const viewDesc = new ViewDesc(undefined, [], dom, dom);

            const result = ViewDescUtil.nearestViewDesc(viewDesc, dom);
            expect(result).toBe(viewDesc);
        });

        it('should return undefined if no ViewDesc found', () => {
            const dom = document.createElement('div');
            const otherDom = document.createElement('span');
            const viewDesc = new ViewDesc(undefined, [], dom, dom);

            const result = ViewDescUtil.nearestViewDesc(viewDesc, otherDom);
            expect(result).toBeUndefined();
        });

        it('should traverse up the DOM tree', () => {
            const grandparentDom = document.createElement('div');
            const parentDom = document.createElement('div');
            const childDom = document.createElement('span');
            const textNode = document.createTextNode('text');

            grandparentDom.appendChild(parentDom);
            parentDom.appendChild(childDom);
            childDom.appendChild(textNode);

            const grandparentViewDesc = new ViewDesc(undefined, [], grandparentDom, grandparentDom);
            const parentViewDesc = new ViewDesc(grandparentViewDesc, [], parentDom, parentDom);

            const result = ViewDescUtil.nearestViewDesc(grandparentViewDesc, textNode);
            expect(result).toBe(parentViewDesc);
        });
    });

    describe('nearestNodeViewDesc', () => {
        it('should find NodeViewDesc when properly set up', () => {
            const parentDom = document.createElement('div');
            const nodeDom = document.createElement('p');
            const contentDom = document.createElement('div');
            parentDom.appendChild(nodeDom);
            nodeDom.appendChild(contentDom);

            const pmNode: PmNode = p('test');
            const nodeViewDesc = new NodeViewDesc(
                undefined,
                pmNode,
                [],
                null,
                parentDom,
                contentDom,
                nodeDom
            );

            // nearestNodeViewDesc has complex checks for nodeDOM containment
            const result = ViewDescUtil.nearestNodeViewDesc(nodeViewDesc, nodeDom);
            expect(result).toBeDefined();
        });

        it('should return undefined if no NodeViewDesc found', () => {
            const dom = document.createElement('div');
            const otherDom = document.createElement('span');
            const viewDesc = new ViewDesc(undefined, [], dom, dom);

            const result = ViewDescUtil.nearestNodeViewDesc(viewDesc, otherDom);
            expect(result).toBeUndefined();
        });

        it('should only return descs with node property', () => {
            const parentDom = document.createElement('div');
            const childDom = document.createElement('span');
            parentDom.appendChild(childDom);

            // Create a plain ViewDesc (no node)
            const plainViewDesc = new ViewDesc(undefined, [], parentDom, parentDom);
            const childViewDesc = new ViewDesc(plainViewDesc, [], childDom, childDom);

            // Should not return ViewDesc without node
            const result = ViewDescUtil.nearestNodeViewDesc(plainViewDesc, childDom);
            expect(result).toBeUndefined();
        });
    });

    describe('edge cases', () => {
        it('should handle deeply nested DOM structures', () => {
            const root = document.createElement('div');
            let current = root;

            for (let i = 0; i < 10; i++) {
                const child = document.createElement('div');
                current.appendChild(child);
                current = child;
            }

            const rootViewDesc = new ViewDesc(undefined, [], root, root);
            const result = ViewDescUtil.nearestViewDesc(rootViewDesc, current);

            expect(result).toBe(rootViewDesc);
        });

        it('should handle text nodes correctly', () => {
            const parent = document.createElement('div');
            const textNode = document.createTextNode('text');
            parent.appendChild(textNode);

            const viewDesc = new ViewDesc(undefined, [], parent, parent);
            const result = ViewDescUtil.nearestViewDesc(viewDesc, textNode);

            expect(result).toBe(viewDesc);
        });

        it('should not return desc when dom is outside nodeDOM', () => {
            const outerDom = document.createElement('div');
            const nodeDom = document.createElement('p');
            const outsideDom = document.createElement('span');

            outerDom.appendChild(nodeDom);
            outerDom.appendChild(outsideDom);

            const pmNode: PmNode = p('test');
            const nodeViewDesc = new NodeViewDesc(
                undefined,
                pmNode,
                [],
                null,
                outerDom,
                nodeDom,
                nodeDom
            );

            const result = ViewDescUtil.nearestNodeViewDesc(nodeViewDesc, outsideDom);
            expect(result).toBeUndefined();
        });
    });
});

