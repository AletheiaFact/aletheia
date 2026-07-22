import React from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { trackUmamiEvent } from "../../lib/umami";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";


const RegistrationInvite = () => {
    const tNotFound = useTranslations("notFound");
    const tHome = useTranslations("home");
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
            {tNotFound.rich("signupInvite")}
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
                    onClick={() => trackUmamiEvent("cta-registration-button", "registration")}
                    type={ButtonType.primary}
                    href="/sign-up"
                    data-cy="testCTAButton"
                >
                    {tHome("createAccountButton")}
                </AletheiaButton>
            </Box>
        </Box>
    );
};

export default RegistrationInvite;
