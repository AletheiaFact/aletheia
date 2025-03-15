import React, { useContext } from "react";
import AletheiaButton from "../../Button";
import AffixAletheiaButton from "./AffixAletheiaButton";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import { useTranslation } from "next-i18next";

const AffixPreviewButton = ({ doc }) => {
    const { t } = useTranslation();
    const { machineService, viewPreview, handleClickViewPreview } = useContext(
        ReviewTaskMachineContext
    );

    const handleOnClick = () => {
        handleClickViewPreview();
        const payload = {
            reviewData: {
                visualEditor: doc,
            },
        };
        machineService.send(ReviewTaskEvents.viewPreview, payload);
    };

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                order: 5,
            }}
        >
            <AffixAletheiaButton
                Children={
                    <AletheiaButton
                        style={{ borderRadius: "50px", height: "fit-content" }}
                        onClick={handleOnClick}
                    >
                        {viewPreview
                            ? t("claimReviewForm:hidePreview")
                            : t("claimReviewForm:viewPreview")}
                    </AletheiaButton>
                }
            />
        </div>
    );
};

export default AffixPreviewButton;
