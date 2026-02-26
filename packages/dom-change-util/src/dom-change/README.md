
# domchange

This module handles DOM mutation detection and conversion to ProseMirror transactions.
It provides the core functionality for reading changes from the DOM and applying them
to the editor state, including handling various browser-specific quirks and edge cases.

Key responsibilities:
- Parse DOM changes and convert them to ProseMirror document changes
- Handle browser-specific quirks (Chrome, Safari, IE11, Android, iOS)
- Detect and optimize mark changes (bold, italic, etc.)
- Manage selection reconstruction after DOM mutations
- Handle composition events and IME input

Note: all referencing and parsing is done with the start-of-operation selection
and document, since that's the one that the DOM represents. If any changes came
in the meantime, the modification is mapped over those before it is applied.
