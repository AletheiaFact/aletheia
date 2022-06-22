import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
const recaptchaRef = React.createRef<ReCAPTCHA>();

interface CaptchaProps {
    sitekey: string;
    onChange: (captchaString: string) => void;
}

const AletheiaCaptcha = ({ sitekey, onChange }: CaptchaProps) => {
    const [captchaString, setCaptchaString] = useState('')

    const handleChangeCaptcha = async () => {
        const recaptchaString: string = recaptchaRef.current.getValue();
        setCaptchaString(recaptchaString);
    }

    const onExpiredCaptcha = () => {
        setCaptchaString('')
    }

    useEffect(
        () => {
            onChange(captchaString)
        }, [captchaString]
    )

    return (
        <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={sitekey}
            onChange={handleChangeCaptcha}
            onExpired={onExpiredCaptcha}
        />
    )
}

export default AletheiaCaptcha
