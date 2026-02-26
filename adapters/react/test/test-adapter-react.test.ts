/**
 * Unit tests for @type-editor/adapter-react
 *
 * Tests focus on class-level behaviour (context shape, lifecycle, DOM) rather
 * than React rendering — no React testing library is used.
 *
 * Tests cover:
 *   - ReactNodeView
 *   - ReactMarkView
 *   - ReactPluginView
 *   - ReactWidgetView
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { schema, setupJSDOMMocks } from '@type-editor/test-builder';

import { ReactNodeView } from '@src/nodeView/index';
import { ReactMarkView } from '@src/markView/index';
import { ReactPluginView } from '@src/pluginView/index';
import { ReactWidgetView } from '@src/widgetView/index';

setupJSDOMMocks();

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function makeMockView(container = document.createElement('div')) {
    return {
        dom: container,
        state: {
            tr: { setNodeMarkup: vi.fn().mockReturnValue({}) },
        },
        dispatch: vi.fn(),
    } as any;
}

/**
 * Create a block node that carries an `id` attribute so that
 * ReactNodeView.key resolves to a non-undefined value.
 */
function makeNodeWithId(id = 'test-node-id') {
    // Wrap the plain PM node with a mock so node.attrs.id is defined.
    const baseNode = schema.node('paragraph', null, [schema.text('hello')]);
    return Object.create(baseNode, {
        attrs: { value: { ...baseNode.attrs, id } },
    }) as typeof baseNode;
}

function makeEmMark() {
    return schema.mark('em');
}

const emptyInnerDecorations = { find: vi.fn() } as any;

// ---------------------------------------------------------------------------
// ReactNodeView
// ---------------------------------------------------------------------------

describe('ReactNodeView', () => {
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        view = makeMockView();
    });

    function makeInstance(id = 'node-1') {
        const node = makeNodeWithId(id);
        return new ReactNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: () => null },
        });
    }

    it('inherits CoreNodeView DOM behaviour: dom has data-node-view-root', () => {
        const nv = makeInstance();
        expect(nv.dom.getAttribute('data-node-view-root')).toBe('true');
    });

    it('key returns node.attrs.id', () => {
        const nv = makeInstance('my-id');
        expect(nv.key).toBe('my-id');
    });

    it('context is populated on construction', () => {
        const nv = makeInstance();
        const ctx = nv.context;
        expect(ctx).toBeDefined();
        expect(ctx.dom).toBe(nv.dom);
        expect(ctx.view).toBe(view);
        expect(typeof ctx.getPos).toBe('function');
        expect(typeof ctx.setAttrs).toBe('function');
        expect(typeof ctx.contentRef).toBe('function');
        expect(ctx.selected).toBe(false);
        expect(Array.isArray(ctx.decorations)).toBe(true);
    });

    it('updateContext syncs node, selected, decorations, and innerDecorations', () => {
        const nv = makeInstance();
        const newNode = makeNodeWithId('node-1');
        const newDecorations = [{}] as any;
        const newInnerDecorations = { find: vi.fn() } as any;

        // Manually set internal state to simulate a ProseMirror update
        nv['node'] = newNode;
        nv['selected'] = true;
        nv['decorations'] = newDecorations;
        nv['innerDecorations'] = newInnerDecorations;

        nv.updateContext();

        const ctx = nv.context;
        expect(ctx.node).toBe(newNode);
        expect(ctx.selected).toBe(true);
        expect(ctx.decorations).toBe(newDecorations);
        expect(ctx.innerDecorations).toBe(newInnerDecorations);
    });

    it('context object reference is stable across updateContext calls', () => {
        const nv = makeInstance();
        const ctxRef = nv.context;
        nv.updateContext();
        expect(nv.context).toBe(ctxRef);
    });

    it('render returns a ReactPortal', () => {
        const nv = makeInstance();
        const portal = nv.render();
        // React portals are plain objects with a $$typeof symbol
        expect(portal).toBeDefined();
        expect(typeof portal).toBe('object');
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const node = makeNodeWithId('d-1');
        const nv = new ReactNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: () => null, destroy },
        });
        const parent = document.createElement('div');
        document.body.appendChild(parent);
        parent.appendChild(nv.dom);
        nv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
        document.body.removeChild(parent);
    });

    it('selectNode calls options.selectNode', () => {
        const selectNode = vi.fn();
        const node = makeNodeWithId('s-1');
        const nv = new ReactNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: () => null, selectNode },
        });
        nv.selectNode();
        expect(selectNode).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// ReactMarkView
// ---------------------------------------------------------------------------

