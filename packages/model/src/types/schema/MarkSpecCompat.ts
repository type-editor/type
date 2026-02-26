import type {Mark} from '../../elements/Mark';
import type {DOMOutputSpec} from '../dom-parser/DOMOutputSpec';
import type {ParseRule} from '../dom-parser/ParseRule';
import type {AttributeSpecCompat} from './AttributeSpecCompat';

/**
 * Used to define marks when creating a schema.
 */
export interface MarkSpecCompat {

    /**
     * The attributes that marks of this type get.
     */
    attrs?: Record<string, AttributeSpecCompat>;

    /**
     * Whether this mark should be active when the cursor is positioned
     * at its end (or at its start when that is also the start of the
     * parent node). Defaults to true.
     */
    inclusive?: boolean;

    /**
     * Determines which other marks this mark can coexist with. Should
     * be a space-separated strings naming other marks or groups of marks.
     * When a mark is [added](#model.Mark.addToSet) to a set, all marks
     * that it excludes are removed in the process. If the set contains
     * any mark that excludes the new mark but is not, itself, excluded
     * by the new mark, the mark can not be added an the set. You can
     * use the value `'_'` to indicate that the mark excludes all
     * marks in the schema.
     *
     * Defaults to only being exclusive with marks of the same type. You
     * can set it to an empty string (or any string not containing the
     * mark's own name) to allow multiple marks of a given type to
     * coexist (as long as they have different attributes).
     */
    excludes?: string;

    /**
     * The group or space-separated groups to which this mark belongs.
     */
    group?: string;

    /**
     * Determines whether marks of this type can span multiple adjacent
     * nodes when serialized to DOM/HTML. Defaults to true.
     */
    spanning?: boolean;

    /**
     * Marks the content of this span as being code, which causes some
     * commands and extensions to treat it differently.
     */
    code?: boolean;


    /**
     * Defines the default way marks of this type should be serialized
     * to DOM/HTML. When the resulting spec contains a hole, that is
     * where the marked content is placed. Otherwise, it is appended to
     * the top node.
     *
     * @param mark - The mark to be serialized
     * @param inline - Whether the mark is being applied to inline content
     * @returns A DOM output specification describing how to render the mark
     */
    toDOM?: (mark: Mark, inline: boolean) => DOMOutputSpec;

    /**
     * Associates DOM parser information with this mark (see the
     * corresponding [node spec field](#model.NodeSpec.parseDOM)). The
     * `mark` field in the rules is implied.
     */
    parseDOM?: ReadonlyArray<ParseRule>;


    /**
     * Mark specs can include additional properties that can be
     * inspected through [`MarkType.spec`](#model.MarkType.spec) when
     * working with the mark.
     */
    // TODO: use Map instead
    [key: string]: any;
}
