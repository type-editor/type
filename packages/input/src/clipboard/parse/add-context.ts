import {Fragment, type NodeType, type Schema, Slice} from '@type-editor/model';


/**
 * Re-apply a simple context (list of node-type names and attrs) that was
 * removed during serialization. The context string is expected to be
 * JSON produced by `serializeForClipboard`.
 *
 * @param slice - The slice to add context to
 * @param context - JSON string containing the context data
 * @returns A new slice with the context re-applied
 */
export function addContext(slice: Slice, context: string): Slice {
    if (!slice.size) {
        return slice;
    }

    const schema: Schema = slice.content.firstChild.type.schema;
    let array: Array<unknown> | undefined;
    try {
        array = JSON.parse(context) as Array<unknown>;
    } catch (_e) {
        return slice;
    }

    let { content, openStart, openEnd } = slice;
    for (let i = array.length - 2; i >= 0; i -= 2) {
        // Validate array bounds
        if (i + 1 >= array.length) {
            continue;
        }

        const typeName = array[i] as string;
        const attrs = array[i + 1] as Record<string, string | number | boolean> | null;
        const type: NodeType = schema.nodes[typeName];

        if (!type || type.hasRequiredAttrs()) {
            break;
        }
        content = Fragment.from(type.create(attrs, content));
        openStart++;
        openEnd++;
    }
    return new Slice(content, openStart, openEnd);
}
