import React from "react";
import { Avatar, Collapse, Comment, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReviewColors from "../../constants/reviewColors";
import { useTranslation } from "next-i18next";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import colors from "../../styles/colors";

const ClaimReviewCard = ({ classification, userName, sources, report }) => {
    const { t } = useTranslation();

    const username = userName || t("claimReview:anonymousUserName");

    return (
        <Comment
            style={{
                width: "100%",
                border: `1px solid ${colors.lightGray}`,
                boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                padding: 16

            }}
            avatar={<Avatar size={45} icon={<UserOutlined />} />}
            author={
                <h2
                    style={{
                        fontSize: 14,
                        marginBottom: 0,
                        fontWeight: 400
                    }}
                >
                    {t("claimReview:cardAuthor", { name: username })}
                </h2>
            }
            content={
                <Row>
                    <Row style={{
                        width: "100%",
                        padding: "10px 0px"

                    }}>
                        <h3
                            style={{
                                color:
                                    ReviewColors[classification] ||
                                    "#000",
                                fontWeight: "bold",
                                fontSize: 14,
                                textTransform: "uppercase",
                                width: "100%",
                                textAlign: "center",
                                marginBottom: 0,
                            }}
                        >
                            {t(`claimReviewForm:${classification}`)}{" "}
                        </h3>
                    </Row>
                    <Row style={{
                        width: "100%"
                    }}>
                        {report && (
                            <Collapse
                                defaultActiveKey={['1']}
                                style={{
                                    width: "100%"
                                }}
                            >
                                <Collapse.Panel header={t("claimReviewForm:reportHeading")} key="2">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]} children={report} />
                                </Collapse.Panel>
                            </Collapse>
                        )}
                        {sources && (
                            <Collapse
                                defaultActiveKey={['1']}
                                style={{
                                    width: "100%"
                                }}
                            >
                                <Collapse.Panel header={t("claimReviewForm:sourcesHeading")} key="3">
                                    {sources.map(
                                        (source) => <LinkPreview
                                            key={source._id}
                                            url={source.link}
                                            borderRadius="10px"
                                            borderColor="transparent"
                                            imageHeight="156px"
                                            secondaryTextColor={colors.blackSecondary}
                                            width="100%"
                                        />
                                    )}
                                </Collapse.Panel>
                            </Collapse>
                        )}
                    </Row>
                </Row>
            }
        />
    );
}

export default ClaimReviewCard;
