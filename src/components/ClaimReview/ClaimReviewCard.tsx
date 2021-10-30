import React, { useState } from "react";
import { Avatar, Comment } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReviewColors from "../../constants/reviewColors";
import {useTranslation} from "next-i18next";

const ClaimReviewCard = ({ classification, userName }) => {
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
                <span
                    style={{
                        color:
                            ReviewColors[classification] ||
                            "#000",
                        fontWeight: "bold",
                        textTransform: "uppercase"
                    }}
                >
                    {t(`claimReviewForm:${classification}`)}{" "}
                </span>
            }
        />
    );
}

export default ClaimReviewCard;
