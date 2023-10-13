import { useEffect, useState } from "react";

export default function useCardPresence(
    getJSON,
    state,
    cardType,
    initialState
) {
    const [isDisabled, setIsDisabled] = useState(initialState);

    useEffect(() => {
        const json = getJSON();
        const hasCard = json.content.some(({ type }) => type === cardType);
        if (isDisabled !== hasCard) {
            setIsDisabled(hasCard);
        }
    }, [getJSON, state, isDisabled, cardType]);

    return isDisabled;
}
