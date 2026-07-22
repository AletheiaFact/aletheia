import React, { forwardRef, useImperativeHandle, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppSelector } from "../store/store";
import Typography from "@mui/material/Typography";
import colors from "../styles/colors";
import { useTranslations } from "next-intl";
const recaptchaRef = React.createRef<ReCAPTCHA>();

interface CaptchaProps {
    onChange: (captchaString: string) => void;
}

const AletheiaCaptcha = forwardRef(({ onChange }: CaptchaProps, ref) => {
    const [showRequired, setShowRequired] = useState(true);
    const tCommon = useTranslations("common");
    // Allows the parent component to call function inside this block by using a ref
    useImperativeHandle(ref, () => ({
        resetRecaptcha: () => {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        },
    }));

    const { sitekey, vw } = useAppSelector((state) => state);

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
                size={vw?.xs ? "compact" : "normal"}
                onChange={handleChangeCaptcha}
                onExpired={onExpiredCaptcha}
            />
            {showRequired && (
                <Typography variant="h1" style={{ color: colors.error, fontSize: 16 }} >{tCommon("requiredFieldError")}</Typography>
            )}
        </div>
    );
});

export default AletheiaCaptcha;
