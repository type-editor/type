# Helpers for normalizing tables.

This module provides functions to fix common table structure issues:
- Overlapping cells (caused by incorrect colspan/rowspan values)
- Missing cells in rows (ensuring consistent row widths)
- Rowspans extending beyond table boundaries
- Inconsistent column widths across cells
- Zero-sized tables (tables with no content)

The normalization uses problems reported by {@link TableMap} to identify
and fix structural issues.
