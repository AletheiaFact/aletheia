import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";

import ImageApi from "../../api/image";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import ReviewedImage from "../ReviewedImage";
import { ClassificationEnum } from "../../types/enums";
import AletheiaButton from "../AletheiaButton";
import { useTranslations } from "next-intl";

interface ClaimImageBodyProps {
    imageUrl: string;
    title: string;
    classification?: keyof typeof ClassificationEnum;
    dataHash: string;
}

const ClaimImageBody: React.FC<ClaimImageBodyProps> = ({
    imageUrl,
    title,
    classification,
    dataHash,
}) => {
    const dispatch = useDispatch();
    const tClaim = useTranslations("claim");
    const { selectedContent } = useAppSelector((state) => state);

    const handleClickOnButton = (): void => {
        ImageApi.getImageTopicsByDatahash(
            dataHash || selectedContent?.data_hash
        )
            .then((image) => {
                dispatch(actions.setSelectContent(image));
            })
            .catch((error) => {
                console.error("Failed to fetch image topics:", error);
            });
        dispatch(actions.openReviewDrawer());
    };

    const getButtonText = (): string => {
        if (classification) {
            return tClaim("openReportButton");
        }
        return tClaim("reviewImageButton");
    };

    return (
        <Box
            sx={{
                paddingBottom: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <ReviewedImage
                    imageUrl={imageUrl}
                    title={title}
                    classification={classification}
                />
            </Box>
            <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
                <AletheiaButton
                    data-cy="testReviewClaimImage"
                    onClick={handleClickOnButton}
                    fontWeight={600}
                    size="large"
                >
                    {getButtonText()}
                </AletheiaButton>
            </Box>
        </Box>
    );
};

export default ClaimImageBody;
