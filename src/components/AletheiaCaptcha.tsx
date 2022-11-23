import { useTranslation } from "next-i18next";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppSelector } from "../store/store";
import Text from "antd/lib/typography/Text";
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
                <Text type="danger">{t("common:requiredFieldError")}</Text>
            )}
        </div>
    );
});

export default AletheiaCaptcha;
