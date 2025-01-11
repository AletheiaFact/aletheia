import React, { useState } from "react";
import LargeDrawer from "../LargeDrawer";
import { Grid, Typography } from "@mui/material";
import colors from "../../styles/colors";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../Button";
import { DeleteOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import WarningModal from "../Modal/WarningModal";

const VerificationRequestDrawer = ({
    groupContent,
    open,
    onCloseDrawer,
    isLoading,
    onRemove,
}) => {
    const { t } = useTranslation();
    const [removeWarningModal, setRemoveWarningModal] = useState(false);

    return (
        <LargeDrawer
            open={open}
            onClose={onCloseDrawer}
            backgroundColor={colors.lightNeutralSecondary}
        >
            <Grid item style={{ margin: "32px 64px" }}>
                <Typography fontWeight={700} variant="h5">
                    {t("verificationRequest:verificationRequestTitle")}s
                </Typography>
                {groupContent?.length > 0 ? (
                    groupContent?.map((item) => (
                        <>
                            <VerificationRequestCard
                                key={item._id}
                                verificationRequest={item}
                                t={t}
                                actions={[
                                    <AletheiaButton
                                        key="remove"
                                        onClick={() =>
                                            setRemoveWarningModal(true)
                                        }
                                        loading={isLoading}
                                    >
                                        <DeleteOutlined fontSize="small" />
                                    </AletheiaButton>,
                                ]}
                            />
                            <WarningModal
                                open={removeWarningModal}
                                title={t("warningModal:title", {
                                    warning: t(
                                        "warningModal:removeVerificationRequest"
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
                        {t("verificationRequest:noVerificationRequestsMessage")}
                    </span>
                )}
            </Grid>
        </LargeDrawer>
    );
};

export default VerificationRequestDrawer;
