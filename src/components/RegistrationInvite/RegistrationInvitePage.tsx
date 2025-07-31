import React from "react";
import { Trans } from "next-i18next";
import CTAButton from "../../components/Home/CTAButton"
import { ButtonType } from "../Button";
import { Box } from "@mui/material";


const RegistrationInvite = () => {
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
                <CTAButton type={ButtonType.blue} />
            </Box>
        </Box>
    );
};

export default RegistrationInvite;
