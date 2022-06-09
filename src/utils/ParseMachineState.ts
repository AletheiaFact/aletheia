export const ParseMachineState = (state) => {
    // const newState = {
    //     changed: state.changed,
    //     context: state.context,
    //     event: state.event,
    //     history: state.history,
    //     historyValue: state.historyValue,
    //     value: state.value,
    //     _event: state._event,
    // }
    // delete newState.context.reviewData.formUi
    // delete newState.event.machine
    // delete newState.history.actions
    // delete newState.history.events
    // delete newState.history.context.formUi
    // delete newState.history.done
    // delete newState.history._event
    // delete newState.history._sessionid
    // delete newState._event
    delete state.history._event["$$type"]
    delete state._event["$$type"]

    return state
}