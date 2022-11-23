export type CallbackTimerContext = {
    stopped: boolean;
    interval: number;
    callbackFunction: () => Promise<any>;
    callbackResult?: any;
};

export const initialContext: CallbackTimerContext = {
    stopped: false,
    interval: 10, // default
    callbackResult: null,
    callbackFunction: () => Promise.resolve(),
};
