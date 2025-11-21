import React from "react";
import { useDispatch } from "react-redux";

import ImageApi from "../../api/image";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import ReviewedImage from "../ReviewedImage";
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
    const { selectedContent } = useAppSelector((state) => state);
    const dispatch = useDispatch();
    const imageUrl = claimContent.content;
    const paragraphs = Array.isArray(claimContent)
        ? claimContent
        : [claimContent];

    const handleClickOnImage = () => {
        ImageApi.getImageTopicsByDatahash(selectedContent?.data_hash)
            .then((image) => {
                dispatch(actions.setSelectContent(image));
            })
            .catch((e) => e);
        dispatch(actions.openReviewDrawer());
    };

    return (
        <>
            {isImage ? (
                <div
                    style={{ paddingBottom: "20px", cursor: "pointer" }}
                    onClick={handleClickOnImage}
                >
                    <ReviewedImage
                        imageUrl={imageUrl}
                        title={title}
                        classification={claimContent?.props?.classification}
                    />
                </div>
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
