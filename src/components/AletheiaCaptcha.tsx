import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import CaptchaApi from '../api/captchaApi';

const recaptchaRef = React.createRef<ReCAPTCHA>();

interface CaptchaProps {
    sitekey: string;
    onChange: (isCaptchaValid: boolean) => void;
}

const AletheiaCaptcha = ({ sitekey, onChange }: CaptchaProps) => {
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);

    const handleChangeCaptcha = async () => {
        const recaptchaString: string = recaptchaRef.current.getValue();
        const { success } = await CaptchaApi.validateCaptcha(recaptchaString);
        setIsCaptchaValid(success)
    }

    const onExpiredCaptcha = () => {
        setIsCaptchaValid(false)
    }

    useEffect(
        () => {
            onChange(isCaptchaValid)
        }, [isCaptchaValid]
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
