export const getQueryMatchForMachineValue = (value) => {
    console.log(`getQueryMatchForMachineValue: ${value}`, typeof value);
    return plainValues.includes(value)
        ? { "machine.value": value }
        : { [`machine.value.${value}`]: { $exists: true } };
};

const plainValues = ["published", "submitted"];
