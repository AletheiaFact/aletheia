export const ParseMachineState = (state) => {
    return {
        context: state.context,
        value: state.value,
    }
}
