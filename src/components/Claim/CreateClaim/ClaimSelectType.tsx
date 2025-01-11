import {
    InsertDriveFileOutlined,
    PhotoSizeSelectActualOutlined,
    VideocamOutlined,
} from "@mui/icons-material";
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
    const Sizeicon = { fontSize: "22px", margin: "0 5 5 0" };

    const icons = {
        [ContentModelEnum.Image]: (
            <PhotoSizeSelectActualOutlined style={Sizeicon} />
        ),
        [ContentModelEnum.Speech]: <InsertDriveFileOutlined style={Sizeicon} />,
        [ContentModelEnum.Debate]: <VideocamOutlined style={Sizeicon} />,
        [ContentModelEnum.Unattributed]: (
            <InsertDriveFileOutlined style={Sizeicon} />
        ),
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

            <Grid
                container
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
                        style={{ gap: "10px", textTransform: "uppercase" }}
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
