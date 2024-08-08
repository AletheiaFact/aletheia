import { Col } from "antd";
import React, { useContext, useState } from "react";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../Button";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import { useTranslation } from "next-i18next";
import VerificationRequestResultListStyled from "./VerificationRequestRecommedations.style";

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
        <VerificationRequestResultListStyled>
            {results?.length > 0 &&
                results.map((verificationRequest) => (
                    <Col
                        style={{ width: "300px" }}
                        key={verificationRequest._id}
                    >
                        <VerificationRequestCard
                            content={verificationRequest}
                            expandable={false}
                            t={t}
                            style={{ minHeight: "100%" }}
                            actions={[
                                <AletheiaButton
                                    key={`add-${verificationRequest._id}`}
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
                                </AletheiaButton>,
                            ]}
                        />
                    </Col>
                ))}
        </VerificationRequestResultListStyled>
    );
};

export default VerificationRequestResultList;
