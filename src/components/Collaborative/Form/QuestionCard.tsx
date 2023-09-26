import React, { useCallback } from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import Button from "../../Button";
import { useCommands } from "@remirror/react";
import { DeleteOutlined } from "@ant-design/icons";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";

export const QuestionCard = ({ forwardRef, node }) => {
    const { t } = useTranslation();
    const command = useCommands();
    const handleDelete = useCallback(() => command.delete(), [command]);

    return (
        <CardStyle>
            <label>{t("claimReviewForm:questionsLabel")}</label>
            <Col span={24} style={{ display: "flex", position: "initial" }}>
                <Col span={21} className="card-container">
                    <div
                        className="card-content"
                        style={{ height: "40px", minHeight: "40px" }}
                    >
                        <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                    </div>
                </Col>
                <Col span={3}>
                    <Button
                        style={{ height: "40px", margin: "0 auto" }}
                        onClick={handleDelete}
                    >
                        <DeleteOutlined />
                    </Button>
                </Col>
            </Col>
        </CardStyle>
    );
};

export const getQuestionContentHtml = () => `
    <div data-question-id="${uniqueId()}">
        <p></p>
    </div>`;
