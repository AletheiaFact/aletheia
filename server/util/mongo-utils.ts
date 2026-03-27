/**
 * Converts a MongoDB aggregation result array into a keyed dictionary (Record).
 * Useful for mapping group results back to their original identifiers in O(1) time.
 * * @param data - The array of objects returned by MongoDB aggregate.
 * @param valueKey - The property name to be used as the value in the record.
 * @returns A Record where keys are stringified _ids and values are from the specified key.
 */
export const mapAggregateToRecord = <T>(
    data: any[],
    valueKey: string
): Record<string, T> => {
    return data.reduce((accumulator, current) => {
        if (current._id) {
            const key = current._id.toString();
            accumulator[key] = current[valueKey];
        }
        return accumulator;
    }, {} as Record<string, T>);
};
