import {describe, it} from 'vitest';
import ist from "ist";
import type {Node} from '@type-editor/model';
import {blockquote, doc, eq, p, schema} from '@type-editor/test-builder';
import {Transform} from "@src/Transform";
import type {TransformDocument} from "@type-editor/editor-types";

describe("ReplaceAroundStep.map", () => {
    function test(doc: Node, change: (tr: TransformDocument) => void, otherChange: (tr: TransformDocument) => void, expected: Node) {
        let trA = new Transform(doc), trB = new Transform(doc);
        change(trA);
        otherChange(trB);
        let result = new Transform(trB.doc).step(trA.steps[0].map(trB.mapping)!).doc;
        ist(result, expected, eq);
    }

    it("doesn't break wrap steps on insertions", () =>
        test(doc(p("a")),
            tr => tr.wrap(tr.doc.resolve(1).blockRange()!, [{ type: schema.nodes.blockquote }]),
            tr => tr.insert(0, p("b")),
            doc(p("b"), blockquote(p("a")))));

    it("doesn't overwrite content inserted at start of unwrap step", () =>
        test(doc(blockquote(p("a"))),
            tr => tr.lift(tr.doc.resolve(2).blockRange()!, 0),
            tr => tr.insert(2, schema.text("x")),
            doc(p("xa"))));
});
