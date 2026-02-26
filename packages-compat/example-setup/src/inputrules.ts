import {ellipsis, emDash, inputRules, smartQuotes, textblockTypeInputRule, wrappingInputRule} from '@type-editor-compat/inputrules';
import {type NodeType, Schema} from '@type-editor-compat/model';


/**
 * Given a blockquote node type, returns an input rule that turns `"> "`
 * at the start of a textblock into a blockquote.
 *
 * @param nodeType
 */
export function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

/**
 * Given a list node type, returns an input rule that turns a number
 * followed by a dot at the start of a textblock into an ordered list.
 *
 * @param nodeType
 */
export function orderedListRule(nodeType: NodeType) {
  return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({order: +match[1]}),
                           (match, node) => node.childCount + Number(node.attrs.order) === Number(match[1]));
}

/**
 * Given a list node type, returns an input rule that turns a bullet
 * (dash, plush, or asterisk) at the start of a textblock into a
 * bullet list.
 *
 * @param nodeType
 */
export function bulletListRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

/**
 * Given a code block node type, returns an input rule that turns a
 * textblock starting with three backticks into a code block.
 *
 * @param nodeType
 */
export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

/**
 * Given a node type and a maximum level, creates an input rule that
 * turns up to that number of `#` characters followed by a space at
 * the start of a textblock into a heading whose level corresponds to
 * the number of `#` signs.
 *
 * @param nodeType
 * @param maxLevel
 */
export function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(new RegExp(`^(#{1,${maxLevel}})\\s$`),
                                nodeType, match => ({level: match[1].length}));
}

/**
 * A set of input rules for creating the basic block quotes, lists,
 * code blocks, and heading.
 *
 * @param schema
 */
export function buildInputRules(schema: Schema) {
  const rules = smartQuotes.concat(ellipsis, emDash);
  if (schema.nodes.blockquote) {rules.push(blockQuoteRule(schema.nodes.blockquote));}
  if (schema.nodes.ordered_list) {rules.push(orderedListRule(schema.nodes.ordered_list));}
  if (schema.nodes.bullet_list) {rules.push(bulletListRule(schema.nodes.bullet_list));}
  if (schema.nodes.code_block) {rules.push(codeBlockRule(schema.nodes.code_block));}
  if (schema.nodes.heading) {rules.push(headingRule(schema.nodes.heading, 6));}
  return inputRules({rules});
}
