import { describe, expect, it } from 'vitest';

import { transpose } from '@src/utils/transpose';

describe('transpose', () => {
  const arr = [
    ['a1', 'a2', 'a3'],
    ['b1', 'b2', 'b3'],
    ['c1', 'c2', 'c3'],
    ['d1', 'd2', 'd3'],
  ];

  const expected = [
    ['a1', 'b1', 'c1', 'd1'],
    ['a2', 'b2', 'c2', 'd2'],
    ['a3', 'b3', 'c3', 'd3'],
  ];

  it('should invert columns to rows', () => {
    expect(transpose(arr)).toEqual(expected);
  });

  it('should guarantee the reflection to be true ', () => {
    expect(transpose(expected)).toEqual(arr);
  });

  it('should return empty array for empty input', () => {
    expect(transpose([])).toEqual([]);
  });

  it('should return empty array for array with empty rows', () => {
    expect(transpose([[]])).toEqual([]);
  });

  it('should handle single element array', () => {
    expect(transpose([['a']])).toEqual([['a']]);
  });

  it('should handle single row', () => {
    expect(transpose([['a', 'b', 'c']])).toEqual([['a'], ['b'], ['c']]);
  });

  it('should handle single column', () => {
    expect(transpose([['a'], ['b'], ['c']])).toEqual([['a', 'b', 'c']]);
  });

  it('should handle jagged arrays by using shortest row length', () => {
    const jagged = [
      ['a1', 'a2', 'a3'],
      ['b1', 'b2'],  // shorter row
      ['c1', 'c2', 'c3'],
    ];
    // Should only transpose up to the minimum row length (2 columns)
    expect(transpose(jagged)).toEqual([
      ['a1', 'b1', 'c1'],
      ['a2', 'b2', 'c2'],
    ]);
  });
});
