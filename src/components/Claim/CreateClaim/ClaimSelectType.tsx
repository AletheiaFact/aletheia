import {
    InsertDriveFileOutlined,
    PhotoSizeSelectActualOutlined,
    VideocamOutlined
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useAtom } from "jotai";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import { ContentModelEnum } from "../../../types/enums";
import AletheiaButton from "../../AletheiaButton";
import { useTranslations } from "next-intl";

const ClaimSelectType = () => {
    const [, send] = useAtom(createClaimMachineAtom);
    const tClaimForm = useTranslations("claimForm");
    const Sizeicon = { fontSize: "22px", margin: "0 5 5 0" };

    const icons = {
        [ContentModelEnum.Image]: <PhotoSizeSelectActualOutlined style={Sizeicon} />,
        [ContentModelEnum.Speech]: <InsertDriveFileOutlined style={Sizeicon} />,
        [ContentModelEnum.Debate]: <VideocamOutlined style={Sizeicon} />,
        [ContentModelEnum.Unattributed]: <InsertDriveFileOutlined style={Sizeicon} />,
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
                    {tClaimForm("contentModelTitle")}
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    {tClaimForm("selectContentModel")}
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
                        style={{ gap: "10px", textTransform: "uppercase" }}
                        data-cy={`testSelectType${key}`}
                        key={key}
                    >
                        {icons[key]}
                        {tClaimForm(`${key}`)}
                    </AletheiaButton>
                ))}
            </Grid>
        </>
    );
};

export default ClaimSelectType;
