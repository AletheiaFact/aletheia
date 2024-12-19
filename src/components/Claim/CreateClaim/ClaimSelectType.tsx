import {
    FileOutlined,
    PictureOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Grid } from "@mui/material";
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

            <Grid container
                style={{
                    gap: "10px",
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
            </Grid>
        </>
    );
};

export default ClaimSelectType;
