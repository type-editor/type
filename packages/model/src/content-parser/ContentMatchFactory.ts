import type {ContentMatch} from '../types/content-parser/ContentMatch';
import {DocumentContentMatch} from './DocumentContentMatch';

export class ContentMatchFactory {

    private static _EMPTY_CONTENT_MATCH: ContentMatch | null = null;

    static get EMPTY_CONTENT_MATCH() {
        if(!ContentMatchFactory._EMPTY_CONTENT_MATCH) {
            ContentMatchFactory._EMPTY_CONTENT_MATCH = new DocumentContentMatch(true);
        }
        return ContentMatchFactory._EMPTY_CONTENT_MATCH;
    }
}
