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

const getImageMeta = (url) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
    });

const getDimensions = async (imageData: any) => {
    try {
        const image = await getImageMeta(imageData);
        console.log(image);

        // @ts-ignore
        let { naturalWidth: width, naturalHeight: height } = image;
        const windowHeight = window.innerHeight - 200;

        const aspectRatio = width / height;
        if (height > windowHeight) {
            height = windowHeight;
            width = height * aspectRatio;
        }
        return { width, height };
    } catch (error) {
        console.log(error);
        return { width: 500, height: 500 };
    }
};

export const generateLottie = async (classification, imageData) => {
    if (!classification) {
        return null;
    }
    // get the right lottie json file for the classification
    const animation = animations[classification];

    // set the image url in the lottie file
    animation.assets[0].p = imageData;

    // get the natural width and height of the image or fit it to the window
    const { width, height } = await getDimensions(imageData);

    // update the size of the svg element
    animation.w = width;
    animation.h = height;
    // update the size of the image inside the svg
    animation.assets[0].w = width;
    animation.assets[0].h = height;

    return animation;
};
