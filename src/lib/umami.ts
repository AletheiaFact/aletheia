export const UMAMI_SITE_ID = process.env.NEXT_PUBLIC_UMAMI_SITE_ID;

export const trackUmamiEvent = (eventName, eventGroup = "click") => {
    //@ts-ignore
    window.umami && window.umami?.trackEvent(eventName, eventGroup);
};
