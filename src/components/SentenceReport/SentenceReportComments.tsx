import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ClassificationText from "../ClassificationText";
import reviewColors from "../../constants/reviewColors";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const SentenceReportComments = ({ context }) => {
    const { t } = useTranslation();
    const crossCheckingComments =
        context?.crossCheckingComments?.filter(
            (comment) => !comment?.resolved
        ) || [];

    const getDate = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <>
            {crossCheckingComments?.map((crossCheckingComment) => (
                <Accordion
                    key={crossCheckingComment._id}
                    style={{
                        backgroundColor: colors.lightNeutralSecondary,
                        marginBottom: "16px",
                        borderTop: `3px solid ${
                            reviewColors[crossCheckingComment.text]
                        }`,
                        borderRadius: "4px",
                        boxShadow: "none",
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="cross-check-content"
                        id="cross-check-header"
                    >
                        Cross-check: {crossCheckingComment?.user?.name}
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>
                            {t("claimForm:dateField")}{" "}
                            {getDate(crossCheckingComment.createdAt)}
                        </p>
                        <p>
                            {t("claimReview:crossCheckingClassification")}:{" "}
                            <ClassificationText
                                classification={crossCheckingComment.text}
                            />
                        </p>
                        <p>
                            {t("claimReview:crossCheckingComments")}:{" "}
                            {crossCheckingComment.comment}
                        </p>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default SentenceReportComments;
