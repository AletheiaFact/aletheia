export const ParseMachineState = ({ value, context }) => {
    typeof value === "object" ? value = Object.keys(value)[0] : value
    return {
        context,
        value,
    }
}
