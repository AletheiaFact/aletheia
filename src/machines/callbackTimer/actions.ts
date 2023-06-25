import { assign } from "xstate";

export const assignCallbackResult = assign({
    callbackResult: (_, event: any) => {
        return event.data;
    },
});
