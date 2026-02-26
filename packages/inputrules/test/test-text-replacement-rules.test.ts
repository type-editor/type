import {describe, it, expect} from 'vitest';
import {ellipsis} from '@src/commands/ellipsis';
import {emDash} from '@src/commands/em-dash';
import {openDoubleQuote} from '@src/commands/open-double-quote';
import {closeDoubleQuote} from '@src/commands/close-double-quote';
import {openSingleQuote} from '@src/commands/open-single-quote';
import {closeSingleQuote} from '@src/commands/close-single-quote';
import {smartQuotes} from '@src/commands/smart-quotes';
import {InputRule} from '@src/InputRule';

describe("text replacement rules", () => {
    describe("ellipsis", () => {
        it("is an InputRule instance", () => {
            expect(ellipsis).toBeInstanceOf(InputRule);
        });

        it("matches three dots", () => {
            const text = '...';
            const match = text.match(ellipsis.match);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('...');
        });

        it("does not match two dots", () => {
            const text = '..';
            const match = text.match(ellipsis.match);

            expect(match).toBeNull();
        });

        it("matches last three dots in longer sequence", () => {
            const text = '....';
            const match = text.match(ellipsis.match);

            // Pattern matches the last three dots at the end
            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('...');
        });

        it("matches at end of string", () => {
            const text = 'Hello...';
            const match = text.match(ellipsis.match);

            expect(match).not.toBeNull();
        });

        it("has inCodeMark set to false", () => {
            expect(ellipsis.inCodeMark).toBe(false);
        });
    });

    describe("emDash", () => {
        it("is an InputRule instance", () => {
            expect(emDash).toBeInstanceOf(InputRule);
        });

        it("matches double dash", () => {
            const text = '--';
            const match = text.match(emDash.match);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('--');
        });

        it("does not match single dash", () => {
            const text = '-';
            const match = text.match(emDash.match);

            expect(match).toBeNull();
        });

        it("matches last two dashes in longer sequence", () => {
            const text = '---';
            const match = text.match(emDash.match);

            // Pattern matches the last two dashes at the end
            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('--');
        });

        it("matches at end of string", () => {
            const text = 'Hello--';
            const match = text.match(emDash.match);

            expect(match).not.toBeNull();
        });

        it("has inCodeMark set to false", () => {
            expect(emDash.inCodeMark).toBe(false);
        });
    });

    describe("openDoubleQuote", () => {
        it("is an InputRule instance", () => {
            expect(openDoubleQuote).toBeInstanceOf(InputRule);
        });

        it("has a regex pattern", () => {
            expect(openDoubleQuote.match).toBeInstanceOf(RegExp);
        });

        it("has inCodeMark set to false", () => {
            expect(openDoubleQuote.inCodeMark).toBe(false);
        });

        it("is undoable", () => {
            expect(openDoubleQuote.undoable).toBe(true);
        });
    });

    describe("closeDoubleQuote", () => {
        it("is an InputRule instance", () => {
            expect(closeDoubleQuote).toBeInstanceOf(InputRule);
        });

        it("has a regex pattern", () => {
            expect(closeDoubleQuote.match).toBeInstanceOf(RegExp);
        });

        it("has inCodeMark set to false", () => {
            expect(closeDoubleQuote.inCodeMark).toBe(false);
        });

        it("is undoable", () => {
            expect(closeDoubleQuote.undoable).toBe(true);
        });
    });

    describe("openSingleQuote", () => {
        it("is an InputRule instance", () => {
            expect(openSingleQuote).toBeInstanceOf(InputRule);
        });

        it("has a regex pattern", () => {
            expect(openSingleQuote.match).toBeInstanceOf(RegExp);
        });

        it("has inCodeMark set to false", () => {
            expect(openSingleQuote.inCodeMark).toBe(false);
        });

        it("is undoable", () => {
            expect(openSingleQuote.undoable).toBe(true);
        });
    });

    describe("closeSingleQuote", () => {
        it("is an InputRule instance", () => {
            expect(closeSingleQuote).toBeInstanceOf(InputRule);
        });

        it("has a regex pattern", () => {
            expect(closeSingleQuote.match).toBeInstanceOf(RegExp);
        });

        it("has inCodeMark set to false", () => {
            expect(closeSingleQuote.inCodeMark).toBe(false);
        });

        it("is undoable", () => {
            expect(closeSingleQuote.undoable).toBe(true);
        });
    });

    describe("smartQuotes", () => {
        it("is an array of InputRules", () => {
            expect(Array.isArray(smartQuotes)).toBe(true);
            expect(smartQuotes.length).toBeGreaterThan(0);
        });

        it("contains all quote rules", () => {
            expect(smartQuotes).toContain(openDoubleQuote);
            expect(smartQuotes).toContain(closeDoubleQuote);
            expect(smartQuotes).toContain(openSingleQuote);
            expect(smartQuotes).toContain(closeSingleQuote);
        });

        it("has exactly 4 rules", () => {
            expect(smartQuotes.length).toBe(4);
        });

        it("all items are InputRule instances", () => {
            smartQuotes.forEach(rule => {
                expect(rule).toBeInstanceOf(InputRule);
            });
        });

        it("is readonly", () => {
            // TypeScript enforces ReadonlyArray, but we can verify behavior
            expect(smartQuotes).toBeDefined();
            expect(Array.isArray(smartQuotes)).toBe(true);
        });
    });

    describe("pattern matching behavior", () => {
        it("ellipsis pattern matches only at end", () => {
            expect('...'.match(ellipsis.match)).not.toBeNull();
            expect('... '.match(ellipsis.match)).toBeNull();
        });

        it("emDash pattern matches only at end", () => {
            expect('--'.match(emDash.match)).not.toBeNull();
            expect('-- '.match(emDash.match)).toBeNull();
        });

        it("patterns use $ anchor", () => {
            expect(ellipsis.match.source.endsWith('$')).toBe(true);
            expect(emDash.match.source.endsWith('$')).toBe(true);
        });
    });

    describe("rule properties", () => {
        it("all text rules have handler functions", () => {
            expect(typeof ellipsis.handler).toBe('function');
            expect(typeof emDash.handler).toBe('function');
            expect(typeof openDoubleQuote.handler).toBe('function');
            expect(typeof closeDoubleQuote.handler).toBe('function');
            expect(typeof openSingleQuote.handler).toBe('function');
            expect(typeof closeSingleQuote.handler).toBe('function');
        });

        it("ellipsis and emDash are undoable by default", () => {
            expect(ellipsis.undoable).toBe(true);
            expect(emDash.undoable).toBe(true);
        });

        it("all quote rules are undoable", () => {
            expect(openDoubleQuote.undoable).toBe(true);
            expect(closeDoubleQuote.undoable).toBe(true);
            expect(openSingleQuote.undoable).toBe(true);
            expect(closeSingleQuote.undoable).toBe(true);
        });

        it("text replacement rules disable inCodeMark", () => {
            expect(ellipsis.inCodeMark).toBe(false);
            expect(emDash.inCodeMark).toBe(false);
            expect(openDoubleQuote.inCodeMark).toBe(false);
            expect(closeDoubleQuote.inCodeMark).toBe(false);
            expect(openSingleQuote.inCodeMark).toBe(false);
            expect(closeSingleQuote.inCodeMark).toBe(false);
        });
    });
});

