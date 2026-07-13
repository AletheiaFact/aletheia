import React, { useContext, useMemo } from "react";
import { Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import AletheiaAlert from "../AletheiaAlert";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import { useAtom } from "jotai";
import { currentUserRole } from "../../atoms/currentUser";
import { Roles } from "../../types/enums";
import { useTranslations } from "next-intl";

const VerificationRequestAlert = ({ targetId, verificationRequestId }) => {
    const tVerificationRequest = useTranslations("verificationRequest");
    const tSeo = useTranslations("seo");
    const t = useTranslations();
    const [role] = useAtom(currentUserRole);
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;

    const shouldShowAlert = useMemo(() => {
        return (!targetId && isPublished && role !== Roles.Regular) || targetId;
    }, [targetId, isPublished, role]);

    const alertContent = useMemo(() => {
        if (!targetId && isPublished && role !== Roles.Regular) {
            return {
                type: "warning",
                showIcon: true,
                message: tVerificationRequest(
                    "createClaimFromVerificationRequest"
                ),
                description: (
                    <AletheiaButton
                        href={`/claim/create?verificationRequest=${verificationRequestId}`}
                        className="container-alert"
                        type={ButtonType.primary}
                    >
                        {tSeo("claimCreateTitle")}
                    </AletheiaButton>
                ),
            };
        }
        if (targetId) {
            return {
                type: "success",
                showIcon: false,
                message: tVerificationRequest("openVerificationRequestClaimLabel"),
                description: (
                    <AletheiaButton
                        href={`/claim/${targetId?.slug}`}
                        className="container-alert"
                        type={ButtonType.primary}
                    >
                        {tVerificationRequest(
                            "openVerificationRequestClaimButton"
                        )}
                    </AletheiaButton>
                ),
            };
        }
        return null;
    }, [targetId, isPublished, role, t, verificationRequestId]);

    if (!shouldShowAlert || !alertContent) {
        return null;
    }

    return (
        <Grid item xs={12}>
            <AletheiaAlert {...alertContent} />
        </Grid>
    );
};

export default VerificationRequestAlert;