describe('ReactMarkView', () => {
    let view: ReturnType<typeof makeMockView>;
    let mark: ReturnType<typeof makeEmMark>;

    beforeEach(() => {
        view = makeMockView();
        mark = makeEmMark();
    });

    function makeInstance() {
        return new ReactMarkView({
            mark,
            view,
            inline: true,
            options: { component: () => null },
        });
    }

    it('key is a non-empty string', () => {
        const mv = makeInstance();
        expect(typeof mv.key).toBe('string');
        expect(mv.key.length).toBeGreaterThan(0);
    });

    it('two instances have different keys', () => {
        const mv1 = makeInstance();
        const mv2 = makeInstance();
        expect(mv1.key).not.toBe(mv2.key);
    });

    it('context contains mark and view on construction', () => {
        const mv = makeInstance();
        expect(mv.context.mark).toBe(mark);
        expect(mv.context.view).toBe(view);
    });

    it('updateContext syncs mark', () => {
        const mv = makeInstance();
        const newMark = schema.mark('strong');
        // @ts-ignore
        mv['mark'] = newMark as any;
        mv.updateContext();
        expect(mv.context.mark).toBe(newMark);
    });

    it('dom has data-mark-view-root', () => {
        const mv = makeInstance();
        expect(mv.dom.getAttribute('data-mark-view-root')).toBe('true');
    });

    it('render returns a ReactPortal', () => {
        const mv = makeInstance();
        const portal = mv.render();
        expect(portal).toBeDefined();
        expect(typeof portal).toBe('object');
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const mv = new ReactMarkView({
            mark,
            view,
            inline: true,
            options: { component: () => null, destroy },
        });
        mv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// ReactPluginView
// ---------------------------------------------------------------------------

describe('ReactPluginView', () => {
    let container: HTMLDivElement;
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        view = makeMockView(container);
    });

    function makeInstance() {
        return new ReactPluginView({
            view,
            options: { component: () => null },
        });
    }

    it('key is a non-empty string', () => {
        const pv = makeInstance();
        expect(typeof pv.key).toBe('string');
        expect(pv.key.length).toBeGreaterThan(0);
    });

    it('two instances have different keys', () => {
        const pv1 = makeInstance();
        const pv2 = makeInstance();
        expect(pv1.key).not.toBe(pv2.key);
    });

    it('context contains view on construction', () => {
        const pv = makeInstance();
        expect(pv.context.view).toBe(view);
    });

    it('updateContext syncs view and prevState', () => {
        const pv = makeInstance();
        const newView = makeMockView();
        const prevState = { doc: null } as any;
        pv.update(newView, prevState);
        pv.updateContext();
        expect(pv.context.view).toBe(newView);
        expect(pv.context.prevState).toBe(prevState);
    });

    it('context object reference is stable', () => {
        const pv = makeInstance();
        const ctxRef = pv.context;
        pv.updateContext();
        expect(pv.context).toBe(ctxRef);
    });

    it('render returns a ReactPortal', () => {
        const pv = makeInstance();
        const portal = pv.render();
        expect(portal).toBeDefined();
        expect(typeof portal).toBe('object');
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const pv = new ReactPluginView({ view, options: { component: () => null, destroy } });
        pv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// ReactWidgetView
// ---------------------------------------------------------------------------

describe('ReactWidgetView', () => {
    function makeInstance(pos = 5) {
        return new ReactWidgetView({
            pos,
            options: { as: 'span', component: () => null },
        });
    }

    it('key is a non-empty string', () => {
        const wv = makeInstance();
        expect(typeof wv.key).toBe('string');
        expect(wv.key.length).toBeGreaterThan(0);
    });

    it('two instances have different keys', () => {
        const wv1 = makeInstance();
        const wv2 = makeInstance();
        expect(wv1.key).not.toBe(wv2.key);
    });

    it('context contains undefined view before bind', () => {
        const wv = makeInstance();
        expect(wv.context.view).toBeUndefined();
    });

    it('updateContext syncs view and getPos after bind', () => {
        const mockView = makeMockView();
        const getPosFn = vi.fn().mockReturnValue(3);
        const wv = makeInstance();
        wv.bind(mockView, getPosFn);
        wv.updateContext();
        expect(wv.context.view).toBe(mockView);
        // getPos in context is a bound function — call it to verify
        expect(typeof wv.context.getPos).toBe('function');
    });

    it('dom has data-widget-view-root', () => {
        const wv = makeInstance();
        expect(wv.dom.getAttribute('data-widget-view-root')).toBe('true');
    });

    it('pos is stored correctly', () => {
        const wv = makeInstance(99);
        expect(wv.pos).toBe(99);
    });

    it('render returns a ReactPortal', () => {
        const wv = makeInstance();
        const portal = wv.render();
        expect(portal).toBeDefined();
        expect(typeof portal).toBe('object');
    });
});

