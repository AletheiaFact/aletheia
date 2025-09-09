/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { generateLottie } from "../lottiefiles/generateLottie";
import { ClassificationEnum } from "../types/enums";

const ReviewedImage = ({
    imageUrl,
    title = "",
    classification,
}: {
    imageUrl: string;
    title: string;
    classification?: keyof typeof ClassificationEnum;
}) => {
    const [animation, setAnimation] = useState<any>(null);
    const [lottieInstance, setLottieInstance] = useState<any>(null);
    const [animationInstance, setAnimationInstance] = useState<any>(null);
    const container = useRef(null);
    const getImageMeta = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = url;
        });

    // get the natural width and height of the image or fit it to the window
    const getDimensions = async (imageData: any) => {
        try {
            const image = await getImageMeta(imageData);

            // @ts-ignore
            let { naturalWidth: width, naturalHeight: height } = image;
            const windowHeight = window.innerHeight;
            // 2.25 is the ratio of the lottie container to the window
            // determined by 66.6% of the claim container
            // inside a section with 66.6% of the window
            const windowWidth = window.innerWidth / 2.25;

            const aspectRatio = width / height;

            if (height > windowHeight) {
                height = windowHeight;
                width = height * aspectRatio;
            }
            if (width > windowWidth) {
                width = windowWidth;
                height = width / aspectRatio;
            }
            return { width, height };
        } catch (error) {
            console.log(error);
            return { width: 500, height: 500 };
        }
    };
    useEffect(() => {
        // Only load lottie on client side
        if (typeof window !== 'undefined' && !lottieInstance) {
            import('lottie-web').then((lottie) => {
                setLottieInstance(lottie.default);
            });
        }
        
        if (typeof window !== 'undefined') {
            getDimensions(imageUrl).then(({ width, height }) => {
                const newAnimation = generateLottie(
                    classification,
                    imageUrl,
                    width,
                    height
                );
                setAnimation(newAnimation);
            });
        }
    }, [imageUrl, classification]);

    useEffect(() => {
        if (classification && lottieInstance && animation && container.current) {
            const newAnimationInstance = lottieInstance.loadAnimation({
                container: container.current,
                renderer: "svg",
                loop: false,
                autoplay: false,
                animationData: animation,
                rendererSettings: {
                    preserveAspectRatio: "xMinYMin meet",
                    viewBoxSize: "10 10",
                },
            });
            newAnimationInstance.setSpeed(1.5);
            setAnimationInstance(newAnimationInstance);
            
            return () => {
                if (newAnimationInstance) {
                    newAnimationInstance.destroy();
                }
            };
        }
    }, [animation, classification, lottieInstance]);

    const handleMouseEnter = () => {
        if (animationInstance) {
            animationInstance.setDirection(1);
            animationInstance.play();
        }
    };

    const handleMouseLeave = () => {
        if (animationInstance) {
            animationInstance.setDirection(-1);
            animationInstance.play();
        }
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
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100vh",
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
                    }}
                />
            )}
        </>
    );
};

export default ReviewedImage;
