import type {DecorationSource, PmDecoration} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';
import type {Mapping} from '@type-editor/transform';

import {AbstractDecorationSource} from './AbstractDecorationSource';
import {DecorationSet} from './DecorationSet';


/**
 * An abstraction that allows the code dealing with decorations to
 * treat multiple DecorationSet objects as if it were a single object
 * with (a subset of) the same interface. This is used when multiple
 * decoration sources need to be combined.
 *
 * DecorationGroup is used internally when multiple plugins provide
 * decorations for the same view. It efficiently combines multiple
 * decoration sets without merging them into a single set, which allows
 * for better performance when mapping through changes.
 *
 * @internal
 */
export class DecorationGroup extends AbstractDecorationSource implements DecorationSource {

    /** Array of decoration sets that make up this group */
    private readonly members: ReadonlyArray<DecorationSet>;

    /**
     * Creates a new decoration group from multiple decoration sets.
     *
     * @param members - Array of decoration sets to group together
     */
    constructor (members: ReadonlyArray<DecorationSet>) {
        super();
        this.members = members;
    }

    /**
     * Map all decoration sets in this group through document changes.
     *
     * @param mapping - The mapping representing document changes
     * @param doc - The updated document node
     * @returns A new decoration source with mapped decorations
     */
    public map(mapping: Mapping, doc: Node): DecorationSource {
        const mappedDecos: Array<DecorationSet> = this.members.map(
            (member: DecorationSet): DecorationSet => {
                return member.map(mapping, doc, DecorationGroup.EMPTY_DECORATION_WIDGET_OPTIONS);
            }
        );
        return DecorationGroup.from(mappedDecos);
    }

    /**
     * Get decorations relevant for a child node from all sets in the group.
     *
     * @param offset - The offset position of the child node
     * @param child - The child node
     * @returns A decoration source for the child node
     */
    public forChild(offset: number, child: Node): DecorationSource | DecorationSet {
        if (child.isLeaf) {
            return DecorationSet.empty;
        }

        let found: Array<DecorationSet> = [];

        for (const item of this.members) {
            const result: DecorationSet | DecorationGroup = item.forChild(offset, child);
            if (result === DecorationSet.empty) {
                continue;
            }

            if (result instanceof DecorationGroup) {
                // Flatten nested groups
                found = found.concat(result.members);
            } else {
                found.push(result);
            }
        }
        return DecorationGroup.from(found);
    }

    /**
     * Check if this decoration group is equal to another.
     *
     * @param other - The decoration group to compare with
     * @returns True if the groups are equal
     */
    public eq(other: DecorationGroup): boolean {
        if (!(other instanceof DecorationGroup) || other.members.length !== this.members.length) {
            return false;
        }

        for (let i = 0; i < this.members.length; i++) {
            if (!this.members[i].eq(other.members[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get all local decorations from all sets in the group, with overlaps removed.
     *
     * @param node - The node to get decorations for
     * @returns Array of decorations with overlaps removed
     */
    public locals(node: Node): ReadonlyArray<PmDecoration> {
        let result: Array<PmDecoration> | undefined;
        let needsSorting = false;

        for (const item of this.members) {
            const locals: ReadonlyArray<PmDecoration> = item.localsInner(node);
            if (!locals.length) {
                continue;
            }

            if (!result) {
                result = locals as Array<PmDecoration>;
            } else {
                // Need to merge with existing results - make a mutable copy if this is the second set
                if (!needsSorting) {
                    result = result.slice();
                    needsSorting = true;
                }

                for (const decoration of locals) {
                    result.push(decoration);
                }
            }
        }

        if (!result) {
            return [];
        }

        // Sort if we merged multiple sets
        if (needsSorting) {
            DecorationGroup.sortDecorations(result);
        }

        return this.removeOverlap(result);
    }


    /**
     * Create a group for the given array of decoration sources, or return
     * a single set when possible. This factory method handles flattening
     * nested groups and optimizes for common cases.
     *
     * This method automatically optimizes the result:
     * - Returns empty set if no members
     * - Returns the single member if only one
     * - Flattens nested groups into a single level
     *
     * @param members - Array of decoration sources (DecorationSet or DecorationGroup instances) to group
     * @returns A decoration source (may be empty set, single set, or flattened group)
     */
    static from(members: ReadonlyArray<DecorationSource>): DecorationSource {
        switch (members.length) {
            case 0:
                return DecorationSet.empty;
            case 1:
                return members[0];
            default: {
                // Check if all members are already DecorationSets
                const allAreDecorationSet: boolean = members.every(
                    decorationSource => decorationSource instanceof DecorationSet
                );
                if (allAreDecorationSet) {
                    return new DecorationGroup(members as Array<DecorationSet>);
                }

                // Flatten any nested groups into a flat array of DecorationSets
                const flattenedSets: Array<DecorationSet> = members.reduce<Array<DecorationSet>>(
                    (result, decorationSource) => {
                        if (decorationSource instanceof DecorationSet) {
                            result.push(decorationSource);
                        } else {
                            result.push(...(decorationSource as DecorationGroup).members);
                        }
                        return result;
                    },
                    []
                );
                return new DecorationGroup(flattenedSets);
            }
        }
    }

    /**
     * Iterate over all decoration sets in this group, calling the callback
     * for each one.
     *
     * @param callbackFunc - Function to call with each decoration set
     */
    public forEachSet(callbackFunc: (set: DecorationSet) => void): void {
        for (const item of this.members) {
            item.forEachSet(callbackFunc);
        }
    }
}
