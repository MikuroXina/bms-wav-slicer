/**
 * Finds the partitioning item according to the given predicate `pred` from the items `array` by binary search method. The first partition satisfies `pred`, and the second doesn't satisfy.
 *
 * `array` must be partitioned by `pred`. Otherwise, the result will be meaningless.
 *
 * @param array - Haystack items.
 * @param pred - Predicate to partition items.
 * @returns The first index the second partition which `pred` returns `false`.
 *
 * # Example
 *
 * ```ts
 * partitionPoint([0, 3, 42, 55], (x) => x < 42); // 2
 * partitionPoint([0, 3, 42, 55], (x) => x <= 42); // 3
 * partitionPoint([4, 8], (x) => x < 100); // 2
 * partitionPoint([4, 8], (x) => x < 0); // 0
 * ```
 */
export function partitionPoint<T>(array: readonly T[], pred: (item: T) => boolean): number {
    if (array.length === 0) {
        return 0;
    }

    let start = 0;
    let end = array.length;
    // the solution is in [start, end)
    while (start + 1 < end) {
        const mid = start + Math.floor((end - start) / 2);
        if (pred(array[mid]!)) {
            start = mid;
        } else {
            end = mid;
        }
    }
    return start + (pred(array[start]!) ? 1 : 0);
}
