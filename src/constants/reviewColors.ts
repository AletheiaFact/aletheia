// Text and border tone of each classification
const reviewColors = {
    "not-fact": "#006060",
    trustworthy: "#008000",
    "trustworthy-but": "#5A781D",
    arguable: "#9F6B3F",
    misleading: "#D6395F",
    false: "#D32B20",
    unsustainable: "#A74165",
    exaggerated: "#B8860B",
    unverifiable: "#C9502A",
};

export interface ReviewColorTones {
    // Labels, borders and filled chips with white text
    text: string;
    // Saturated fill, for large marks only: white text on it is too faint
    fill: string;
    // Light background, e.g. hover
    light: string;
}

// The full palette of the brand guide, three tones per classification
export const reviewPalette: Record<keyof typeof reviewColors, ReviewColorTones> =
    {
        "not-fact": { text: "#006060", fill: "#029393", light: "#ADD8D8" },
        trustworthy: { text: "#008000", fill: "#00AE00", light: "#ACE0AC" },
        "trustworthy-but": {
            text: "#5A781D",
            fill: "#7BA91E",
            light: "#D1DFB5",
        },
        exaggerated: { text: "#B8860B", fill: "#DB9F0D", light: "#EEDCB0" },
        arguable: { text: "#9F6B3F", fill: "#C98043", light: "#E8D2C0" },
        unverifiable: { text: "#C9502A", fill: "#EF5C2E", light: "#F4C8BA" },
        misleading: { text: "#D6395F", fill: "#FA3C6A", light: "#F7BECC" },
        unsustainable: { text: "#A74165", fill: "#D81D5F", light: "#EDB5C8" },
        false: { text: "#D32B20", fill: "#F21709", light: "#F5B3AF" },
    };

export default reviewColors;
