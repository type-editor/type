import type {Attrs, MarkType, Node, NodeType, Schema} from '@type-editor/model';

type Tags = Record<string, number>;

export interface FlattenedNodes {
    flat: ReadonlyArray<Node>,
    tag?: Tags;
}

// Forward declaration for ChildSpec to include NodeBuilder
export type ChildSpec = string | Node | NodeBuilderType | FlattenedNodes;

// Temporary type to avoid circular reference
type NodeBuilderType = ((attrsOrFirstChild?: Attrs | ChildSpec, ...children: Array<ChildSpec>) => Node & { tag: Tags; }) & {
    flat?: ReadonlyArray<Node>;
};

const noTag = {};

function flatten(
    schema: Schema,
    children: Array<ChildSpec>,
    f: (node: Node) => Node
): { nodes: Array<Node>, tag: Tags; } {
    const result = [];
    let pos = 0, tag = noTag;

    for (const child of children) {
        if (typeof child === 'string') {
            const re = /<(\w+)>/g;
            let m;
            let at = 0;
            let out = '';
            while (m = re.exec(child)) {
                out += child.slice(at, m.index);
                pos += m.index - at;
                at = m.index + m[0].length;
                if (tag === noTag) {tag = {};}
                tag[m[1]] = pos;
            }
            out += child.slice(at);
            pos += child.length - at;
            if (out) {result.push(f(schema.text(out)));}
        } else {
            if ((child as any).tag) {
                if (tag === noTag) {tag = Object.create(null);}
                for (const id in (child as any).tag)
                    {tag[id] = (child as any).tag[id] + ((child as any).flat || (child as any).isText ? 0 : 1) + pos;}
            }
            if ((child as any).flat) {
                for (let j = 0; j < (child as any).flat.length; j++) {
                    const node = f((child as any).flat[j]);
                    pos += node.nodeSize;
                    result.push(node);
                }
            } else {
                const node = f(child as Node);
                pos += node.nodeSize;
                result.push(node);
            }
        }
    }
    return {nodes: result, tag};
}

function id<T>(x: T): T {
    return x;
}

function takeAttrs(attrs: Attrs | null, args: [a?: Attrs | ChildSpec, ...b: Array<ChildSpec>]) {
    const a0 = args[0];
    if (!args.length || (a0 && (typeof a0 === 'string' || (a0 as Node).attrs !== undefined || (a0 as FlattenedNodes).flat)))
        {return attrs;}

    args.shift();
    if (!attrs) {return a0 as Attrs;}
    if (!a0) {return attrs;}
    const result: Attrs = {};
    for (const prop in attrs) {(result as any)[prop] = attrs[prop];}
    for (const prop in a0 as Attrs) {(result as any)[prop] = (a0 as Attrs)[prop];}
    return result;
}

export type NodeBuilder = NodeBuilderType;
export type MarkBuilder = (attrsOrFirstChild?: Attrs | ChildSpec, ...children: Array<ChildSpec>) => ChildSpec;

type Builders<S extends Schema> = {
    schema: S;
} & {
    [key in keyof S['nodes']]: NodeBuilder
} & {
    [key in keyof S['marks']]: MarkBuilder
} & Record<string, NodeBuilder | MarkBuilder>;

// Create a builder function for nodes with content.
function block(type: NodeType, attrs: Attrs | null = null): NodeBuilder {
    const result = function (...args: Array<any>) {
        const myAttrs = takeAttrs(attrs, args);
        const {nodes, tag} = flatten(type.schema, args as Array<ChildSpec>, id);
        const node = type.create(myAttrs, nodes);
        if (tag !== noTag) {(node as any).tag = tag;}
        return node;
    };
    if (type.isLeaf) {try {
        (result as any).flat = [type.create(attrs)];
    } catch (_) { /* empty */ }}
    return result as NodeBuilder;
}

// Create a builder function for marks.
function mark(type: MarkType, attrs: Attrs | null): MarkBuilder {
    return function (...args) {
        const mark = type.create(takeAttrs(attrs, args));
        const {nodes, tag} = flatten(type.schema, args as Array<ChildSpec>, n => {
            const newMarks = mark.addToSet(n.marks);
            return newMarks.length > n.marks.length ? n.mark(newMarks) : n;
        });
        return {flat: nodes, tag};
    };
}

export function builders<Nodes extends string = any, Marks extends string = any>(schema: Schema<Nodes, Marks>, names?: Record<string, Attrs>) {
    const result = {schema};
    for (const name in schema.nodes) {(result as any)[name] = block(schema.nodes[name], {});}
    for (const name in schema.marks) {(result as any)[name] = mark(schema.marks[name], {});}

    if (names) {for (const name in names) {
        const value = names[name];
        const typeName = value.nodeType ?? value.markType ?? name;
        let type;
        if (type = schema.nodes[typeName as string]) {(result as any)[name] = block(type, value);}
        else if (type = schema.marks[typeName as string]) {(result as any)[name] = mark(type, value);}
    }}
    return result as Builders<Schema<Nodes, Marks>>;
}
