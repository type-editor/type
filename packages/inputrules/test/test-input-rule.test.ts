import {describe, it, expect} from 'vitest';
import {InputRule} from '@src/InputRule';
import {EditorState} from '@type-editor/state';
import {schema, doc, p} from '@type-editor/test-builder';

describe("InputRule", () => {
    describe("constructor", () => {
        it("creates a rule with regex pattern and string handler", () => {
            const rule = new InputRule(/test$/, 'replacement');

            expect(rule).toBeInstanceOf(InputRule);
            expect(rule.match).toBeInstanceOf(RegExp);
            expect(typeof rule.handler).toBe('function');
        });

        it("creates a rule with regex pattern and function handler", () => {
            const handler = () => null;
            const rule = new InputRule(/test$/, handler);

            expect(rule).toBeInstanceOf(InputRule);
            expect(rule.handler).toBe(handler);
        });

        it("sets undoable to true by default", () => {
            const rule = new InputRule(/test$/, 'replacement');

            expect(rule.undoable).toBe(true);
        });

        it("allows undoable to be set to false", () => {
            const rule = new InputRule(/test$/, 'replacement', {undoable: false});

            expect(rule.undoable).toBe(false);
        });

        it("sets inCode to false by default", () => {
            const rule = new InputRule(/test$/, 'replacement');

            expect(rule.inCode).toBe(false);
        });

        it("allows inCode to be set to true", () => {
            const rule = new InputRule(/test$/, 'replacement', {inCode: true});

            expect(rule.inCode).toBe(true);
        });

        it("allows inCode to be set to 'only'", () => {
            const rule = new InputRule(/test$/, 'replacement', {inCode: 'only'});

            expect(rule.inCode).toBe('only');
        });

        it("sets inCodeMark to true by default", () => {
            const rule = new InputRule(/test$/, 'replacement');

            expect(rule.inCodeMark).toBe(true);
        });

        it("allows inCodeMark to be set to false", () => {
            const rule = new InputRule(/test$/, 'replacement', {inCodeMark: false});

            expect(rule.inCodeMark).toBe(false);
        });
    });

    describe("properties", () => {
        it("exposes the match pattern", () => {
            const pattern = /test$/;
            const rule = new InputRule(pattern, 'replacement');

            expect(rule.match).toBe(pattern);
            expect(rule.match.source).toBe('test$');
        });

        it("exposes the handler function", () => {
            const handler = () => null;
            const rule = new InputRule(/test$/, handler);

            expect(rule.handler).toBe(handler);
        });

        it("exposes undoable property", () => {
            const rule1 = new InputRule(/test$/, 'replacement', {undoable: true});
            const rule2 = new InputRule(/test$/, 'replacement', {undoable: false});

            expect(rule1.undoable).toBe(true);
            expect(rule2.undoable).toBe(false);
        });

        it("exposes inCode property", () => {
            const rule1 = new InputRule(/test$/, 'replacement', {inCode: false});
            const rule2 = new InputRule(/test$/, 'replacement', {inCode: true});
            const rule3 = new InputRule(/test$/, 'replacement', {inCode: 'only'});

            expect(rule1.inCode).toBe(false);
            expect(rule2.inCode).toBe(true);
            expect(rule3.inCode).toBe('only');
        });

        it("exposes inCodeMark property", () => {
            const rule1 = new InputRule(/test$/, 'replacement', {inCodeMark: true});
            const rule2 = new InputRule(/test$/, 'replacement', {inCodeMark: false});

            expect(rule1.inCodeMark).toBe(true);
            expect(rule2.inCodeMark).toBe(false);
        });
    });

    describe("string handler", () => {
        it("creates handler that replaces matched text", () => {
            const rule = new InputRule(/test$/, 'replacement');
            const state = EditorState.create({
                doc: doc(p('test')),
                schema
            });

            const match = 'test'.match(/test$/);
            const result = rule.handler(state, match!, 0, 4);

            expect(result).not.toBeNull();
            expect(result).toBeDefined();
        });

        it("handles simple replacement", () => {
            const rule = new InputRule(/\.\.\.$/,  '…');
            const state = EditorState.create({
                doc: doc(p('...')),
                schema
            });

            const text = '...';
            const match = text.match(/\.\.\.$/);
            const result = rule.handler(state, match!, 0, 3);

            expect(result).not.toBeNull();
        });

        it("handles replacement with capture groups", () => {
            const rule = new InputRule(/(test)$/, 'REPLACED');
            const state = EditorState.create({
                doc: doc(p('test')),
                schema
            });

            const text = 'test';
            const match = text.match(/(test)$/);
            const result = rule.handler(state, match!, 0, 4);

            expect(result).not.toBeNull();
        });
    });

    describe("function handler", () => {
        it("calls custom handler function", () => {
            let called = false;
            const handler = () => {
                called = true;
                return null;
            };

            const rule = new InputRule(/test$/, handler);
            const state = EditorState.create({
                doc: doc(p('test')),
                schema
            });

            const match = 'test'.match(/test$/);
            rule.handler(state, match!, 0, 4);

            expect(called).toBe(true);
        });

        it("passes correct parameters to handler", () => {
            let capturedMatch: RegExpMatchArray | null = null;
            let capturedStart: number | null = null;
            let capturedEnd: number | null = null;

            const handler = (state: EditorState, match: RegExpMatchArray, start: number, end: number) => {
                capturedMatch = match;
                capturedStart = start;
                capturedEnd = end;
                return null;
            };

            const rule = new InputRule(/test$/, handler);
            const state = EditorState.create({
                doc: doc(p('test')),
                schema
            });

            const match = 'test'.match(/test$/);
            rule.handler(state, match!, 5, 9);

            expect(capturedMatch).toBe(match);
            expect(capturedStart).toBe(5);
            expect(capturedEnd).toBe(9);
        });

        it("returns transaction from handler", () => {
            const handler = (state: EditorState) => {
                return state.tr.insertText('inserted');
            };

            const rule = new InputRule(/test$/, handler);
            const state = EditorState.create({
                doc: doc(p('test')),
                schema
            });

            const match = 'test'.match(/test$/);
            const result = rule.handler(state, match!, 0, 4);

            expect(result).not.toBeNull();
            expect(result?.steps.length).toBeGreaterThan(0);
        });
    });

    describe("regex patterns", () => {
        it("matches pattern ending with $", () => {
            const rule = new InputRule(/test$/, 'replacement');

            expect('test'.match(rule.match)).not.toBeNull();
            expect('testing'.match(rule.match)).toBeNull();
        });

        it("works with complex patterns", () => {
            const rule = new InputRule(/^>\s$/, 'blockquote');

            expect('> '.match(rule.match)).not.toBeNull();
            expect('>'.match(rule.match)).toBeNull();
        });

        it("supports capture groups", () => {
            const rule = new InputRule(/(hello)\s(world)$/, 'replacement');
            const match = 'hello world'.match(rule.match);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('hello');
            expect(match?.[2]).toBe('world');
        });
    });

    describe("options combinations", () => {
        it("handles all options set to false", () => {
            const rule = new InputRule(/test$/, 'replacement', {
                undoable: false,
                inCode: false,
                inCodeMark: false
            });

            expect(rule.undoable).toBe(false);
            expect(rule.inCode).toBe(false);
            expect(rule.inCodeMark).toBe(false);
        });

        it("handles all options set to true", () => {
            const rule = new InputRule(/test$/, 'replacement', {
                undoable: true,
                inCode: true,
                inCodeMark: true
            });

            expect(rule.undoable).toBe(true);
            expect(rule.inCode).toBe(true);
            expect(rule.inCodeMark).toBe(true);
        });

        it("handles mixed options", () => {
            const rule = new InputRule(/test$/, 'replacement', {
                undoable: true,
                inCode: 'only',
                inCodeMark: false
            });

            expect(rule.undoable).toBe(true);
            expect(rule.inCode).toBe('only');
            expect(rule.inCodeMark).toBe(false);
        });
    });
});

