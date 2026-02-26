import type {SearchQuery} from '../SearchQuery';
import type {DocumentRange} from './DocumentRange';

/**
 * Configuration options for the search plugin.
 */
export interface SearchPluginOptions {
    /**
     * The initial search query to use when the plugin is created.
     * Defaults to an empty query.
     */
    initialQuery?: SearchQuery;
    /**
     * Optional range to limit the initial search scope.
     */
    initialRange?: DocumentRange;
}
