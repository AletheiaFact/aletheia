// File: src/components/SharedFormFooter.js

import React, { Dispatch, SetStateAction, useRef } from "react";
import { Grid } from "@mui/material"
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import AletheiaCaptcha from "./AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "./Button";

interface ISharedFormFooter {
    isLoading: boolean;
    setRecaptchaString: Dispatch<SetStateAction<string>>;
    hasCaptcha: boolean;
    hasCancelButton?: boolean;
    extraButton?: React.ReactNode;
}

const SharedFormFooter = ({
    isLoading,
    setRecaptchaString,
    hasCaptcha,
    hasCancelButton = true,
    extraButton
}: ISharedFormFooter) => {
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
                {hasCancelButton ?
                    <AletheiaButton
                        type={ButtonType.gray}
                        onClick={() => router.back()}
                    >
                        {t("claimForm:cancelButton")}
                    </AletheiaButton>
                    : extraButton
                }
                <AletheiaButton
                    loading={isLoading}
                    type={ButtonType.blue}
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
