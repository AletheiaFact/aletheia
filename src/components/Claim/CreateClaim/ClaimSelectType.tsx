import {
    FileOutlined,
    PictureOutlined,
    VideoCameraOutlined,
    CommentOutlined,
} from "@ant-design/icons";
import { Col } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import { ContentModelEnum } from "../../../types/enums";
import AletheiaButton from "../../Button";

const ClaimSelectType = () => {
    const [, send] = useAtom(createClaimMachineAtom);
    const { t } = useTranslation();

    const icons = {
        [ContentModelEnum.Image]: <PictureOutlined />,
        [ContentModelEnum.Speech]: <FileOutlined />,
        [ContentModelEnum.Debate]: <VideoCameraOutlined />,
        [ContentModelEnum.Interview]: <CommentOutlined />,
        [ContentModelEnum.Unattributed]: <FileOutlined />,
    };

    const handleClickStart = (event) => {
        send(CreateClaimEvents[`start${event}`]);
    };

    return (
        <>
            <div style={{ marginTop: "24px" }}>
                <h3
                    style={{
                        fontSize: "18px",
                        lineHeight: "24px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    {t("claimForm:contentModelTitle")}
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    {t("claimForm:selectContentModel")}
                </p>
            </div>

            <Col
                style={{
                    margin: "24px 0",
                    display: "flex",
                    justifyContent: "space-evenly",
                }}
            >
                {Object.keys(ContentModelEnum).map((key) => (
                    <AletheiaButton
                        onClick={() => handleClickStart(key)}
                        style={{ textTransform: "uppercase" }}
                        data-cy={`testSelectType${key}`}
                        key={key}
                    >
                        {icons[key]}
                        {t(`claimForm:${key}`)}
                    </AletheiaButton>
                ))}
            </Col>
        </>
    );
};

export default ClaimSelectType;
