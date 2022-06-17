import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import CaptchaApi from '../api/captchaApi';
import Text from "antd/lib/typography/Text";
import { useTranslation } from 'next-i18next';

const recaptchaRef = React.createRef<ReCAPTCHA>();

interface CaptchaProps {
    sitekey: string;
    onChange: (isCaptchaValid: boolean) => void;
}

const AletheiaCaptcha = ({ sitekey, onChange }: CaptchaProps) => {
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
    const [error, setError] = useState([]);

    const handleChangeCaptcha = async () => {
        const recaptchaString: string = recaptchaRef.current.getValue();
        const validation = await CaptchaApi.validateCaptcha(recaptchaString);
        setError(validation["error-codes"])
        setIsCaptchaValid(validation.success)
    }

    const onExpiredCaptcha = () => {
        setIsCaptchaValid(false)
    }

    useEffect(
        () => {
            onChange(isCaptchaValid)
        }, [isCaptchaValid]
    )

    const { t } = useTranslation();


    return (
        <>
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={sitekey}
                onChange={handleChangeCaptcha}
                onExpired={onExpiredCaptcha}
            />
            {error?.length > 0 &&
                <Text type='danger' style={{ marginLeft: 20 }}>
                    {t('common:captchaError')}
                </Text>}
        </>
    )
}

export default AletheiaCaptcha
