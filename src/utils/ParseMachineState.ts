export const ParseMachineState = ({ value, context }) => {
    if(value !== "published") {
        value = Object.keys(value)[0]
    }
    return {
        context,
        value,
    }
}
