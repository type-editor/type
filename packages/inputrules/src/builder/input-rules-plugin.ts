import type {PmEditorState, PmEditorView, PmPlugin} from '@type-editor/editor-types';
import type {Mark, Node, ResolvedPos} from '@type-editor/model';
import {Plugin, type Transaction} from '@type-editor/state';

import type {InputRule} from '../InputRule';
import type {PluginState} from '../types/PluginState';

/**
 * Create an input rules plugin. When enabled, it will cause text
 * input that matches any of the given rules to trigger the rule's
 * action.
 *
 * @param config - Configuration object containing the rules array
 * @param config.rules - Array of input rules to apply
 * @returns A ProseMirror plugin that handles input rule matching and application
 */
export function inputRulesPlugin({rules}: { rules: ReadonlyArray<InputRule> }): PmPlugin<PluginState> {
    const plugin: Plugin<PluginState> = new Plugin<PluginState>({
        state: {
            init(): PluginState {
                return null;
            },
            apply(transaction: Transaction, prev: PluginState): PluginState {
                const stored = transaction.getMeta(plugin) as PluginState;
                if (stored) {
                    return stored;
                }
                // Clear state if selection changed or document was modified
                return transaction.selectionSet || transaction.docChanged ? null : prev;
            }
        },

        props: {
            handleTextInput(view: PmEditorView, from: number, to: number, text: string): boolean {
                return applyInputRules(view, from, to, text, rules, plugin);
            },
            handleDOMEvents: {
                compositionend: (view: PmEditorView): boolean => {
                    // Check rules after composition ends (for IME input)
                    setTimeout(() => {
                        // Check if view is still valid
                        if (!view.docView) {
                            return false;
                        }
                        const {$cursor} = view.state.selection;
                        if ($cursor) {
                            return applyInputRules(view, $cursor.pos, $cursor.pos, '', rules, plugin);
                        }
                    });
                    return false;
                }
            }
        },
        isInputRules: true
    });
    return plugin;
}



/**
 * Maximum number of characters to look back when matching input rules.
 * This prevents performance issues with very long text nodes.
 */
const MAX_MATCH = 500;

/**
 * Attempts to match and apply input rules to the current text input.
 *
 * @param view - The editor view
 * @param from - Start position of the text input
 * @param to - End position of the text input
 * @param text - The text that was input
 * @param rules - Array of input rules to check
 * @param plugin - The input rules plugin instance
 * @returns `true` if a rule was applied, `false` otherwise
 */
function applyInputRules(view: PmEditorView,
                         from: number,
                         to: number,
                         text: string,
                         rules: ReadonlyArray<InputRule>,
                         plugin: Plugin): boolean {
    // Don't apply rules during composition (IME input)
    if (view.composing) {
        return false;
    }

    const state: PmEditorState = view.state;
    const $from: ResolvedPos = state.doc.resolve(from);

    // Get text before cursor, limited to MAX_MATCH characters
    const textBefore: string = $from.parent.textBetween(
        Math.max(0, $from.parentOffset - MAX_MATCH),
        $from.parentOffset,
        null,
        '\ufffc'
    ) + text;

    for (const rule of rules) {
        // Check if rule should be skipped based on context
        if (shouldSkipRuleForCodeMarks(rule, $from)) {
            continue;
        }

        if (shouldSkipRuleForCodeNodes(rule, $from)) {
            continue;
        }

        // Try to match the rule
        // Reset lastIndex to prevent issues with global regexes
        rule.match.lastIndex = 0;
        const match: RegExpExecArray = rule.match.exec(textBefore);
        if (!match || match[0].length < text.length) {
            continue;
        }

        // Calculate the actual start position of the match
        const matchStart: number = from - (match[0].length - text.length);

        // Additional check for code marks in the matched range
        // This is an expensive operation, so we only do it if necessary
        if (!rule.inCodeMark && hasCodeMarksInRange(state, matchStart, to)) {
            continue;
        }

        // Apply the rule handler
        const transaction: Transaction | null = rule.handler(state, match, matchStart, to);
        if (!transaction) {
            continue;
        }

        // Store state for undo if the rule is undoable
        if (rule.undoable) {
            transaction.setMeta(plugin, {
                transform: transaction,
                from,
                to,
                text
            });
        }

        view.dispatch(transaction);
        return true;
    }

    return false;
}

/**
 * Checks if a rule should be skipped based on code mark context.
 *
 * @param rule - The input rule to check
 * @param $from - The resolved position in the document
 * @returns `true` if the rule should be skipped, `false` otherwise
 */
function shouldSkipRuleForCodeMarks(rule: InputRule, $from: ResolvedPos): boolean {
    if (rule.inCodeMark) {
        return false;
    }
    return $from.marks().some((mark: Mark): boolean => mark.type.spec.code);
}

/**
 * Checks if a rule should be skipped based on code node context.
 *
 * @param rule - The input rule to check
 * @param $from - The resolved position in the document
 * @returns `true` if the rule should be skipped, `false` otherwise
 */
function shouldSkipRuleForCodeNodes(rule: InputRule, $from: ResolvedPos): boolean {
    const isInCodeNode: boolean = $from.parent.type.spec.code;

    if (isInCodeNode) {
        return !rule.inCode;
    }

    return rule.inCode === 'only';
}

/**
 * Checks if there are any code marks in the specified range.
 *
 * @param state - The current editor state
 * @param from - Start position
 * @param to - End position
 * @returns `true` if code marks are found in the range, `false` otherwise
 */
function hasCodeMarksInRange(state: PmEditorState, from: number, to: number): boolean {
    let hasCodeMark = false;

    state.doc.nodesBetween(from, to, (node: Node): boolean => {
        if (node.isInline && node.marks.some((mark: Mark): boolean => mark.type.spec.code)) {
            hasCodeMark = true;
            return false; // Stop iteration
        }
        return true;
    });

    return hasCodeMark;
}
