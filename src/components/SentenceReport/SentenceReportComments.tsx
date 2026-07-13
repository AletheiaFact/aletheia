import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ClassificationText from "../ClassificationText";
import reviewColors from "../../constants/reviewColors";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

const SentenceReportComments = ({ context }) => {
    const tClaimForm = useTranslations("claimForm");
    const tClaimReview = useTranslations("claimReview");
    const crossCheckingComments = context?.crossCheckingComments || [];

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
                        borderTop: `3px solid ${reviewColors[crossCheckingComment.text]
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
                            {tClaimForm("dateField")}{" "}
                            {getDate(crossCheckingComment.createdAt)}
                        </p>
                        <p>
                            {tClaimReview("crossCheckingClassification")}:{" "}
                            <ClassificationText
                                classification={crossCheckingComment.text}
                            />
                        </p>
                        <Typography
                            variant="body2"
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {tClaimReview("crossCheckingComments")}:{" "}
                            {crossCheckingComment.comment}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default SentenceReportComments;
