export const getQueryMatchForMachineValue = (
    value: string
): Record<string, any> => {
    if (value === "cross-checking") {
        return {
            "machine.value": {
                $in: ["cross-checking", "addCommentCrossChecking"],
            },
        };
    }

    return plainValues.includes(value)
        ? { "machine.value": value }
        : { [`machine.value.${value}`]: { $exists: true } };
};

// States the machine stores as a plain string (not a compound object).
const plainValues = [
    "unassigned",
    "selectCrossChecker",
    "selectReviewer",
    "published",
    "submitted",
    "reported",
    "assignedRequest",
    "rejectedRequest",
];
