import {describe, it, expect} from 'vitest';
import {docViewDesc} from '@src/view-desc/doc-view-desc';
import {doc, p, setupJSDOMMocks} from '@type-editor/test-builder';
import type {PmNode} from '@type-editor/model';

setupJSDOMMocks();

// Helper to create a proper innerDeco mock with all required methods
function createInnerDecoMock() {
    return {
        find: () => [],
        eq: () => true,
        locals: () => [],
        forChild: () => createInnerDecoMock()
    } as any;
}

// Helper to create a proper view mock with all required methods
function createMockView() {
    return {
        composing: false,
        nodeViews: {},
        someProp: () => undefined,
        domObserver: {
            requiresGeckoHackNode: false
        }
    } as any;
}

describe('docViewDesc', () => {
    it('should create a document view descriptor', () => {
        const pmDoc: PmNode = doc(p('Hello world'));
        const dom = document.createElement('div');

        const viewDesc = docViewDesc(pmDoc, [], createInnerDecoMock(), dom, createMockView());

        expect(viewDesc).toBeDefined();
        expect(viewDesc.node).toBe(pmDoc);
        expect(viewDesc.dom).toBe(dom);
    });

    it('should have contentDOM set to the dom element', () => {
        const pmDoc: PmNode = doc(p('Content'));
        const dom = document.createElement('div');

        const viewDesc = docViewDesc(pmDoc, [], createInnerDecoMock(), dom, createMockView());

        expect(viewDesc.contentDOM).toBe(dom);
    });

    it('should have no parent', () => {
        const pmDoc: PmNode = doc(p('Test'));
        const dom = document.createElement('div');

        const viewDesc = docViewDesc(pmDoc, [], createInnerDecoMock(), dom, createMockView());

        expect(viewDesc.parent).toBeUndefined();
    });

    it('should set nodeDOM to the same as dom', () => {
        const pmDoc: PmNode = doc(p('Test'));
        const dom = document.createElement('div');

        const viewDesc = docViewDesc(pmDoc, [], createInnerDecoMock(), dom, createMockView());

        expect(viewDesc.nodeDOM).toBe(dom);
    });

    it('should pass outer and inner decorations', () => {
        const pmDoc: PmNode = doc(p('Test'));
        const dom = document.createElement('div');
        const outerDeco: any[] = [];
        const innerDeco = createInnerDecoMock();

        const viewDesc = docViewDesc(pmDoc, outerDeco, innerDeco, dom, createMockView());

        expect(viewDesc.outerDeco).toBe(outerDeco);
        expect(viewDesc.innerDeco).toBe(innerDeco);
    });
});

