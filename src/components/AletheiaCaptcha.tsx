import React, { forwardRef, useImperativeHandle } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppSelector } from "../store/store";
const recaptchaRef = React.createRef<ReCAPTCHA>();

interface CaptchaProps {
    onChange: (captchaString: string) => void;
}

const AletheiaCaptcha = forwardRef(({ onChange }: CaptchaProps, ref) => {
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
    };

    const onExpiredCaptcha = () => {
        onChange("");
    };

    return (
        <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={sitekey}
            onChange={handleChangeCaptcha}
            onExpired={onExpiredCaptcha}
        />
    );
});

export default AletheiaCaptcha;
