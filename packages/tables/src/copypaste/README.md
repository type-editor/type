# Utilities for copy/paste handling in tables

This module provides functions for:
- Pasting cell content into tables
- Replacing a block of cells with clipboard content
- Extending tables to accommodate pasted content
- Clipping and repeating pasted cells to match selection size

When pasting cells into a cell, the block of pasted content is aligned
so that its top-left corner aligns with the selection cell. The table
is optionally extended to the right or bottom to accommodate the content.

When pasting into a cell selection, the cells in the selection are
clipped to the selection's rectangle, optionally repeating the pasted
cells when they are smaller than the selection.
