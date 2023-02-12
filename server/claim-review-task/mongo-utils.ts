export const getQueryMatchForMachineValue = (value) => {
    return plainValues.includes(value)
        ? { "machine.value": value }
        : { [`machine.value.${value}`]: { $exists: true } };
};

const plainValues = ["published", "submitted", "reported"];
