import React, { useState } from "react";
import LargeDrawer from "../LargeDrawer";
import { Grid, Typography } from "@mui/material"
import colors from "../../styles/colors";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { DeleteOutlined } from "@mui/icons-material";
import WarningModal from "../Modal/WarningModal";
import { useTranslations } from "next-intl";

const VerificationRequestDrawer = ({
    groupContent,
    open,
    onCloseDrawer,
    isLoading,
    onRemove,
}) => {
    const tVerificationRequest = useTranslations("verificationRequest");
    const tWarningModal = useTranslations("warningModal");
    const [removeWarningModal, setRemoveWarningModal] = useState(false);

    return (
        <LargeDrawer
            open={open}
            onClose={onCloseDrawer}
            backgroundColor={colors.lightNeutralSecondary}
        >
            <Grid item style={{ margin: "32px 64px" }}>
                <Typography fontWeight={700} variant="h5">
                    {tVerificationRequest("verificationRequestTitle")}s
                </Typography>
                {groupContent?.length > 0 ? (
                    groupContent?.map((item) => (
                        <>
                            <VerificationRequestCard
                                key={item._id}
                                verificationRequest={item}
                                t={tVerificationRequest}
                                actions={[
                                    <AletheiaButton
                                        key="remove"
                                        onClick={() =>
                                            setRemoveWarningModal(true)
                                        }
                                        loading={isLoading}
                                        type={ButtonType.primary}
                                    >
                                        <DeleteOutlined fontSize="small" />
                                    </AletheiaButton>,
                                ]}
                            />
                            <WarningModal
                                open={removeWarningModal}
                                title={tWarningModal("title", {
                                    warning: tWarningModal(
                                        "removeVerificationRequest"
                                    ),
                                })}
                                width={400}
                                handleOk={() => {
                                    onRemove(item._id);
                                    setRemoveWarningModal(!removeWarningModal);
                                }}
                                handleCancel={() =>
                                    setRemoveWarningModal(!removeWarningModal)
                                }
                            />
                        </>
                    ))
                ) : (
                    <span>
                        {tVerificationRequest("noVerificationRequestsMessage")}
                    </span>
                )}
            </Grid>
        </LargeDrawer>
    );
};

export default VerificationRequestDrawer;
