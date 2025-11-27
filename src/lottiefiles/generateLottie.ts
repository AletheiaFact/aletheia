import trustworthy from "./trustworthy.json";
import notFact from "./notFact.json";
import fake from "./false.json";
import misleading from "./misleading.json";
import unsustainable from "./unsustainable.json";
import unverifiable from "./unverifiable.json";
import exaggerated from "./exaggerated.json";
import arguable from "./arguable.json";
import trustworthyBut from "./trustworthy-but.json";
import { ClassificationEnum } from "../types/enums";

export interface LottieLayer {
    ty: number;
    ks?: {
        a?: { k: number[] };
        p?: { k: number[] };
        s?: { k: number[] };
    };
}

export interface LottieImageAsset {
    nm: string;
    mn: string;
    h: number;
    w: number;
    id: string;
    e: number;
    u: string;
    p: string;
}

export interface LottiePrecompAsset {
    nm: string;
    mn: string;
    id: string;
    layers: unknown[];
}

export type LottieAsset = LottieImageAsset | LottiePrecompAsset;

export interface LottieAnimation {
    w: number;
    h: number;
    assets: LottieAsset[];
    layers: LottieLayer[];
}

const animations: Record<string, LottieAnimation> = {
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

type ClassificationKey = keyof typeof ClassificationEnum;

export const generateLottie = (
    classification: ClassificationKey | undefined,
    imageData: string,
    width: number,
    height: number
): LottieAnimation | null => {
    if (!classification || !animations[classification]) {
        return null;
    }

    // get the right lottie json file for the classification
    const animation = structuredClone(animations[classification]);

    if (!animation.assets || animation.assets.length === 0) {
        console.error("Invalid animation: no assets found");
        return null;
    }

    const isImageAsset = (asset: LottieAsset): asset is LottieImageAsset => {
        return "p" in asset && "w" in asset && "h" in asset;
    };

    const imageAsset = animation.assets[0];
    if (!isImageAsset(imageAsset)) {
        console.error("Invalid animation: first asset is not an image");
        return null;
    }

    // set the image url in the lottie file
    imageAsset.p = imageData;

    // update the size of the svg canvas to match the actual image dimensions
    animation.w = width;
    animation.h = height;

    // Keep the image at its original dimensions
    imageAsset.w = width;
    imageAsset.h = height;

    // Find the image layer (type 2) and update its anchor, position, and scale
    const imageLayers = animation.layers.filter((layer) => layer.ty === 2);
    for (const layer of imageLayers) {
        // Update anchor point to center of image dimensions
        if (layer.ks?.a) {
            layer.ks.a.k = [width / 2, height / 2];
        }
        // Update position to center of canvas (which now matches image size)
        if (layer.ks?.p) {
            layer.ks.p.k = [width / 2, height / 2];
        }
        // Set scale to 100% (display image at full asset size)
        if (layer.ks?.s) {
            layer.ks.s.k = [100, 100];
        }
    }

    return animation;
};
