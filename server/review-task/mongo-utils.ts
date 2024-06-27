export const getQueryMatchForMachineValue = (value) => {
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

const plainValues = ["published", "submitted", "reported"];
