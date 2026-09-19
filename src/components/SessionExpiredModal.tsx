import React, { useEffect, useState } from "react";
import EventEmitter from "events";
import { useTranslation } from "next-i18next";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "./AletheiaButton";
import { AletheiaModal } from "./Modal/AletheiaModal.style";
import colors from "../styles/colors";

class SessionExpiredEmitter extends EventEmitter {
    trigger(returnTo: string) {
        this.emit("sessionExpired", returnTo);
    }
}

export const sessionExpiredManager = new SessionExpiredEmitter();

export const SessionExpiredModal: React.FC = () => {
    const [returnTo, setReturnTo] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleSessionExpired = (url: string) => {
            setReturnTo(url);
        };

        sessionExpiredManager.on("sessionExpired", handleSessionExpired);

        return () => {
            sessionExpiredManager.off("sessionExpired", handleSessionExpired);
        };
    }, []);

    const handleOk = () => {
        window.location.href = `/login?return_to=${encodeURIComponent(returnTo || "/")}`;
    };

    return (
        <AletheiaModal
            open={returnTo !== null}
            closeIcon={false}
            width="400px"
            style={{ alignSelf: "flex-start", paddingTop: "15vh" }}
            title={
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                    <ErrorOutlineOutlined
                        style={{ fontSize: 26, color: colors.warning }}
                    />
                    <span
                        style={{
                            marginLeft: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            lineHeight: "18px",
                        }}
                    >
                        {t("login:sessionExpiredTitle")}
                    </span>
                </Grid>
            }
        >
            <Grid item style={{ marginTop: 12 }}>
                <p style={{ fontSize: 14, lineHeight: "20px", margin: 0 }}>
                    {t("login:sessionExpiredMessage")}
                </p>
            </Grid>
            <Grid
                item
                style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <AletheiaButton
                    onClick={handleOk}
                    type={ButtonType.primary}
                >
                    {t("login:sessionExpiredButton")}
                </AletheiaButton>
            </Grid>
        </AletheiaModal>
    );
};
