/**
 * Unit tests for @type-editor/adapter-vue
 *
 * Tests focus on class-level behaviour (reactive context shape, lifecycle,
 * DOM) — no Vue rendering is triggered.
 *
 * Tests cover:
 *   - VueNodeView
 *   - VueMarkView
 *   - VuePluginView
 *   - VueWidgetView
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isRef } from 'vue';
import { schema, setupJSDOMMocks } from '@type-editor/test-builder';

import { VueNodeView } from '@src/nodeView/VueNodeView';
import { VueMarkView } from '@src/markView/VueMarkView';
import { VuePluginView } from '@src/pluginView/VuePluginView';
import { VueWidgetView } from '@src/widgetView/VueWidgetView';

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

function makeBlockNode() {
    return schema.node('paragraph', null, [schema.text('hello')]);
}

function makeEmMark() {
    return schema.mark('em');
}

const emptyInnerDecorations = { find: vi.fn() } as any;

// ---------------------------------------------------------------------------
// VueNodeView
// ---------------------------------------------------------------------------

describe('VueNodeView', () => {
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        view = makeMockView();
    });

    function makeInstance() {
        const node = makeBlockNode();
        return new VueNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: {} as any },
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

    it('context.node is a shallowRef', () => {
        const nv = makeInstance();
        expect(isRef(nv.context.node)).toBe(true);
    });

    it('context.selected is a shallowRef', () => {
        const nv = makeInstance();
        expect(isRef(nv.context.selected)).toBe(true);
    });

    it('context.decorations is a shallowRef', () => {
        const nv = makeInstance();
        expect(isRef(nv.context.decorations)).toBe(true);
    });

    it('context.innerDecorations is a shallowRef', () => {
        const nv = makeInstance();
        expect(isRef(nv.context.innerDecorations)).toBe(true);
    });

    it('context.node.value equals the initial node', () => {
        const node = makeBlockNode();
        const nv = new VueNodeView({
            node,
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: {} as any },
        });
        expect(nv.context.node.value).toBe(node);
    });

    it('context.selected.value is false initially', () => {
        const nv = makeInstance();
        expect(nv.context.selected.value).toBe(false);
    });

    it('updateContext mutates the ref values in-place', () => {
        const nv = makeInstance();
        const nodeRef = nv.context.node;
        const newNode = makeBlockNode();
        nv['node'] = newNode;
        nv['selected'] = true;
        nv.updateContext();
        expect(nv.context.node).toBe(nodeRef); // same ref object
        expect(nv.context.node.value).toBe(newNode);
        expect(nv.context.selected.value).toBe(true);
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

    it('render returns a Vue component (object with a setup function)', () => {
        const nv = makeInstance();
        const component = nv.render();
        expect(typeof component).toBe('object');
        expect(component).not.toBeNull();
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const nv = new VueNodeView({
            node: makeBlockNode(),
            view,
            getPos: () => 0,
            decorations: [],
            innerDecorations: emptyInnerDecorations,
            options: { component: {} as any, destroy },
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
// VueMarkView
// ---------------------------------------------------------------------------

describe('VueMarkView', () => {
    let view: ReturnType<typeof makeMockView>;
    let mark: ReturnType<typeof makeEmMark>;

    beforeEach(() => {
        view = makeMockView();
        mark = makeEmMark();
    });

    function makeInstance() {
        return new VueMarkView({
            mark,
            view,
            inline: true,
            options: { component: {} as any },
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

    it('context.mark is a shallowRef', () => {
        const mv = makeInstance();
        expect(isRef(mv.context.mark)).toBe(true);
    });

    it('context.mark.value equals the initial mark', () => {
        const mv = makeInstance();
        expect(mv.context.mark.value).toBe(mark);
    });

    it('context.view is the editor view (not a ref)', () => {
        const mv = makeInstance();
        expect(isRef(mv.context.view)).toBe(false);
        expect(mv.context.view).toBe(view);
    });

    it('updateContext updates the mark ref value', () => {
        const newMark = schema.mark('strong');
        const mv = new VueMarkView({
            mark: newMark,
            view,
            inline: true,
            options: { component: {} as any },
        });
        // The context ref is populated with the new mark on construction
        expect(mv.context.mark.value).toBe(newMark);
        // Now verify updateContext keeps the ref in sync
        mv.updateContext();
        expect(mv.context.mark.value).toBe(newMark);
    });

    it('dom has data-mark-view-root', () => {
        const mv = makeInstance();
        expect(mv.dom.getAttribute('data-mark-view-root')).toBe('true');
    });

    it('render returns a Vue component', () => {
        const mv = makeInstance();
        const component = mv.render();
        expect(typeof component).toBe('object');
        expect(component).not.toBeNull();
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const mv = new VueMarkView({ mark, view, inline: true, options: { component: {} as any, destroy } });
        mv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// VuePluginView
// ---------------------------------------------------------------------------

describe('VuePluginView', () => {
    let container: HTMLDivElement;
    let view: ReturnType<typeof makeMockView>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        view = makeMockView(container);
    });

    function makeInstance() {
        return new VuePluginView({
            view,
            options: { component: {} as any },
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

    it('context.view is a shallowRef', () => {
        const pv = makeInstance();
        expect(isRef(pv.context.view)).toBe(true);
    });

    it('context.prevState is a shallowRef', () => {
        const pv = makeInstance();
        expect(isRef(pv.context.prevState)).toBe(true);
    });

    it('context.view.value equals the initial editor view', () => {
        const pv = makeInstance();
        expect(pv.context.view.value).toBe(view);
    });

    it('updateContext shallow-clones the view into the ref', () => {
        const pv = makeInstance();
        const newView = makeMockView();
        const prevState = { doc: null } as any;
        pv.update(newView, prevState);
        pv.updateContext();
        // The ref value should be a clone of newView (not the exact same reference)
        // but it must carry the same properties
        expect(pv.context.view.value.dom).toBe(newView.dom);
        expect(pv.context.prevState.value).toBe(prevState);
    });

    it('context object reference is stable', () => {
        const pv = makeInstance();
        const ctxRef = pv.context;
        pv.updateContext();
        expect(pv.context).toBe(ctxRef);
    });

    it('render returns a Vue component', () => {
        const pv = makeInstance();
        const component = pv.render();
        expect(typeof component).toBe('object');
        expect(component).not.toBeNull();
    });

    it('destroy calls options.destroy', () => {
        const destroy = vi.fn();
        const pv = new VuePluginView({ view, options: { component: {} as any, destroy } });
        pv.destroy();
        expect(destroy).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// VueWidgetView
// ---------------------------------------------------------------------------

describe('VueWidgetView', () => {
    function makeInstance(pos = 5) {
        return new VueWidgetView({
            pos,
            options: { as: 'span', component: {} as any },
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

    it('updateContext syncs view and getPos after bind', () => {
        const mockView = makeMockView();
        const getPosFn = vi.fn().mockReturnValue(3);
        const wv = makeInstance();
        wv.bind(mockView, getPosFn);
        wv.updateContext();
        expect(wv.context.view).toBe(mockView);
        expect(typeof wv.context.getPos).toBe('function');
    });

    it('context.view and context.getPos are NOT refs (plain values)', () => {
        const wv = makeInstance();
        expect(isRef(wv.context.view)).toBe(false);
        expect(isRef(wv.context.getPos)).toBe(false);
    });

    it('dom has data-widget-view-root', () => {
        const wv = makeInstance();
        expect(wv.dom.getAttribute('data-widget-view-root')).toBe('true');
    });

    it('pos is stored correctly', () => {
        const wv = makeInstance(77);
        expect(wv.pos).toBe(77);
    });

    it('render returns a Vue component', () => {
        const wv = makeInstance();
        const component = wv.render();
        expect(typeof component).toBe('object');
        expect(component).not.toBeNull();
    });
});

