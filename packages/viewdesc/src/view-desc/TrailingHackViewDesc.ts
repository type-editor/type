import {ViewDesc} from './ViewDesc';
import {ViewDescType} from './ViewDescType';
import {ViewDirtyState} from './ViewDirtyState';


/**
 * A dummy desc used to tag trailing BR or IMG nodes created to work
 * around contentEditable terribleness.
 *
 * Browsers behave inconsistently with empty block elements or blocks ending
 * without proper line breaks. These hack nodes ensure proper cursor placement
 * and visual representation:
 * - BR: Makes empty blocks or block ends properly display and accept cursor
 * - IMG: Used as a separator in some cases to work around browser bugs
 */
export class TrailingHackViewDesc extends ViewDesc {

    private readonly _domAtom = true;

    /**
     * Hack nodes are atomic and should not be split or entered.
     */
    get domAtom(): boolean {
        return this._domAtom;
    }

    /**
     * IMG hack nodes should be ignored for coordinate calculations.
     */
    get ignoreForCoords(): boolean {
        return this._dom.nodeName === 'IMG';
    }

    /**
     * These hack nodes should be ignored during parsing since they're not
     * part of the document content.
     *
     * @returns Parse rule with ignore flag set
     */
    parseRule(): { ignore: boolean } {
        return {ignore: true};
    }

    /**
     * Checks if this hack node matches a given node name.
     *
     * @param nodeName - The node name to check (e.g., 'BR', 'IMG')
     * @returns True if not dirty and names match
     */
    matchesHack(nodeName: string): boolean {
        return this._dirty === ViewDirtyState.NOT_DIRTY
            && this._dom.nodeName === nodeName;
    }

    getType(): ViewDescType {
        return ViewDescType.TRAILING_HACK;
    }
}
