// File: src/components/SharedFormFooter.js

import React, { Dispatch, SetStateAction, useRef } from "react";
import { Grid } from "@mui/material"
import { useRouter } from "next/router";
import AletheiaCaptcha from "./AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "./AletheiaButton";
import { useTranslations } from "next-intl";

interface ISharedFormFooter {
    isLoading: boolean;
    setRecaptchaString: Dispatch<SetStateAction<string>>;
    hasCaptcha: boolean;
    isDrawerOpen?: boolean;
    onClose?: () => void;
    extraButton?: React.ReactNode;
}

const SharedFormFooter = ({
    isLoading,
    setRecaptchaString,
    hasCaptcha,
    isDrawerOpen,
    onClose,
    extraButton
}: ISharedFormFooter) => {
    const recaptchaRef = useRef(null);
    const tClaimForm = useTranslations("claimForm");
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
                    type={ButtonType.gray}
                    onClick={() => isDrawerOpen ? onClose() : router.back()}
                    data-cy="testCancelButton"
                >
                    {tClaimForm("cancelButton")}
                </AletheiaButton>

                {extraButton}

                <AletheiaButton
                    loading={isLoading}
                    type={ButtonType.primary}
                    htmlType="submit"
                    disabled={!hasCaptcha || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {tClaimForm("saveButton")}
                </AletheiaButton>
            </Grid>
        </>
    );
};

export default SharedFormFooter;
