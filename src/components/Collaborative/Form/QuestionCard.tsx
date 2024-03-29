import React, { useCallback, useContext } from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import Button from "../../Button";
import { useCommands } from "@remirror/react";
import { DeleteOutlined } from "@ant-design/icons";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewingSelector } from "../../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";

export const QuestionCard = ({ forwardRef, node, initialPosition }) => {
    const { t } = useTranslation();
    const { machineService } = useContext(ReviewTaskMachineContext);
    const editable = useSelector(machineService, reviewingSelector);
    const command = useCommands();

    const handleDelete = useCallback(
        () =>
            command.delete({
                from: initialPosition,
                to: initialPosition + node.nodeSize,
            }),
        [command, initialPosition, node.nodeSize]
    );

    return (
        <CardStyle>
            <label>{t("claimReviewForm:questionsLabel")}</label>
            <Col span={24} style={{ display: "flex", position: "initial" }}>
                <Col span={21} className="card-container">
                    <div
                        className="card-content"
                        data-cy="testClaimReviewquestions0"
                        style={{
                            minHeight: "40px",
                        }}
                    >
                        <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                    </div>
                </Col>
                <Col span={3}>
                    <Button
                        style={{ height: "40px", margin: "0 auto" }}
                        onClick={handleDelete}
                        disabled={editable}
                        data-cy="testClaimReviewquestionsRemove1"
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
