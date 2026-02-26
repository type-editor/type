import type {SearchQuery} from '../SearchQuery';
import {NullQuery} from './NullQuery';
import {RegExpQuery} from './RegExpQuery';
import {StringQuery} from './StringQuery';


export class QueryFactory {

    /**
     * Null object pattern implementation for invalid queries.
     * Returns null for all search operations.
     */
    private static readonly NullQuery = new NullQuery();



    public static createStringQuery(query: SearchQuery): StringQuery {
        return new StringQuery(query);
    }

    public static createRegExpQuery(query: SearchQuery): RegExpQuery {
        return new RegExpQuery(query);
    }

    public static createNullQuery(): NullQuery {
        return QueryFactory.NullQuery;
    }
}
