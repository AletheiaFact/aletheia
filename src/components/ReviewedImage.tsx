/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import { generateLottie, LottieAnimation } from "../lottiefiles/generateLottie";
import { ClassificationEnum } from "../types/enums";

interface ImageDimensions {
    width: number;
    height: number;
}

const getImageMeta = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });

const getDimensions = async (imageData: string): Promise<ImageDimensions> => {
    try {
        const image = await getImageMeta(imageData);
        const width = image.naturalWidth;
        const height = image.naturalHeight;

        return { width, height };
    } catch (error) {
        console.error("Failed to load image dimensions:", error);
        return { width: 500, height: 500 };
    }
};

const ReviewedImage = ({
    imageUrl,
    title = "",
    classification,
}: {
    imageUrl: string;
    title: string;
    classification?: keyof typeof ClassificationEnum;
}) => {
    const [animation, setAnimation] = useState<LottieAnimation | null>(null);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!classification) return;

        getDimensions(imageUrl).then(({ width, height }) => {
            const newAnimation = generateLottie(
                classification,
                imageUrl,
                width,
                height
            );
            setAnimation(newAnimation);
        });
    }, [imageUrl, classification]);

    useEffect(() => {
        if (classification) {
            lottie.loadAnimation({
                container: container.current,
                renderer: "svg",
                loop: false,
                autoplay: false,
                animationData: animation,
                rendererSettings: {
                    preserveAspectRatio: "xMidYMid meet",
                },
            });
            lottie.setSpeed(1.5);
        }
        return () => {
            lottie.destroy();
        };
    }, [animation, classification]);

    const handleMouseEnter = () => {
        lottie.setDirection(1);
        lottie.play();
    };

    const handleMouseLeave = () => {
        lottie.setDirection(-1);
        lottie.play();
    };
    return (
        <>
            {classification ? (
                <>
                    {animation && (
                        <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            ref={container}
                            aria-hidden="true"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        />
                    )}
                </>
            ) : (
                <img
                    src={imageUrl}
                    alt={`${title} claim`}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100vh",
                        display: "block",
                        margin: "0 auto",
                    }}
                />
            )}
        </>
    );
};

export default ReviewedImage;
