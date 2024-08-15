import { useState } from "react";
import moment from "moment";

const useFormManagement = (disableFutureDates) => {
    const [recaptcha, setRecaptcha] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [date, setDate] = useState("");

    const disabledDate = (current) => {
        return disableFutureDates && current && current > moment().endOf("day");
    };

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

    return {
        recaptcha,
        disableSubmit,
        date,
        setDate,
        disabledDate,
        onChangeCaptcha,
    };
};

export default useFormManagement;
