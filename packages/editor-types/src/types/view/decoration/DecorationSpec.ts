import type {DecorationWidgetOptions} from './DecorationWidgetOptions';
import type {InlineDecorationOptions} from './InlineDecorationOptions';
import type {NodeDecorationOptions} from './NodeDecorationOptions';

/**
 * Union type for all possible decoration specification objects.
 */
export type DecorationSpec = DecorationWidgetOptions | InlineDecorationOptions | NodeDecorationOptions;

