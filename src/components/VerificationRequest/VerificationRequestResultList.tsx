import { Col } from "antd";
import React, { useContext } from "react";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../Button";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import { useTranslation } from "next-i18next";
import VerificationRequestResultListStyled from "./VerificationRequestRecommedations.style";

const VerificationRequestResultList = ({ results }) => {
    const { t } = useTranslation();
    const { group, addRecommendation } = useContext(VerificationRequestContext);

    const checkIfIsInGroup = (verificationRequestId): boolean => {
        for (const verificationRequest of group.content) {
            if (verificationRequest._id === verificationRequestId) {
                return true;
            }

            continue;
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
                            content={verificationRequest.content}
                            expandable={false}
                            style={{ minHeight: "100%" }}
                            actions={[
                                <AletheiaButton
                                    disabled={checkIfIsInGroup(
                                        verificationRequest._id
                                    )}
                                    onClick={() =>
                                        addRecommendation(verificationRequest)
                                    }
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
