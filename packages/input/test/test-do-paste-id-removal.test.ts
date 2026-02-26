import {describe, it, expect, vi, beforeEach} from 'vitest';
import {Fragment, Schema, Slice} from '@type-editor/model';
import type {PmNode, NodeSpec} from '@type-editor/model';
import type {PmEditorView, PmTransaction} from '@type-editor/editor-types';

// Mock the parseFromClipboard function
vi.mock('@src/clipboard/parse-from-clipboard', () => ({
    parseFromClipboard: vi.fn()
}));

import {doPaste} from '@src/input-handler/copy-paste/util/do-paste';
import {parseFromClipboard} from '@src/clipboard/parse-from-clipboard';

const mockedParseFromClipboard = vi.mocked(parseFromClipboard);

// Helper to create a mock ClipboardEvent
function createMockClipboardEvent(): ClipboardEvent {
    return {
        type: 'paste',
        clipboardData: null,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
    } as unknown as ClipboardEvent;
}

describe('doPaste - ID removal', () => {
    let mockView: PmEditorView;
    let mockTransaction: PmTransaction;
    let dispatchedTransaction: PmTransaction | null;
    let schema: Schema;

    beforeEach(() => {
        dispatchedTransaction = null;
        vi.clearAllMocks();

        // Create a simple test schema with nodes that have id attributes
        const nodes: Record<string, NodeSpec> = {
            doc: {
                content: 'block+'
            },
            paragraph: {
                group: 'block',
                content: 'text*',
                attrs: {
                    id: { default: null }
                },
                toDOM: (node: PmNode) => ['p', node.attrs, 0],
                parseDOM: [{ tag: 'p' }]
            },
            image: {
                group: 'block',
                attrs: {
                    id: { default: null },
                    src: { default: '' },
                    alt: { default: '' }
                },
                toDOM: (node: PmNode) => ['img', node.attrs],
                parseDOM: [{ tag: 'img' }]
            },
            text: {
                group: 'inline'
            }
        };

        schema = new Schema({ nodes });

        // Create mock transaction
        mockTransaction = {
            replaceSelectionWith: vi.fn().mockReturnThis(),
            replaceSelection: vi.fn().mockReturnThis(),
            scrollIntoView: vi.fn().mockReturnThis(),
            setMeta: vi.fn().mockReturnThis(),
        } as unknown as PmTransaction;

        // Create mock view
        mockView = {
            state: {
                schema,
                selection: {
                    $from: {}
                },
                transaction: mockTransaction
            },
            someProp: vi.fn().mockReturnValue(false),
            dispatch: vi.fn((tr: PmTransaction) => {
                dispatchedTransaction = tr;
            })
        } as unknown as PmEditorView;
    });

    describe('single node with id attribute', () => {
        it('should remove id attribute when pasting a single node with id', () => {
            // Create a paragraph node with an id
            const originalId = 'unique-id-123';
            const paragraphWithId: PmNode = schema.nodes.paragraph.create(
                { id: originalId },
                schema.text('Hello world')
            );

            // Create a slice containing just this node
            const slice: Slice = new Slice(
                Fragment.from(paragraphWithId),
                0, // openStart
                0  // openEnd
            );

            // Mock parseFromClipboard to return our test slice
            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, 'Hello world', null, false, event);

            // Verify the paste was handled
            expect(result).toBe(true);

            // Verify replaceSelectionWith was called
            expect(mockTransaction.replaceSelectionWith).toHaveBeenCalled();

            // Get the node that was passed to replaceSelectionWith
            const callArgs = (mockTransaction.replaceSelectionWith as ReturnType<typeof vi.fn>).mock.calls[0];
            const insertedNode = callArgs[0] as PmNode;

            // Verify the id was removed (either null or different from original)
            expect(insertedNode.attrs.id).not.toBe(originalId);
            expect(insertedNode.textContent).toBe('Hello world');
            expect(insertedNode.type.name).toBe('paragraph');

            // Verify transaction was dispatched with correct metadata
            expect(mockView.dispatch).toHaveBeenCalled();
            expect(mockTransaction.setMeta).toHaveBeenCalledWith('paste', true);
            expect(mockTransaction.setMeta).toHaveBeenCalledWith('uiEvent', 'paste');
        });

        it('should preserve other attributes when removing id', () => {
            // Create an image node with id and other attributes
            const originalId = 'image-123';
            const imageWithId: PmNode = schema.nodes.image.create({
                id: originalId,
                src: 'https://example.com/image.png',
                alt: 'Test image'
            });

            const slice: Slice = new Slice(
                Fragment.from(imageWithId),
                0,
                0
            );

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, '', null, false, event);

            expect(result).toBe(true);

            const callArgs = (mockTransaction.replaceSelectionWith as ReturnType<typeof vi.fn>).mock.calls[0];
            const insertedNode = callArgs[0] as PmNode;

            // Verify id was removed/changed but other attrs preserved
            expect(insertedNode.attrs.id).not.toBe(originalId);
            expect(insertedNode.attrs.src).toBe('https://example.com/image.png');
            expect(insertedNode.attrs.alt).toBe('Test image');
        });

        it('should not fail when pasting a node without id attribute', () => {
            // Create a text node (which doesn't have id in its spec)
            const paragraph: PmNode = schema.nodes.paragraph.create(
                null,
                schema.text('Simple text')
            );

            const slice: Slice = new Slice(
                Fragment.from(paragraph),
                0,
                0
            );

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, 'Simple text', null, false, event);

            expect(result).toBe(true);
            expect(mockTransaction.replaceSelectionWith).toHaveBeenCalled();
        });
    });

    describe('slice with multiple nodes with id attributes', () => {
        it('should remove id from all nodes in a slice', () => {
            // Create multiple paragraphs with ids
            const originalId1 = 'para-1';
            const originalId2 = 'para-2';
            const originalId3 = 'para-3';
            
            const para1: PmNode = schema.nodes.paragraph.create(
                { id: originalId1 },
                schema.text('First paragraph')
            );
            const para2: PmNode = schema.nodes.paragraph.create(
                { id: originalId2 },
                schema.text('Second paragraph')
            );
            const para3: PmNode = schema.nodes.paragraph.create(
                { id: originalId3 },
                schema.text('Third paragraph')
            );

            // Create a slice with multiple nodes (open boundaries)
            const slice: Slice = new Slice(
                Fragment.from([para1, para2, para3]),
                1, // openStart - indicates the slice is "open" at the start
                1  // openEnd - indicates the slice is "open" at the end
            );

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, 'Multiple paragraphs', null, false, event);

            expect(result).toBe(true);

            // For a slice with open boundaries or multiple nodes, replaceSelection is used
            expect(mockTransaction.replaceSelection).toHaveBeenCalled();

            // Get the slice that was passed to replaceSelection
            const callArgs = (mockTransaction.replaceSelection as ReturnType<typeof vi.fn>).mock.calls[0];
            const insertedSlice = callArgs[0] as Slice;

            // Verify all nodes have their ids removed/changed
            const nodes = insertedSlice.content.content;
            expect(nodes[0].attrs.id).not.toBe(originalId1);
            expect(nodes[1].attrs.id).not.toBe(originalId2);
            expect(nodes[2].attrs.id).not.toBe(originalId3);

            // Verify content is preserved
            expect(nodes[0].textContent).toBe('First paragraph');
            expect(nodes[1].textContent).toBe('Second paragraph');
            expect(nodes[2].textContent).toBe('Third paragraph');

            // Verify slice structure is preserved
            expect(insertedSlice.openStart).toBe(1);
            expect(insertedSlice.openEnd).toBe(1);
        });

        it('should handle mixed nodes (some with id, some without)', () => {
            // Create a mix of nodes with and without ids
            const originalId = 'has-id';
            const paraWithId: PmNode = schema.nodes.paragraph.create(
                { id: originalId },
                schema.text('Has ID')
            );
            const paraWithoutId: PmNode = schema.nodes.paragraph.create(
                null,
                schema.text('No ID')
            );

            const slice: Slice = new Slice(
                Fragment.from([paraWithId, paraWithoutId]),
                1,
                1
            );

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, 'Mixed content', null, false, event);

            expect(result).toBe(true);

            const callArgs = (mockTransaction.replaceSelection as ReturnType<typeof vi.fn>).mock.calls[0];
            const insertedSlice = callArgs[0] as Slice;

            // Verify the node with id had it changed
            const nodes = insertedSlice.content.content;
            expect(nodes[0].attrs.id).not.toBe(originalId);
            // The node without id should remain unchanged (or get a generated id)
            expect(nodes[1]).toBeDefined();
        });

        it('should preserve open boundaries when removing ids from slice', () => {
            const para: PmNode = schema.nodes.paragraph.create(
                { id: 'test-id' },
                schema.text('Content')
            );

            const slice: Slice = new Slice(
                Fragment.from(para),
                2, // openStart
                3  // openEnd
            );

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, 'Content', null, false, event);

            expect(result).toBe(true);

            const callArgs = (mockTransaction.replaceSelection as ReturnType<typeof vi.fn>).mock.calls[0];
            const insertedSlice = callArgs[0] as Slice;

            // Verify open boundaries are preserved
            expect(insertedSlice.openStart).toBe(2);
            expect(insertedSlice.openEnd).toBe(3);
        });

        it('should handle empty slice', () => {
            const slice: Slice = new Slice(Fragment.empty, 0, 0);

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, '', null, false, event);

            // Empty slice should still be handled
            expect(result).toBe(true);
        });
    });

    describe('handlePaste callback', () => {
        it('should delegate to handlePaste callback if provided', () => {
            const handlePasteCallback = vi.fn().mockReturnValue(true);
            
            const para: PmNode = schema.nodes.paragraph.create(
                { id: 'test-id' },
                schema.text('Content')
            );
            const slice: Slice = new Slice(Fragment.from(para), 0, 0);

            vi.spyOn(mockView, 'someProp').mockImplementation((propName: string, callback?: (value: unknown) => unknown) => {
                if (propName === 'handlePaste' && callback) {
                    return callback(handlePasteCallback);
                }
                return false;
            });

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, 'Content', null, false, event);

            // Should return true and not process the paste normally
            expect(result).toBe(true);
            expect(handlePasteCallback).toHaveBeenCalled();
            expect(mockTransaction.replaceSelectionWith).not.toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        it('should handle null slice from parseFromClipboard', () => {
            mockedParseFromClipboard.mockReturnValue(null);

            const event = createMockClipboardEvent();
            const result = doPaste(mockView, '', null, false, event);

            // Should return false when slice is null
            expect(result).toBe(false);
        });

        it('should respect preferPlain parameter', () => {
            const para: PmNode = schema.nodes.paragraph.create(
                { id: 'test-id' },
                schema.text('Content')
            );
            const slice: Slice = new Slice(Fragment.from(para), 0, 0);

            mockedParseFromClipboard.mockReturnValue(slice);

            const event = createMockClipboardEvent();
            doPaste(mockView, 'Content', '<p>Content</p>', true, event);

            // Verify replaceSelectionWith was called with preferPlain=true
            const callArgs = (mockTransaction.replaceSelectionWith as ReturnType<typeof vi.fn>).mock.calls[0];
            expect(callArgs[1]).toBe(true);
        });
    });
});
