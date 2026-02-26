

/**
 * Configuration options for input rules.
 */
export interface InputRuleOptions {
    /**
     * When set to false, the undoInputRule command will not work on this rule.
     * Defaults to `true`.
     *
     * @defaultValue true
     */
    undoable?: boolean;

    /**
     * Controls whether the rule applies inside code nodes.
     * - `false` (default): Rule will not apply in code nodes
     * - `true`: Rule will apply everywhere, including code nodes
     * - `'only'`: Rule will only apply in code nodes
     *
     * @defaultValue false
     */
    inCode?: boolean | 'only';

    /**
     * Controls whether the rule applies inside code marks.
     * - `false`: Rule will not fire inside marks marked as code
     * - `true` (default): Rule will fire inside code marks
     *
     * @defaultValue true
     */
    inCodeMark?: boolean;
}
