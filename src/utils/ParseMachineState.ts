import { ReviewTaskStates } from "../machine/enums"

export const ParseMachineState = ({ value, context }) => {
    // The states assigned and reported has compound states, and when we going to save we get
    // "assigned: undraft" as value. Machine don't recognized when we try to persiste state
    //the initial value 'cause the value it's a object. So for these states we get only the key value
    if(value !== ReviewTaskStates.published) {
        value = Object.keys(value)[0]
    }
    return {
        context,
        value,
    }
}
