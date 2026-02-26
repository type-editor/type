# Table Map Module

This module provides a descriptive structure for table nodes that simplifies
working with row and column-spanning cells. The structures are cached with
the (persistent) table nodes as key, so they only need to be recomputed
when the table content changes.

**Important:** Positions stored in the map are relative to the start of the
table, not the document. Code using these structures should compute the
table's start position and offset accordingly.
