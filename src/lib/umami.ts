declare global {
    interface Window {
        umami?: {
            track: (event: string, data?: Record<string, unknown>) => void;
        };
    }
}

export const UMAMI_SITE_ID = process.env.NEXT_PUBLIC_UMAMI_SITE_ID;

export const trackUmamiEvent = (eventName: string, eventGroup = "click") => {
    if (window.umami && window.umami?.track) {
        // Umami v2 uses a single track method
        window.umami.track(eventName, { group: eventGroup });
    }
};
