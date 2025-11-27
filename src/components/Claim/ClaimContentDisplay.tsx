import React from "react";

import ClaimImageBody from "./ClaimImageBody";
import ClaimSpeechBody from "./ClaimSpeechBody";

interface ClaimContentDisplayProps {
    isImage: boolean;
    title: string;
    claimContent: any;
    showHighlights: boolean;
    dispatchPersonalityAndClaim: () => void;
}

const ClaimContentDisplay: React.FC<ClaimContentDisplayProps> = ({
    isImage,
    title,
    claimContent,
    showHighlights,
    dispatchPersonalityAndClaim,
}) => {
    const imageUrl = claimContent.content;
    const paragraphs = Array.isArray(claimContent)
        ? claimContent
        : [claimContent];

    return (
        <>
            {isImage ? (
                <ClaimImageBody
                    imageUrl={imageUrl}
                    title={title}
                    classification={claimContent?.props?.classification}
                    dataHash={claimContent?.data_hash}
                />
            ) : (
                <cite style={{ fontStyle: "normal" }}>
                    <ClaimSpeechBody
                        handleSentenceClick={dispatchPersonalityAndClaim}
                        paragraphs={paragraphs}
                        showHighlights={showHighlights}
                    />
                </cite>
            )}
        </>
    );
};

export default ClaimContentDisplay;
