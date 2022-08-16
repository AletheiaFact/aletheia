export const getQueryMatchForMachineValue = (value) => {
    return value === "published"
        ? { "machine.value": value }
        : { [`machine.value.${value}`]: { $exists: true } };
};
