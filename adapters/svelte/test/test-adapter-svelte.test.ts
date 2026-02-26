/**
 * Unit tests for @type-editor/adapter-svelte
 *
 * Tests focus on class-level behaviour (writable store context, lifecycle,
 * DOM) — no Svelte component rendering is triggered.
 *
 * Tests cover:
 *   - SvelteNodeView
 *   - SvelteMarkView
 *   - SveltePluginView
 *   - SvelteWidgetView
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { schema, setupJSDOMMocks } from '@type-editor/test-builder';

import { SvelteNodeView } from '@src/nodeView/SvelteNodeView';
import { SvelteMarkView } from '@src/markView/SvelteMarkView';
import { SveltePluginView } from '@src/pluginView/SveltePluginView';
import { SvelteWidgetView } from '@src/widgetView/SvelteWidgetView';

setupJSDOMMocks();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Duck-type check: returns true when `value` looks like a Svelte writable store. */
function isWritableStore(value: unknown): boolean {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as any).subscribe === 'function' &&
        typeof (value as any).set === 'function' &&
        typeof (value as any).update === 'function'
    );
}

function makeMockView(container = document.createElement('div')) {
    return {
        dom: container,
        state: {
            tr: { setNodeMarkup: vi.fn().mockReturnValue({}) },
        },
        dispatch: vi.fn(),
    } as any;
}

function makeBlockNode() {
    return schema.node('paragraph', null, [schema.text('hello')]);
}

function makeEmMark() {
    return schema.mark('em');
}

const emptyInnerDecorations = { find: vi.fn() } as any;

// ---------------------------------------------------------------------------
// SvelteNodeView
// ---------------------------------------------------------------------------

describe('SvelteNodeView', () => {
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        view = makeMockView();
    });

    function makeInstance() {
        const node = makeBlockNode();
        return new SvelteNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: class {} as any },
        });
    }

    it('inherits CoreNodeView DOM behaviour: dom has data-node-view-root', () => {
        const nv = makeInstance();
        expect(nv.dom.getAttribute('data-node-view-root')).toBe('true');
    });

    it('key is a non-empty string', () => {
        const nv = makeInstance();
        expect(typeof nv.key).toBe('string');
        expect(nv.key.length).toBeGreaterThan(0);
    });

    it('two instances have different keys', () => {
        const nv1 = makeInstance();
        const nv2 = makeInstance();
        expect(nv1.key).not.toBe(nv2.key);
    });

    it('context.node is a Svelte writable store', () => {
        const nv = makeInstance();
        expect(isWritableStore(nv.context.node)).toBe(true);
    });

    it('context.selected is a Svelte writable store', () => {
        const nv = makeInstance();
        expect(isWritableStore(nv.context.selected)).toBe(true);
    });

    it('context.decorations is a Svelte writable store', () => {
        const nv = makeInstance();
        expect(isWritableStore(nv.context.decorations)).toBe(true);
    });

    it('context.innerDecorations is a Svelte writable store', () => {
        const nv = makeInstance();
        expect(isWritableStore(nv.context.innerDecorations)).toBe(true);
    });

    it('context.node store holds the initial node', () => {
        const node = makeBlockNode();
        const nv = new SvelteNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: class {} as any },
        });
        expect(get(nv.context.node)).toBe(node);
    });

    it('context.selected store is false initially', () => {
        const nv = makeInstance();
        expect(get(nv.context.selected)).toBe(false);
    });

    it('updateContext pushes new values into the stores', () => {
        const nv = makeInstance();
        const newNode = makeBlockNode();
        const newDecorations = [{}] as any;
        nv['node'] = newNode;
        nv['selected'] = true;
        nv['decorations'] = newDecorations;
        nv.updateContext();
        expect(get(nv.context.node)).toBe(newNode);
        expect(get(nv.context.selected)).toBe(true);
        expect(get(nv.context.decorations)).toBe(newDecorations);
    });

    it('context object reference is stable across updateContext calls', () => {
        const nv = makeInstance();
        const ctxRef = nv.context;
        nv.updateContext();
        expect(nv.context).toBe(ctxRef);
    });

    it('context.dom equals nv.dom', () => {
        const nv = makeInstance();
        expect(nv.context.dom).toBe(nv.dom);
    });

    it('context.view equals the editor view', () => {
        const nv = makeInstance();
        expect(nv.context.view).toBe(view);
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const nv = new SvelteNodeView({
            node: makeBlockNode(),
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: class {} as any, destroy },
        });
        const parent = document.createElement('div');
        document.body.appendChild(parent);
        parent.appendChild(nv.dom);
        nv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
        document.body.removeChild(parent);
    });
});

