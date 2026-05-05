import { describe, expect, test } from "vitest";

import { partitionPoint } from "./binary-search.js";

describe("partitionPoint", () => {
    test("simple cases", () => {
        expect(partitionPoint([0, 3, 42, 55], (x) => x < 42)).toStrictEqual(2);
        expect(partitionPoint([0, 3, 42, 55], (x) => x <= 42)).toStrictEqual(3);
    });

    test("corner cases", () => {
        expect(partitionPoint([], (x) => x < 100)).toStrictEqual(0);
        expect(partitionPoint([4, 8], (x) => x < 100)).toStrictEqual(2);
        expect(partitionPoint([4, 8], (x) => x < 0)).toStrictEqual(0);
    });
});
