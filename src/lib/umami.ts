export const UMAMI_SITE_ID = process.env.NEXT_PUBLIC_UMAMI_SITE_ID;

export const trackUmamiEvent = (eventName, eventGroup = "click") => {
    //@ts-ignore
    if (window.umami && window.umami?.track) {
        // Umami v2 uses a single track method
        window.umami.track(eventName, { group: eventGroup });
    }
};
