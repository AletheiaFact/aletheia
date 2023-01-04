/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
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
    const container = useRef(null);

    useEffect(() => {
        generateLottie(classification, imageUrl).then((newAnimation) => {
            setAnimation(newAnimation);
        });
    }, []);

    useEffect(() => {
        console.log(classification);
        if (classification) {
            lottie.loadAnimation({
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
