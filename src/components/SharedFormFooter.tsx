// File: src/components/SharedFormFooter.js

import React, { useRef } from "react";
import { Grid } from "@mui/material"
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import AletheiaCaptcha from "./AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "./Button";

const SharedFormFooter = ({ isLoading, setRecaptchaString, hasCaptcha }) => {
    const recaptchaRef = useRef(null);
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <>
            <AletheiaCaptcha onChange={setRecaptchaString} ref={recaptchaRef} />
            <Grid container
                style={{
                    padding: "32px 0 0",
                    justifyContent: "space-evenly",
                }}
            >
                <AletheiaButton
                    buttonType={ButtonType.gray}
                    onClick={() => router.back()}
                >
                    {t("claimForm:cancelButton")}
                </AletheiaButton>
                <AletheiaButton
                    loading={isLoading}
                    buttonType={ButtonType.blue}
                    htmlType="submit"
                    disabled={!hasCaptcha || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </AletheiaButton>
            </Grid>
        </>
    );
};

export default SharedFormFooter;
