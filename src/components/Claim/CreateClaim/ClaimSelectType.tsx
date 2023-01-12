import {
    FileOutlined,
    PictureOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Col } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import AletheiaButton from "../../Button";

const ClaimSelectType = () => {
    const [, send] = useAtom(createClaimMachineAtom);
    const { t } = useTranslation();

    const handleClickSpeech = () => {
        send(CreateClaimEvents.startSpeech);
    };

    const handleClickImage = () => {
        send(CreateClaimEvents.startImage);
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
                <AletheiaButton
                    onClick={handleClickImage}
                    style={{ textTransform: "uppercase" }}
                    data-cy="testSelectTypeImage"
                >
                    <PictureOutlined />
                    {t("claimForm:image")}
                </AletheiaButton>
                <AletheiaButton
                    onClick={handleClickSpeech}
                    style={{ textTransform: "uppercase" }}
                    data-cy="testSelectTypeSpeech"
                >
                    <FileOutlined />
                    {t("claimForm:speech")}
                </AletheiaButton>
                <AletheiaButton
                    onClick={handleClickSpeech}
                    style={{ textTransform: "uppercase" }}
                    data-cy="testSelectTypeDebate"
                >
                    <VideoCameraOutlined />
                    {t("claimForm:debate")}
                </AletheiaButton>
            </Col>
        </>
    );
};

export default ClaimSelectType;
