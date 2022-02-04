import React, { useState } from "react";
import {Avatar, Collapse, Comment, Row} from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReviewColors from "../../constants/reviewColors";
import {useTranslation} from "next-i18next";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import {LinkPreview} from "@dhaiwat10/react-link-preview";

const ClaimReviewCard = ({ classification, userName, sources, report }) => {
    const { t } = useTranslation();

    const username = userName || t("claimReview:anonymousUserName");

    return (
        <Comment
            style={{
                width: "100%"
            }}
            avatar={<Avatar size={45} icon={<UserOutlined />} />}
            author={t("claimReview:cardAuthor", {
                name: username
            })}
            content={
                <Row>
                    <Row style={{
                        width: "100%",
                        padding: "10px 0px"

                    }}>
                        <span
                            style={{
                                color:
                                    ReviewColors[classification] ||
                                    "#000",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            {t(`claimReviewForm:${classification}`)}{" "}
                        </span>
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
                                            secondaryTextColor="#515151"
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
