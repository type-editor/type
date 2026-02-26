/**
 * Unit tests for @type-editor/adapter-core
 *
 * Tests cover:
 *   - CoreNodeView
 *   - CoreMarkView
 *   - CorePluginView
 *   - CoreWidgetView
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { schema, setupJSDOMMocks } from '@type-editor/test-builder';

import { CoreNodeView } from '@src/nodeView/CoreNodeView';
import type { CoreNodeViewSpec } from '@src/nodeView/CoreNodeViewOptions';
import { CoreMarkView } from '@src/markView/CoreMarkView';
import type { CoreMarkViewSpec } from '@src/markView/CoreMarkViewOptions';
import { CorePluginView } from '@src/pluginView/CorePluginView';
import type { CorePluginViewSpec } from '@src/pluginView/CorePluginViewOptions';
import { CoreWidgetView } from '@src/widgetView/CoreWidgetView';
import type { CoreWidgetViewSpec } from '@src/widgetView/CoreWidgetViewOptions';

setupJSDOMMocks();

// ---------------------------------------------------------------------------
// Shared mock helpers
// ---------------------------------------------------------------------------

function makeMockView(container = document.createElement('div')) {
    return {
        dom: container,
        state: {
            tr: {
                setNodeMarkup: vi.fn().mockReturnValue({}),
            },
        },
        dispatch: vi.fn(),
    } as any;
}

function makeBlockNode() {
    return schema.node('paragraph', null, [schema.text('hello')]);
}

function makeInlineNode() {
    // image is an inline leaf node
    return schema.node('image', { src: 'img.png' });
}

function makeEmMark() {
    return schema.mark('em');
}

const emptyInnerDecorations = { find: vi.fn() } as any;

// ---------------------------------------------------------------------------
// CoreNodeView
// ---------------------------------------------------------------------------

describe('CoreNodeView', () => {
    let view: ReturnType<typeof makeMockView>;
    let node: ReturnType<typeof makeBlockNode>;

    beforeEach(() => {
        view = makeMockView();
        node = makeBlockNode();
    });

    function makeSpec(
        overrides: Partial<CoreNodeViewSpec<unknown>['options']> = {},
    ): CoreNodeViewSpec<unknown> {
        return {
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: 'MockComponent', ...overrides },
        };
    }

    it('sets data-node-view-root on dom', () => {
        const nv = new CoreNodeView(makeSpec());
        expect(nv.dom.getAttribute('data-node-view-root')).toBe('true');
    });

    it('sets data-node-view-content on contentDOM', () => {
        const nv = new CoreNodeView(makeSpec());
        expect(nv.contentDOM).not.toBeNull();
        expect(nv.contentDOM!.getAttribute('data-node-view-content')).toBe('true');
    });

    it('creates a <div> for block nodes by default', () => {
        const nv = new CoreNodeView(makeSpec());
        expect(nv.dom.tagName).toBe('DIV');
    });

    it('creates a <span> for inline nodes by default', () => {
        const inlineSpec: CoreNodeViewSpec<unknown> = {
            node: makeInlineNode(),
            view,
            getPos: () => 5,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: 'MockComponent' },
        };
        const nv = new CoreNodeView(inlineSpec);
        expect(nv.dom.tagName).toBe('SPAN');
    });

    it('creates dom with a custom tag string via `as`', () => {
        const nv = new CoreNodeView(makeSpec({ as: 'section' }));
        expect(nv.dom.tagName).toBe('SECTION');
    });

    it('uses a supplied HTMLElement as dom via `as`', () => {
        const el = document.createElement('article');
        const nv = new CoreNodeView(makeSpec({ as: el }));
        expect(nv.dom).toBe(el);
    });

    it('calls a factory function for dom via `as`', () => {
        const factory = vi.fn(() => document.createElement('aside'));
        const nv = new CoreNodeView(makeSpec({ as: factory }));
        expect(factory).toHaveBeenCalledWith(node);
        expect(nv.dom.tagName).toBe('ASIDE');
    });

    it('contentDOM === dom when contentAs is "self"', () => {
        const nv = new CoreNodeView(makeSpec({ contentAs: 'self' }));
        expect(nv.contentDOM).toBe(nv.dom);
    });

    it('contentDOM is null for leaf nodes', () => {
        const inlineSpec: CoreNodeViewSpec<unknown> = {
            node: makeInlineNode(),
            view,
            getPos: () => 5,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: 'MockComponent' },
        };
        const nv = new CoreNodeView(inlineSpec);
        expect(nv.contentDOM).toBeNull();
    });

    it('exposes the component via the component getter', () => {
        const nv = new CoreNodeView(makeSpec({ component: 'TestComponent' }));
        expect(nv.component).toBe('TestComponent');
    });

    it('selectNode calls options.selectNode callback', () => {
        const selectNode = vi.fn();
        const nv = new CoreNodeView(makeSpec({ selectNode }));
        nv.selectNode();
        expect(selectNode).toHaveBeenCalledOnce();
    });

    it('deselectNode calls options.deselectNode callback', () => {
        const deselectNode = vi.fn();
        const nv = new CoreNodeView(makeSpec({ deselectNode }));
        nv.deselectNode();
        expect(deselectNode).toHaveBeenCalledOnce();
    });

    it('update returns true when node type matches', () => {
        const nv = new CoreNodeView(makeSpec());
        expect(nv.update(makeBlockNode(), [], emptyInnerDecorations)).toBe(true);
    });

    it('update returns false when node type differs', () => {
        const nv = new CoreNodeView(makeSpec());
        const differentNode = schema.node('heading', { level: 1 }, [schema.text('title')]);
        expect(nv.update(differentNode, [], emptyInnerDecorations)).toBe(false);
    });

    it('update uses custom update callback', () => {
        const customUpdate = vi.fn().mockReturnValue(false);
        const nv = new CoreNodeView(makeSpec({ update: customUpdate }));
        expect(nv.update(makeBlockNode(), [], emptyInnerDecorations)).toBe(false);
        expect(customUpdate).toHaveBeenCalled();
    });

    it('update calls onUpdate when update returns true', () => {
        const onUpdate = vi.fn();
        const nv = new CoreNodeView(makeSpec({ onUpdate }));
        nv.update(makeBlockNode(), [], emptyInnerDecorations);
        expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('update does NOT call onUpdate when update returns false', () => {
        const onUpdate = vi.fn();
        const nv = new CoreNodeView(makeSpec({ onUpdate, update: vi.fn().mockReturnValue(false) }));
        nv.update(makeBlockNode(), [], emptyInnerDecorations);
        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('destroy calls options.destroy callback', () => {
        const destroy = vi.fn();
        const parent = document.createElement('div');
        document.body.appendChild(parent);
        const nv = new CoreNodeView(makeSpec({ destroy }));
        parent.appendChild(nv.dom);
        nv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
        document.body.removeChild(parent);
    });

    it('ignoreMutation returns true when contentDOM is null (leaf)', () => {
        const inlineSpec: CoreNodeViewSpec<unknown> = {
            node: makeInlineNode(),
            view,
            getPos: () => 5,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: 'MockComponent' },
        };
        const nv = new CoreNodeView(inlineSpec);
        const mutation = { type: 'childList', target: document.createElement('span') } as any;
        expect(nv.ignoreMutation(mutation)).toBe(true);
    });

    it('ignoreMutation delegates to user callback when provided', () => {
        const ignoreMutation = vi.fn().mockReturnValue(true);
        const nv = new CoreNodeView(makeSpec({ ignoreMutation }));
        const mutation = { type: 'childList', target: nv.contentDOM! } as any;
        expect(nv.ignoreMutation(mutation)).toBe(true);
        expect(ignoreMutation).toHaveBeenCalled();
    });

    it('ignoreMutation returns false for selection mutations', () => {
        const nv = new CoreNodeView(makeSpec());
        const mutation = { type: 'selection', target: nv.contentDOM! } as any;
        expect(nv.ignoreMutation(mutation)).toBe(false);
    });

    it('ignoreMutation returns true for attribute mutations on contentDOM', () => {
        const nv = new CoreNodeView(makeSpec());
        const mutation = { type: 'attributes', target: nv.contentDOM! } as any;
        expect(nv.ignoreMutation(mutation)).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// CoreMarkView
// ---------------------------------------------------------------------------

describe('CoreMarkView', () => {
    let view: ReturnType<typeof makeMockView>;
    let mark: ReturnType<typeof makeEmMark>;

    beforeEach(() => {
        view = makeMockView();
        mark = makeEmMark();
    });

    function makeSpec(
        overrides: Partial<CoreMarkViewSpec<unknown>['options']> = {},
        inline = true,
    ): CoreMarkViewSpec<unknown> {
        return {
            mark,
            view,
            inline,
            options: { component: 'MockMarkComponent', ...overrides },
        };
    }

    it('sets data-mark-view-root on dom', () => {
        const mv = new CoreMarkView(makeSpec());
        expect(mv.dom.getAttribute('data-mark-view-root')).toBe('true');
    });

    it('sets data-mark-view-content on contentDOM', () => {
        const mv = new CoreMarkView(makeSpec());
        expect(mv.contentDOM.getAttribute('data-mark-view-content')).toBe('true');
    });

    it('inline=true creates <span> dom by default', () => {
        const mv = new CoreMarkView(makeSpec({}, true));
        expect(mv.dom.tagName).toBe('SPAN');
    });

    it('inline=false creates <div> dom by default', () => {
        const mv = new CoreMarkView(makeSpec({}, false));
        expect(mv.dom.tagName).toBe('DIV');
    });

    it('creates dom with a custom tag via `as`', () => {
        const mv = new CoreMarkView(makeSpec({ as: 'em' }));
        expect(mv.dom.tagName).toBe('EM');
    });

    it('uses a supplied HTMLElement as dom via `as`', () => {
        const el = document.createElement('strong');
        const mv = new CoreMarkView(makeSpec({ as: el }));
        expect(mv.dom).toBe(el);
    });

    it('calls factory function for dom via `as`', () => {
        const factory = vi.fn(() => document.createElement('em'));
        const mv = new CoreMarkView(makeSpec({ as: factory }));
        expect(factory).toHaveBeenCalledWith(mark);
        expect(mv.dom.tagName).toBe('EM');
    });

    it('exposes the component via the component getter', () => {
        const mv = new CoreMarkView(makeSpec({ component: 'TestMarkComponent' }));
        expect(mv.component).toBe('TestMarkComponent');
    });

    it('ignoreMutation delegates to user callback', () => {
        const ignoreMutation = vi.fn().mockReturnValue(true);
        const mv = new CoreMarkView(makeSpec({ ignoreMutation }));
        const mutation = { type: 'childList', target: mv.contentDOM } as any;
        expect(mv.ignoreMutation(mutation)).toBe(true);
        expect(ignoreMutation).toHaveBeenCalled();
    });

    it('ignoreMutation returns false for selection mutations', () => {
        const mv = new CoreMarkView(makeSpec());
        const mutation = { type: 'selection', target: mv.contentDOM } as any;
        expect(mv.ignoreMutation(mutation)).toBe(false);
    });

    it('ignoreMutation returns true for attribute mutations on contentDOM', () => {
        const mv = new CoreMarkView(makeSpec());
        const mutation = { type: 'attributes', target: mv.contentDOM } as any;
        expect(mv.ignoreMutation(mutation)).toBe(true);
    });

    it('destroy calls options.destroy callback', () => {
        const destroy = vi.fn();
        const mv = new CoreMarkView(makeSpec({ destroy }));
        mv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// CorePluginView
// ---------------------------------------------------------------------------

describe('CorePluginView', () => {
    let container: HTMLDivElement;
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        view = makeMockView(container);
    });

    function makeSpec(
        overrides: Partial<CorePluginViewSpec<unknown>['options']> = {},
    ): CorePluginViewSpec<unknown> {
        return {
            view,
            options: { component: 'MockPluginComponent', ...overrides },
        };
    }

    it('stores the editor view on construction', () => {
        const pv = new CorePluginView(makeSpec());
        expect(pv['view']).toBe(view);
    });

    it('exposes the component via the component getter', () => {
        const pv = new CorePluginView(makeSpec({ component: 'PluginComp' }));
        expect(pv.component).toBe('PluginComp');
    });

    it('root returns user-provided element from options.root', () => {
        const rootEl = document.createElement('nav');
        document.body.appendChild(rootEl);
        const pv = new CorePluginView(makeSpec({ root: () => rootEl }));
        expect(pv.root).toBe(rootEl);
        document.body.removeChild(rootEl);
    });

    it('root falls back to view.dom.parentElement', () => {
        const pv = new CorePluginView(makeSpec());
        expect(pv.root).toBe(container.parentElement);
    });

    it('root falls back to document.body when dom has no parent', () => {
        const orphan = document.createElement('div');
        const pv = new CorePluginView({ view: makeMockView(orphan), options: { component: 'C' } });
        expect(pv.root).toBe(document.body);
    });

    it('update sets view and prevState', () => {
        const pv = new CorePluginView(makeSpec());
        const newView = makeMockView();
        const prevState = { doc: null } as any;
        pv.update(newView, prevState);
        expect(pv['view']).toBe(newView);
        expect(pv['prevState']).toBe(prevState);
    });

    it('update calls options.update callback', () => {
        const updateSpy = vi.fn();
        const pv = new CorePluginView(makeSpec({ update: updateSpy }));
        const prevState = {} as any;
        pv.update(view, prevState);
        expect(updateSpy).toHaveBeenCalledWith(view, prevState);
    });

    it('destroy calls options.destroy callback', () => {
        const destroy = vi.fn();
        const pv = new CorePluginView(makeSpec({ destroy }));
        pv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// CoreWidgetView
// ---------------------------------------------------------------------------

describe('CoreWidgetView', () => {
    function makeSpec(
        overrides: { as?: string | HTMLElement; component?: unknown } = {},
        pos = 5,
    ): CoreWidgetViewSpec<unknown> {
        return {
            pos,
            options: { as: 'span', component: 'MockWidgetComponent', ...overrides },
        };
    }

    it('creates dom with tag string and data-widget-view-root', () => {
        const wv = new CoreWidgetView(makeSpec({ as: 'span' }));
        expect(wv.dom.tagName).toBe('SPAN');
        expect(wv.dom.getAttribute('data-widget-view-root')).toBe('true');
    });

    it('creates dom from any tag string', () => {
        const wv = new CoreWidgetView(makeSpec({ as: 'aside' }));
        expect(wv.dom.tagName).toBe('ASIDE');
    });

    it('uses a supplied HTMLElement as dom', () => {
        const el = document.createElement('mark');
        const wv = new CoreWidgetView(makeSpec({ as: el }));
        expect(wv.dom).toBe(el);
    });

    it('stores the document position', () => {
        const wv = new CoreWidgetView(makeSpec({}, 42));
        expect(wv.pos).toBe(42);
    });

    it('exposes the component via the component getter', () => {
        const wv = new CoreWidgetView(makeSpec({ component: 'WidgetComp' }));
        expect(wv.component).toBe('WidgetComp');
    });

    it('getPos returns undefined before bind', () => {
        const wv = new CoreWidgetView(makeSpec());
        expect(wv['getPos']()).toBeUndefined();
    });

    it('bind sets view and enables getPos', () => {
        const mockView = makeMockView();
        const getPosFn = vi.fn().mockReturnValue(7);
        const wv = new CoreWidgetView(makeSpec());
        wv.bind(mockView, getPosFn);
        expect(wv['view']).toBe(mockView);
        expect(wv['getPos']()).toBe(7);
    });

    it('spec getter returns the provided spec', () => {
        const spec = { side: 1 };
        const wv = new CoreWidgetView({ pos: 0, spec, options: { as: 'span', component: 'C' } });
        expect(wv.spec).toBe(spec);
    });

    it('spec setter updates the spec', () => {
        const wv = new CoreWidgetView(makeSpec());
        const newSpec = { side: -1 };
        wv.spec = newSpec;
        expect(wv.spec).toBe(newSpec);
    });
});
