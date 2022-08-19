import React, { useState } from "react";
import ClaimSentenceCard from "./ClaimSentenceCard";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";
import SocialMediaShare from "../SocialMediaShare";
import DynamicForm from "./form/DynamicForm";
import { useAppSelector } from "../../store/store";
import TopicInput from "./TopicInput";

const ClaimReviewForm = ({
    personality,
    claim,
    sentence,
    href,
    claimReviewTask,
    sitekey,
}) => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));
    const claimId = claim._id;
    const personalityId = personality._id;
    const sentenceHash = sentence.data_hash;
    const [formCollapsed, setFormCollapsed] = useState(
        claimReviewTask ? false : true
    );

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    return (
        <>
            <Col
                offset={3}
                span={18}
                style={{
                    background: colors.lightGray,
                    padding: "0px 15px 20px",
                    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
                }}
            >
                <ClaimSentenceCard
                    personality={personality}
                    date={claim.date}
                    sentence={sentence}
                    summaryClassName="claim-review"
                    claimType={claim?.type}
                    cardActions={[
                        <TopicInput
                            sentence_hash={sentence.data_hash}
                            topics={sentence.topics}
                        />,
                    ]}
                />
                {formCollapsed && (
                    <Row
                        style={{
                            width: "100%",
                            padding: "0px 0px 15px 0px",
                            justifyContent: "center",
                        }}
                    >
                        <>
                            {isLoggedIn && (
                                <Button
                                    type={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    icon={<PlusOutlined />}
                                    data-cy={"testAddReviewButton"}
                                >
                                    {t("claimReviewForm:addReviewButton")}
                                </Button>
                            )}
                        </>
                    </Row>
                )}
                <Col
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "0px 0px 15px 0px",
                    }}
                >
                    {!isLoggedIn && (
                        <Button href="/login">
                            {t("claimReviewForm:loginButton")}
                        </Button>
                    )}
                </Col>
                {!formCollapsed && (
                    <DynamicForm
                        sentence_hash={sentenceHash}
                        personality={personalityId}
                        claim={claimId}
                        sitekey={sitekey}
                    />
                )}
            </Col>
            <SocialMediaShare
                quote={personality?.name}
                href={href}
                claim={claim?.title}
            />
        </>
    );
};

export default ClaimReviewForm;
