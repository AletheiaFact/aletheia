import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SITEKEY } from "../lib/recaptcha";
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

    const [captchaString, setCaptchaString] = useState("");

    const handleChangeCaptcha = async () => {
        const recaptchaString: string = recaptchaRef.current.getValue();
        setCaptchaString(recaptchaString);
    };

    const onExpiredCaptcha = () => {
        setCaptchaString("");
    };

    useEffect(() => {
        onChange(captchaString);
    }, [captchaString]);

    return (
        <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITEKEY}
            onChange={handleChangeCaptcha}
            onExpired={onExpiredCaptcha}
        />
    );
});

export default AletheiaCaptcha;
