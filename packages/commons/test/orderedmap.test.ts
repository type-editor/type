import {describe, it, expect} from 'vitest';
import ist from 'ist';
import {OrderedMap} from '@src/OrderedMap';

describe("OrderedMap", () => {
  describe("constructor and from", () => {
    it("creates an empty map", () => {
      const map = OrderedMap.from(null);
      ist(map.size, 0);
    });

    it("creates a map from an object", () => {
      const map = OrderedMap.from({a: 1, b: 2, c: 3});
      ist(map.size, 3);
      ist(map.get("a"), 1);
      ist(map.get("b"), 2);
      ist(map.get("c"), 3);
    });

    it("returns the same map when passed an OrderedMap", () => {
      const map1 = OrderedMap.from({a: 1});
      const map2 = OrderedMap.from(map1);
      ist(map1, map2);
    });

    it("creates a map with direct constructor", () => {
      const map = new OrderedMap(["a", 1, "b", 2]);
      ist(map.size, 2);
      ist(map.get("a"), 1);
      ist(map.get("b"), 2);
    });
  });

  describe("get and find", () => {
    it("retrieves existing values", () => {
      const map = OrderedMap.from({x: 10, y: 20, z: 30});
      ist(map.get("x"), 10);
      ist(map.get("y"), 20);
      ist(map.get("z"), 30);
    });

    it("returns undefined for non-existing keys", () => {
      const map = OrderedMap.from({a: 1});
      ist(map.get("nonexistent"), undefined);
    });

    it("find returns correct index for existing key", () => {
      const map = OrderedMap.from({a: 1, b: 2});
      ist(map.find("a"), 0);
      ist(map.find("b"), 2);
    });

    it("find returns -1 for non-existing key", () => {
      const map = OrderedMap.from({a: 1});
      ist(map.find("missing"), -1);
    });
  });

  describe("update", () => {
    it("updates an existing key", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.update("a", 10);
      ist(map2.get("a"), 10);
      ist(map2.get("b"), 2);
      ist(map1.get("a"), 1); // original unchanged
    });

    it("adds a new key at the end", () => {
      const map1 = OrderedMap.from({a: 1});
      const map2 = map1.update("b", 2);
      ist(map2.size, 2);
      ist(map2.get("b"), 2);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b");
    });

    it("updates key name with newKey parameter", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.update("a", 10, "c");
      ist(map2.get("c"), 10);
      ist(map2.get("a"), undefined);
      ist(map2.size, 2);
    });

    it("removes old newKey if it exists", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.update("a", 10, "c");
      ist(map2.size, 2);
      ist(map2.get("c"), 10);
      ist(map2.get("b"), 2);
    });
  });

  describe("remove", () => {
    it("removes an existing key", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.remove("b");
      ist(map2.size, 2);
      ist(map2.get("a"), 1);
      ist(map2.get("b"), undefined);
      ist(map2.get("c"), 3);
    });

    it("returns the same map when removing non-existent key", () => {
      const map1 = OrderedMap.from({a: 1});
      const map2 = map1.remove("missing");
      ist(map1, map2);
    });

    it("removes the first key", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.remove("a");
      ist(map2.size, 2);
      ist(map2.get("a"), undefined);
    });

    it("removes the last key", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.remove("c");
      ist(map2.size, 2);
      ist(map2.get("c"), undefined);
    });
  });

  describe("addToStart", () => {
    it("adds a new key to the start", () => {
      const map1 = OrderedMap.from({b: 2, c: 3});
      const map2 = map1.addToStart("a", 1);
      ist(map2.size, 3);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b,c");
    });

    it("moves existing key to start", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.addToStart("c", 30);
      ist(map2.size, 3);
      ist(map2.get("c"), 30);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "c,a,b");
    });
  });

  describe("addToEnd", () => {
    it("adds a new key to the end", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.addToEnd("c", 3);
      ist(map2.size, 3);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b,c");
    });

    it("moves existing key to end", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.addToEnd("a", 10);
      ist(map2.size, 3);
      ist(map2.get("a"), 10);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "b,c,a");
    });
  });

  describe("addBefore", () => {
    it("adds a key before another key", () => {
      const map1 = OrderedMap.from({a: 1, c: 3});
      const map2 = map1.addBefore("c", "b", 2);
      ist(map2.size, 3);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b,c");
    });

    it("adds to end if place key not found", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.addBefore("missing", "c", 3);
      ist(map2.size, 3);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b,c");
    });

    it("removes existing key before adding", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.addBefore("a", "c", 30);
      ist(map2.size, 3);
      const keys: string[] = [];
      map2.forEach((k) => keys.push(k));
      ist(keys.join(","), "c,a,b");
    });
  });

  describe("forEach", () => {
    it("iterates over all key-value pairs in order", () => {
      const map = OrderedMap.from({a: 1, b: 2, c: 3});
      const keys: string[] = [];
      const values: number[] = [];
      map.forEach((k, v) => {
        keys.push(k);
        values.push(v);
      });
      ist(keys.join(","), "a,b,c");
      ist(values.join(","), "1,2,3");
    });

    it("handles empty map", () => {
      const map = OrderedMap.from(null);
      let count = 0;
      map.forEach(() => count++);
      ist(count, 0);
    });
  });

  describe("prepend", () => {
    it("prepends keys from another map", () => {
      const map1 = OrderedMap.from({c: 3, d: 4});
      const map2 = OrderedMap.from({a: 1, b: 2});
      const map3 = map1.prepend(map2);
      ist(map3.size, 4);
      const keys: string[] = [];
      map3.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b,c,d");
    });

    it("prepends from object", () => {
      const map1 = OrderedMap.from({c: 3, d: 4});
      const map2 = map1.prepend({a: 1, b: 2});
      ist(map2.size, 4);
    });

    it("overwrites with values from the other map", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = OrderedMap.from({a: 10, c: 3});
      const map3 = map1.prepend(map2);
      ist(map3.get("a"), 10);
      ist(map3.size, 3);
    });

    it("returns this when prepending empty map", () => {
      const map1 = OrderedMap.from({a: 1});
      const map2 = map1.prepend(OrderedMap.from(null));
      ist(map1, map2);
    });
  });

  describe("append", () => {
    it("appends keys from another map", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = OrderedMap.from({c: 3, d: 4});
      const map3 = map1.append(map2);
      ist(map3.size, 4);
      const keys: string[] = [];
      map3.forEach((k) => keys.push(k));
      ist(keys.join(","), "a,b,c,d");
    });

    it("appends from object", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.append({c: 3, d: 4});
      ist(map2.size, 4);
    });

    it("overwrites with values from the other map", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = OrderedMap.from({b: 20, c: 3});
      const map3 = map1.append(map2);
      ist(map3.get("b"), 20);
      ist(map3.size, 3);
    });

    it("returns this when appending empty map", () => {
      const map1 = OrderedMap.from({a: 1});
      const map2 = map1.append(OrderedMap.from(null));
      ist(map1, map2);
    });
  });

  describe("subtract", () => {
    it("removes keys present in another map", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = OrderedMap.from({b: 20, d: 4});
      const map3 = map1.subtract(map2);
      ist(map3.size, 2);
      ist(map3.get("a"), 1);
      ist(map3.get("b"), undefined);
      ist(map3.get("c"), 3);
    });

    it("subtracts from object", () => {
      const map1 = OrderedMap.from({a: 1, b: 2, c: 3});
      const map2 = map1.subtract({a: 10, c: 30});
      ist(map2.size, 1);
      ist(map2.get("b"), 2);
    });

    it("returns original map when subtracting empty map", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.subtract(OrderedMap.from(null));
      ist(map1, map2);
    });
  });

  describe("toObject", () => {
    it("converts to plain object", () => {
      const map = OrderedMap.from({a: 1, b: 2, c: 3});
      const obj = map.toObject();
      ist(obj.a, 1);
      ist(obj.b, 2);
      ist(obj.c, 3);
      ist(Object.keys(obj).length, 3);
    });

    it("converts empty map to empty object", () => {
      const map = OrderedMap.from(null);
      const obj = map.toObject();
      ist(Object.keys(obj).length, 0);
    });
  });

  describe("size", () => {
    it("returns correct size for various maps", () => {
      ist(OrderedMap.from(null).size, 0);
      ist(OrderedMap.from({a: 1}).size, 1);
      ist(OrderedMap.from({a: 1, b: 2, c: 3}).size, 3);
    });

    it("size updates after operations", () => {
      let map = OrderedMap.from({a: 1, b: 2});
      ist(map.size, 2);
      map = map.update("c", 3);
      ist(map.size, 3);
      map = map.remove("b");
      ist(map.size, 2);
    });
  });

  describe("immutability", () => {
    it("operations don't modify original map", () => {
      const map1 = OrderedMap.from({a: 1, b: 2});
      const map2 = map1.update("a", 10);
      const map3 = map1.remove("b");
      const map4 = map1.addToStart("z", 26);

      ist(map1.get("a"), 1);
      ist(map1.get("b"), 2);
      ist(map1.size, 2);
    });
  });

  describe("complex scenarios", () => {
    it("handles multiple operations in sequence", () => {
      let map = OrderedMap.from({a: 1, b: 2, c: 3});
      map = map.update("b", 20);
      map = map.addToEnd("d", 4);
      map = map.remove("a");
      map = map.addToStart("z", 26);

      ist(map.size, 4);
      ist(map.get("z"), 26);
      ist(map.get("b"), 20);
      ist(map.get("c"), 3);
      ist(map.get("d"), 4);

      const keys: string[] = [];
      map.forEach((k) => keys.push(k));
      ist(keys.join(","), "z,b,c,d");
    });

    it("handles values of different types", () => {
      const map = OrderedMap.from({
        str: "hello",
        num: 42,
        bool: true,
        obj: {nested: "value"},
        arr: [1, 2, 3],
        nul: null
      });

      ist(map.get("str"), "hello");
      ist(map.get("num"), 42);
      ist(map.get("bool"), true);
      // @ts-ignore
        ist(map.get("obj").nested, "value");
      ist(map.get("arr")[0], 1);
      ist(map.get("nul"), null);
    });
  });
});

