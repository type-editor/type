import type {MarkViewConstructor, PmEditorView} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';
import type {InjectionKey, ShallowRef, VNodeRef} from 'vue';
import {inject} from 'vue';

import type {VueMarkViewUserOptions} from './VueMarkViewOptions';

/** Reactive context provided to Vue mark view components via `inject`. */
export interface MarkViewContext {
    // won't change
    /** Ref callback – attach this to the element that should host editable content. */
    contentRef: VNodeRef
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Shallow ref to the ProseMirror mark rendered by this view. */
    mark: ShallowRef<Mark>
}

/** Injection key for the {@link MarkViewContext}. */
export const markViewContext: InjectionKey<Readonly<MarkViewContext>> = Symbol('[ProsemirrorAdapter]markViewContext');

/** Returns the mark view context from the nearest provider. */
export function useMarkViewContext(): Readonly<MarkViewContext> {
    return inject(markViewContext);
}

/** Factory function type that creates a ProseMirror mark view constructor from user options. */
export type MarkViewFactory = (options: VueMarkViewUserOptions) => MarkViewConstructor

/** Injection key for the {@link MarkViewFactory}. */
export const markViewFactoryKey: InjectionKey<MarkViewFactory> = Symbol('[ProsemirrorAdapter]useMarkViewFactory');

/** Returns the mark view factory from the nearest provider. */
export function useMarkViewFactory(): MarkViewFactory {
    return inject(markViewFactoryKey);
}
