import { Grid } from "@mui/material";
import React, { useContext, useState } from "react";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../AletheiaButton";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import { useTranslation } from "next-i18next";

const VerificationRequestResultList = ({ results }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { group, addRecommendation } = useContext(VerificationRequestContext);

    const checkIfIsInGroup = (verificationRequestId): boolean => {
        if (group && Array.isArray(group.content)) {
            for (const verificationRequest of group.content) {
                if (verificationRequest?._id === verificationRequestId) {
                    return true;
                }
            }
        }

        return false;
    };

    return (
        <Grid className="verification-request-list" container xs={12} spacing={2}>
            {results?.length > 0 &&
                results.map((verificationRequest) => (
                    <Grid item sm={12} md={6} xl={4} key={verificationRequest._id}>
                        <VerificationRequestCard
                            verificationRequest={verificationRequest}
                            expandable={false}
                            t={t}
                            style={{ minHeight: "100%" }}
                            actions={[
                                <Grid container
                                    justifyContent="center"
                                    key={`add-${verificationRequest._id}`}
                                >
                                    <AletheiaButton
                                        disabled={checkIfIsInGroup(
                                            verificationRequest._id
                                        )}
                                        loading={isLoading}
                                        onClick={async () => {
                                            setIsLoading(true);
                                            await addRecommendation(
                                                verificationRequest
                                            );
                                            setIsLoading(false);
                                        }}
                                    >
                                        {checkIfIsInGroup(verificationRequest._id)
                                            ? t(
                                                "verificationRequest:alreadyInGroupMessage"
                                            )
                                            : t(
                                                "verificationRequest:addInGroupButton"
                                            )}
                                    </AletheiaButton>
                                </Grid>
                            ]}
                        />
                    </Grid>
                ))}
        </Grid>
    );
};

export default VerificationRequestResultList;
