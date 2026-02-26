import {describe, expect, it} from 'vitest';
import {AddMarkStep} from "@src/change-steps/AddMarkStep";
import {RemoveMarkStep} from "@src/change-steps/RemoveMarkStep";
import {AddNodeMarkStep} from "@src/change-steps/AddNodeMarkStep";
import {RemoveNodeMarkStep} from "@src/change-steps/RemoveNodeMarkStep";
import {schema} from '@type-editor/test-builder';
import type {Mappable, MapResult} from "@type-editor/editor-types";

// Helper to create a mock mapping for testing
function createMockMapping(mapFn: (pos: number, assoc?: number) => MapResult): Mappable {
    return {
        map: (pos: number, assoc?: number) => mapFn(pos, assoc).pos,
        mapResult: (pos: number, assoc?: number) => mapFn(pos, assoc)
    };
}

describe('Mark Steps', () => {
    describe('AddMarkStep', () => {
        it('should add a mark to inline content', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello world')
                ])
            ]);

            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(1, 12, mark);
            const result = step.apply(doc);

            expect(result.failed).toBeNull();
            expect(result.doc).toBeTruthy();

            const text = result.doc!.nodeAt(1);
            expect(text).toBeTruthy();
            expect(text!.marks).toHaveLength(1);
            expect(text!.marks[0].type).toBe(schema.marks.strong);
        });

        it('should not add duplicate marks', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello', [mark])
                ])
            ]);

            const step = new AddMarkStep(1, 6, mark);
            const result = step.apply(doc);

            expect(result.failed).toBeNull();
            const text = result.doc!.nodeAt(1);
            expect(text!.marks).toHaveLength(1);
        });

        it('should respect parent allowsMarkType restrictions', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.code_block.create(null, [
                    schema.text('code')
                ])
            ]);

            const step = new AddMarkStep(1, 5, mark);
            const result = step.apply(doc);

            // Code blocks don't allow marks on their content
            expect(result.failed).toBeNull();
            const text = result.doc!.nodeAt(1);
            expect(text!.marks).toHaveLength(0);
        });

        it('should invert to RemoveMarkStep', () => {

            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(1, 6, mark);
            const inverted = step.invert();

            expect(inverted).toBeInstanceOf(RemoveMarkStep);
            expect((inverted as RemoveMarkStep).mark).toBe(mark);
        });

        it('should serialize and deserialize correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(5, 15, mark);
            const json = step.toJSON();

            expect(json.stepType).toBe('addMark');
            expect(json.from).toBe(5);
            expect(json.to).toBe(15);
            expect(json.mark).toBeTruthy();

            const deserialized = AddMarkStep.fromJSON(schema, json);
            expect(deserialized).toBeInstanceOf(AddMarkStep);
            // Verify by serializing again
            const json2 = deserialized.toJSON();
            expect(json2.from).toBe(5);
            expect(json2.to).toBe(15);
        });

        it('should validate fromJSON input', () => {
            expect(() => AddMarkStep.fromJSON(schema, {stepType: 'addMark', from: -1, to: 5}))
                .toThrow('Positions in AddMarkStep.fromJSON must be non-negative');

            expect(() => AddMarkStep.fromJSON(schema, {stepType: 'addMark', from: 10, to: 5}))
                .toThrow('Invalid range in AddMarkStep.fromJSON: from cannot be greater than to');

            expect(() => AddMarkStep.fromJSON(schema, {stepType: 'addMark', from: 5, to: 10}))
                .toThrow('Mark is required in AddMarkStep.fromJSON');
        });

        it('should map positions correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(5, 15, mark);

            const mapping = createMockMapping((pos) => ({
                pos: pos + 5, // Map each position forward by 5
                delInfo: 0,
                recover: 0,
                deleted: false,
                deletedBefore: false,
                deletedAfter: false,
                deletedAcross: false
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeInstanceOf(AddMarkStep);
            // Verify via serialization
            const json = (mapped as AddMarkStep).toJSON();
            expect(json.from).toBe(10);
            expect(json.to).toBe(20);
        });

        it('should return null when mapped range is deleted', () => {
            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(5, 15, mark);

            const mapping = createMockMapping(() => ({
                pos: 5,
                delInfo: 0,
                recover: 0,
                deleted: true,
                deletedBefore: true,
                deletedAfter: true,
                deletedAcross: true
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeNull();
        });

        it('should return null when mapped range becomes invalid (from >= to)', () => {
            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(5, 15, mark);

            const mapping = createMockMapping((pos, assoc = 1) => ({
                pos: assoc > 0 ? 20 : 10, // from maps to 20, to maps to 10
                delInfo: 0,
                recover: 0,
                deleted: false,
                deletedBefore: false,
                deletedAfter: false,
                deletedAcross: false
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeNull();
        });

        it('should merge with overlapping AddMarkStep', () => {
            const mark = schema.marks.strong.create();
            const step1 = new AddMarkStep(5, 15, mark);
            const step2 = new AddMarkStep(10, 20, mark);

            const merged = step1.merge(step2);
            expect(merged).toBeInstanceOf(AddMarkStep);
            // Verify via serialization
            const json = (merged as AddMarkStep).toJSON();
            expect(json.from).toBe(5);
            expect(json.to).toBe(20);
        });

        it('should merge with adjacent AddMarkStep', () => {
            const mark = schema.marks.strong.create();
            const step1 = new AddMarkStep(5, 10, mark);
            const step2 = new AddMarkStep(10, 15, mark);

            const merged = step1.merge(step2);
            expect(merged).toBeInstanceOf(AddMarkStep);
            // Verify via serialization
            const json = (merged as AddMarkStep).toJSON();
            expect(json.from).toBe(5);
            expect(json.to).toBe(15);
        });

        it('should not merge with different marks', () => {
            const step1 = new AddMarkStep(5, 15, schema.marks.strong.create());
            const step2 = new AddMarkStep(10, 20, schema.marks.em.create());

            const merged = step1.merge(step2);
            expect(merged).toBeNull();
        });

        it('should not merge with non-overlapping ranges', () => {
            const mark = schema.marks.strong.create();
            const step1 = new AddMarkStep(5, 10, mark);
            const step2 = new AddMarkStep(15, 20, mark);

            const merged = step1.merge(step2);
            expect(merged).toBeNull();
        });
    });

    describe('RemoveMarkStep', () => {
        it('should remove a mark from inline content', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello world', [mark])
                ])
            ]);

            const step = new RemoveMarkStep(1, 12, mark);
            const result = step.apply(doc);

            expect(result.failed).toBeNull();
            expect(result.doc).toBeTruthy();

            const text = result.doc!.nodeAt(1);
            expect(text).toBeTruthy();
            expect(text!.marks).toHaveLength(0);
        });

        it('should work when mark is not present (no-op)', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello')
                ])
            ]);

            const step = new RemoveMarkStep(1, 6, mark);
            const result = step.apply(doc);

            expect(result.failed).toBeNull();
            const text = result.doc!.nodeAt(1);
            expect(text!.marks).toHaveLength(0);
        });

        it('should invert to AddMarkStep', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello', [mark])
                ])
            ]);

            const step = new RemoveMarkStep(1, 6, mark);
            const inverted = step.invert();

            expect(inverted).toBeInstanceOf(AddMarkStep);
            // Verify the inverted step has the same mark via JSON
            const json = inverted.toJSON();
            expect(json.mark).toEqual(mark.toJSON());
        });

        it('should serialize and deserialize correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new RemoveMarkStep(5, 15, mark);
            const json = step.toJSON();

            expect(json.stepType).toBe('removeMark');
            expect(json.from).toBe(5);
            expect(json.to).toBe(15);
            expect(json.mark).toBeTruthy();

            const deserialized = RemoveMarkStep.fromJSON(schema, json);
            expect(deserialized).toBeInstanceOf(RemoveMarkStep);
            // Verify via serialization
            const json2 = deserialized.toJSON();
            expect(json2.from).toBe(5);
            expect(json2.to).toBe(15);
        });

        it('should validate fromJSON input', () => {
            expect(() => RemoveMarkStep.fromJSON(schema, {stepType: 'removeMark', from: -1, to: 5}))
                .toThrow('Positions in RemoveMarkStep.fromJSON must be non-negative');

            expect(() => RemoveMarkStep.fromJSON(schema, {stepType: 'removeMark', from: 10, to: 5}))
                .toThrow('Invalid range in RemoveMarkStep.fromJSON: from cannot be greater than to');

            expect(() => RemoveMarkStep.fromJSON(schema, {stepType: 'removeMark', from: 5, to: 10}))
                .toThrow('Mark is required in RemoveMarkStep.fromJSON');
        });

        it('should merge with overlapping RemoveMarkStep', () => {
            const mark = schema.marks.strong.create();
            const step1 = new RemoveMarkStep(5, 15, mark);
            const step2 = new RemoveMarkStep(10, 20, mark);

            const merged = step1.merge(step2);
            expect(merged).toBeInstanceOf(RemoveMarkStep);
            // Verify via serialization
            const json = (merged as RemoveMarkStep).toJSON();
            expect(json.from).toBe(5);
            expect(json.to).toBe(20);
        });
    });

    describe('AddNodeMarkStep', () => {
        it('should create step and serialize correctly', () => {
            // Note: The default schema doesn't support node marks on paragraphs
            // so we just test the step creation and serialization
            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(0, mark);

            expect(step).toBeInstanceOf(AddNodeMarkStep);
            const json = step.toJSON();
            expect(json.stepType).toBe('addNodeMark');
            expect(json.pos).toBe(0);
            expect(json.mark).toBeTruthy();
        });

        it('should fail when no node at position', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello')
                ])
            ]);

            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(100, mark);
            const result = step.apply(doc);

            expect(result.failed).toBe('No node at mark step\'s position');
        });

        it('should invert correctly when mark is new', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello')
                ])
            ]);

            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(0, mark);
            const inverted = step.invert(doc);

            expect(inverted).toBeInstanceOf(RemoveNodeMarkStep);
            // Verify the inverted step has the same mark via JSON
            const json = inverted.toJSON();
            expect(json.mark).toEqual(mark.toJSON());
        });


        it('should serialize and deserialize correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(5, mark);
            const json = step.toJSON();

            expect(json.stepType).toBe('addNodeMark');
            expect(json.pos).toBe(5);
            expect(json.mark).toBeTruthy();

            const deserialized = AddNodeMarkStep.fromJSON(schema, json);
            expect(deserialized).toBeInstanceOf(AddNodeMarkStep);
            // Verify via serialization
            const json2 = deserialized.toJSON();
            expect(json2.pos).toBe(5);
        });

        it('should validate fromJSON input', () => {
            expect(() => AddNodeMarkStep.fromJSON(schema, {stepType: 'addNodeMark', pos: -1}))
                .toThrow('Position in AddNodeMarkStep.fromJSON must be non-negative');

            expect(() => AddNodeMarkStep.fromJSON(schema, {stepType: 'addNodeMark', pos: 5}))
                .toThrow('Mark is required in AddNodeMarkStep.fromJSON');
        });

        it('should map position correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(5, mark);

            const mapping = createMockMapping((pos) => ({
                pos: pos + 5,
                delInfo: 0,
                recover: 0,
                deleted: false,
                deletedBefore: false,
                deletedAfter: false,
                deletedAcross: false
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeInstanceOf(AddNodeMarkStep);
            // Verify via serialization
            const json = (mapped as AddNodeMarkStep).toJSON();
            expect(json.pos).toBe(10);
        });

        it('should return null when position is deleted', () => {
            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(5, mark);

            const mapping = createMockMapping(() => ({
                pos: 5,
                delInfo: 0,
                recover: 0,
                deleted: false,
                deletedBefore: false,
                deletedAfter: true,
                deletedAcross: false
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeNull();
        });

        it('should throw when inverting with no node at position', () => {
            const mark = schema.marks.strong.create();
            const step = new AddNodeMarkStep(100, mark);
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [schema.text('hello')])
            ]);

            // nodeAt throws before our custom error message can be generated
            expect(() => step.invert(doc)).toThrow('Position 100 outside of fragment');
        });
    });

    describe('RemoveNodeMarkStep', () => {
        it('should create step and serialize correctly', () => {
            // Note: The default schema doesn't support node marks on paragraphs
            const mark = schema.marks.strong.create();
            const step = new RemoveNodeMarkStep(0, mark);

            expect(step).toBeInstanceOf(RemoveNodeMarkStep);
            const json = step.toJSON();
            expect(json.stepType).toBe('removeNodeMark');
            expect(json.pos).toBe(0);
            expect(json.mark).toBeTruthy();
        });

        it('should fail when no node at position', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello')
                ])
            ]);

            const mark = schema.marks.strong.create();
            const step = new RemoveNodeMarkStep(100, mark);
            const result = step.apply(doc);

            expect(result.failed).toBe('No node at mark step\'s position');
        });

        it('should invert to AddNodeMarkStep', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [schema.text('hello')])
            ]);

            const step = new RemoveNodeMarkStep(0, mark);
            const inverted = step.invert(doc);

            expect(inverted).toBeInstanceOf(AddNodeMarkStep);
            // Verify the inverted step has the same mark via JSON
            const json = inverted.toJSON();
            expect(json.mark).toEqual(mark.toJSON());
        });

        it('should invert to AddNodeMarkStep even when mark not present', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [schema.text('hello')])
            ]);

            const step = new RemoveNodeMarkStep(0, mark);
            const inverted = step.invert(doc);

            // The fix ensures this always returns AddNodeMarkStep
            expect(inverted).toBeInstanceOf(AddNodeMarkStep);
        });

        it('should throw when inverting with no node at position', () => {
            const mark = schema.marks.strong.create();
            const step = new RemoveNodeMarkStep(100, mark);
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [schema.text('hello')])
            ]);

            // nodeAt throws before our custom error message can be generated
            expect(() => step.invert(doc)).toThrow('Position 100 outside of fragment');
        });

        it('should serialize and deserialize correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new RemoveNodeMarkStep(5, mark);
            const json = step.toJSON();

            expect(json.stepType).toBe('removeNodeMark');
            expect(json.pos).toBe(5);
            expect(json.mark).toBeTruthy();

            const deserialized = RemoveNodeMarkStep.fromJSON(schema, json);
            expect(deserialized).toBeInstanceOf(RemoveNodeMarkStep);
            // Verify via serialization
            const json2 = deserialized.toJSON();
            expect(json2.pos).toBe(5);
        });

        it('should validate fromJSON input', () => {
            expect(() => RemoveNodeMarkStep.fromJSON(schema, {stepType: 'removeNodeMark', pos: -1}))
                .toThrow('Position in RemoveNodeMarkStep.fromJSON must be non-negative');

            expect(() => RemoveNodeMarkStep.fromJSON(schema, {stepType: 'removeNodeMark', pos: 5}))
                .toThrow('Mark is required in RemoveNodeMarkStep.fromJSON');
        });

        it('should map position correctly', () => {
            const mark = schema.marks.strong.create();
            const step = new RemoveNodeMarkStep(5, mark);

            const mapping = createMockMapping((pos) => ({
                pos: pos + 5,
                delInfo: 0,
                recover: 0,
                deleted: false,
                deletedBefore: false,
                deletedAfter: false,
                deletedAcross: false
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeInstanceOf(RemoveNodeMarkStep);
            // Verify via serialization
            const json = (mapped as RemoveNodeMarkStep).toJSON();
            expect(json.pos).toBe(10);
        });

        it('should return null when position is deleted', () => {
            const mark = schema.marks.strong.create();
            const step = new RemoveNodeMarkStep(5, mark);

            const mapping = createMockMapping(() => ({
                pos: 5,
                delInfo: 0,
                recover: 0,
                deleted: false,
                deletedBefore: false,
                deletedAfter: true,
                deletedAcross: false
            }));

            const mapped = step.map(mapping);
            expect(mapped).toBeNull();
        });
    });

    describe('Step inversion round-trips', () => {
        it('AddMarkStep -> invert -> apply should restore original', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello world')
                ])
            ]);

            const mark = schema.marks.strong.create();
            const step = new AddMarkStep(1, 6, mark);

            const result1 = step.apply(doc);
            expect(result1.failed).toBeNull();

            const inverted = step.invert();
            const result2 = inverted.apply(result1.doc!);
            expect(result2.failed).toBeNull();

            // Should be back to original (no marks)
            const text = result2.doc!.nodeAt(1);
            expect(text!.marks).toHaveLength(0);
        });

        it('RemoveMarkStep -> invert -> apply should restore original', () => {
            const mark = schema.marks.strong.create();
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('hello', [mark])
                ])
            ]);

            const step = new RemoveMarkStep(1, 6, mark);

            const result1 = step.apply(doc);
            expect(result1.failed).toBeNull();

            const inverted = step.invert();
            const result2 = inverted.apply(result1.doc!);
            expect(result2.failed).toBeNull();

            // Should be back to original (with mark)
            const text = result2.doc!.nodeAt(1);
            expect(text!.marks).toHaveLength(1);
            expect(text!.marks[0].type).toBe(schema.marks.strong);
        });


    });
});

