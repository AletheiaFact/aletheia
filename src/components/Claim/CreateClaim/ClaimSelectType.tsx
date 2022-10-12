import { FileOutlined, PictureOutlined } from "@ant-design/icons";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import AletheiaButton from "../../Button";

const ClaimSelectType = () => {
    const { machineService } = useContext(CreateClaimMachineContext);
    const { t } = useTranslation();

    const handleClickSpeech = () => {
        machineService.send(CreateClaimEvents.startSpeech);
    };

    const handleClickImage = () => {
        machineService.send(CreateClaimEvents.startImage);
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
                >
                    <PictureOutlined />
                    {t("claimForm:image")}
                </AletheiaButton>
                <AletheiaButton
                    onClick={handleClickSpeech}
                    style={{ textTransform: "uppercase" }}
                >
                    <FileOutlined />
                    {t("claimForm:speech")}
                </AletheiaButton>
            </Col>
        </>
    );
};

export default ClaimSelectType;