// ---------------------------------------------------------------------------
// SvelteMarkView
// ---------------------------------------------------------------------------

describe('SvelteMarkView', () => {
    let view: ReturnType<typeof makeMockView>;
    let mark: ReturnType<typeof makeEmMark>;

    beforeEach(() => {
        view = makeMockView();
        mark = makeEmMark();
    });

    function makeInstance(inline = true) {
        return new SvelteMarkView({
            mark,
            view,
            inline,
            options: { component: class {} as any },
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

    it('context.mark is a Svelte writable store', () => {
        const mv = makeInstance();
        expect(isWritableStore(mv.context.mark)).toBe(true);
    });

    it('context.mark store holds the initial mark', () => {
        const mv = makeInstance();
        expect(get(mv.context.mark)).toBe(mark);
    });

    it('context.view is the editor view (not a store)', () => {
        const mv = makeInstance();
        expect(isWritableStore(mv.context.view)).toBe(false);
        expect(mv.context.view).toBe(view);
    });

    it('updateContext pushes new mark into the store', () => {
        const newMark = schema.mark('strong');
        const mv = new SvelteMarkView({
            mark: newMark,
            view,
            inline: true,
            options: { component: class {} as any },
        });
        // The store is populated with the mark on construction
        expect(get(mv.context.mark)).toBe(newMark);
        // updateContext keeps the store in sync
        mv.updateContext();
        expect(get(mv.context.mark)).toBe(newMark);
    });

    it('dom has data-mark-view-root', () => {
        const mv = makeInstance();
        expect(mv.dom.getAttribute('data-mark-view-root')).toBe('true');
    });

    it('inline=true creates a <span> dom element', () => {
        const mv = makeInstance(true);
        expect(mv.dom.tagName).toBe('SPAN');
    });

    it('inline=false creates a <div> dom element', () => {
        const mv = makeInstance(false);
        expect(mv.dom.tagName).toBe('DIV');
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const mv = new SvelteMarkView({ mark, view, inline: true, options: { component: class {} as any, destroy } });
        mv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// SveltePluginView
// ---------------------------------------------------------------------------

describe('SveltePluginView', () => {
    let container: HTMLDivElement;
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        view = makeMockView(container);
    });

    function makeInstance() {
        return new SveltePluginView({
            view,
            options: { component: class {} as any },
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

    it('context.view is a Svelte writable store', () => {
        const pv = makeInstance();
        expect(isWritableStore(pv.context.view)).toBe(true);
    });

    it('context.prevState is a Svelte writable store', () => {
        const pv = makeInstance();
        expect(isWritableStore(pv.context.prevState)).toBe(true);
    });

    it('context.view store holds the initial editor view', () => {
        const pv = makeInstance();
        expect(get(pv.context.view)).toBe(view);
    });

    it('updateContext pushes new view and prevState into the stores', () => {
        const pv = makeInstance();
        const newView = makeMockView();
        const prevState = { doc: null } as any;
        pv.update(newView, prevState);
        pv.updateContext();
        expect(get(pv.context.view)).toBe(newView);
        expect(get(pv.context.prevState)).toBe(prevState);
    });

    it('context object reference is stable', () => {
        const pv = makeInstance();
        const ctxRef = pv.context;
        pv.updateContext();
        expect(pv.context).toBe(ctxRef);
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const pv = new SveltePluginView({ view, options: { component: class {} as any, destroy } });
        pv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// SvelteWidgetView
// ---------------------------------------------------------------------------

describe('SvelteWidgetView', () => {
    function makeInstance(pos = 5) {
        return new SvelteWidgetView({
            pos,
            options: { as: 'span', component: class {} as any },
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

    it('context.view is undefined before bind', () => {
        const wv = makeInstance();
        expect(wv.context.view).toBeUndefined();
    });

    it('context fields are plain values (not stores)', () => {
        const wv = makeInstance();
        expect(isWritableStore(wv.context.view)).toBe(false);
        expect(isWritableStore(wv.context.getPos)).toBe(false);
    });

    it('updateContext syncs view and getPos after bind', () => {
        const mockView = makeMockView();
        const getPosFn = vi.fn().mockReturnValue(3);
        const wv = makeInstance();
        wv.bind(mockView, getPosFn);
        wv.updateContext();
        expect(wv.context.view).toBe(mockView);
        expect(typeof wv.context.getPos).toBe('function');
    });

    it('dom has data-widget-view-root', () => {
        const wv = makeInstance();
        expect(wv.dom.getAttribute('data-widget-view-root')).toBe('true');
    });

    it('pos is stored correctly', () => {
        const wv = makeInstance(55);
        expect(wv.pos).toBe(55);
    });
});

