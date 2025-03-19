import { useTranslation } from "next-i18next";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppSelector } from "../store/store";
import Typography from "@mui/material/Typography";
import colors from "../styles/colors";
const recaptchaRef = React.createRef<ReCAPTCHA>();

interface CaptchaProps {
    onChange: (captchaString: string) => void;
}

const AletheiaCaptcha = forwardRef(({ onChange }: CaptchaProps, ref) => {
    const [showRequired, setShowRequired] = useState(true);
    const { t } = useTranslation();
    // Allows the parent component to call function inside this block by using a ref
    useImperativeHandle(ref, () => ({
        resetRecaptcha: () => {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        },
    }));

    const { sitekey } = useAppSelector((state) => state);

    const handleChangeCaptcha = async () => {
        const recaptchaString: string = recaptchaRef.current.getValue();
        onChange(recaptchaString);
        setShowRequired(false);
    };

    const onExpiredCaptcha = () => {
        onChange("");
        setShowRequired(true);
    };

    return (
        <div>
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={sitekey}
                onChange={handleChangeCaptcha}
                onExpired={onExpiredCaptcha}
            />
            {showRequired && (
                <Typography variant="h1" style={{ color: colors.error, fontSize: 16 }} >{t("common:requiredFieldError")}</Typography>
            )}
        </div>
    );
});

export default AletheiaCaptcha;
