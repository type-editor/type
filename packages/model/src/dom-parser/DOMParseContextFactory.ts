import type {DOMParseContext} from '../types/dom-parser/DOMParseContext';
import type {ParseOptions} from '../types/dom-parser/ParseOptions';
import {DocumentParseContext} from './context/DocumentParseContext';
import {DOMParser} from './DOMParser';


export class DOMParseContextFactory {

    /**
     * Creates a new parse context instance
     *
     * @param domParser - The DOM parser instance to use for parsing
     * @param parseOptions - Configuration options for the parsing operation
     * @param isOpen - Whether the context should be created in an open state
     * @returns A new parse context instance
     */
    public static createParseContext(domParser: DOMParser,
                                     parseOptions: ParseOptions,
                                     isOpen: boolean): DOMParseContext {
        return new DocumentParseContext(domParser, parseOptions, isOpen);
    }
}
