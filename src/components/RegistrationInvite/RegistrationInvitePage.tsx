import React from "react";
import { Trans, useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { trackUmamiEvent } from "../../lib/umami";
import { Box } from "@mui/material";

const RegistrationInvite = () => {
    const { t } = useTranslation();
    return (
        <Box
            style={{
                width: "100%",
                marginTop: "60px",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 600,
            }}
        >
            <Trans i18nKey="notFound:signupInvite" />
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                    padding: "0 15px",
                    margin: "20px",
                    fontWeight: 700,
                }}
            >
                <AletheiaButton
                    onClick={() =>
                        trackUmamiEvent(
                            "cta-registration-button",
                            "registration"
                        )
                    }
                    type={ButtonType.primary}
                    href="/sign-up"
                    data-cy="testCTAButton"
                >
                    {t("home:createAccountButton")}
                </AletheiaButton>
            </Box>
        </Box>
    );
};

export default RegistrationInvite;
