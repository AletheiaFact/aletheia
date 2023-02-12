import trustworthy from "./trustworthy.json";
import notFact from "./notFact.json";
import fake from "./false.json";
import misleading from "./misleading.json";
import unsustainable from "./unsustainable.json";
import unverifiable from "./unverifiable.json";
import exaggerated from "./exaggerated.json";
import arguable from "./arguable.json";
import trustworthyBut from "./trustworthy-but.json";

const animations = {
    trustworthy,
    "not-fact": notFact,
    false: fake,
    misleading,
    unsustainable,
    unverifiable,
    exaggerated,
    arguable,
    "trustworthy-but": trustworthyBut,
};

export const generateLottie = (classification, imageData, width, height) => {
    if (!classification) {
        return null;
    }
    // get the right lottie json file for the classification
    const animation = animations[classification];

    // set the image url in the lottie file
    animation.assets[0].p = imageData;

    // update the size of the svg element
    animation.w = width;
    animation.h = height;
    // update the size of the image inside the svg
    animation.assets[0].w = width;
    animation.assets[0].h = height;

    return animation;
};
