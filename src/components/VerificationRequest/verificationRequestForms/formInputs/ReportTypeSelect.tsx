import * as React from "react";
import { ContentModelEnum } from "../../../../types/enums";
import { useTranslation } from "react-i18next";
import { IReportTypeSelect } from "../../../../types/VerificationRequest";
import OptionsSelect from "./OptionsSelect";

const ReportTypeSelect = ({
    onChange,
    defaultValue,
    placeholder,
    style = {},
    isDisabled,
    dataCy,
}: IReportTypeSelect) => {
    const { t } = useTranslation();
    const options = Object.values(ContentModelEnum).map((option) => ({
        value: option,
        label: t(`claimForm:${option}`),
    }));

    return (
        <OptionsSelect
            options={options}
            onChange={onChange}
            defaultValue={defaultValue as string}
            placeholder={placeholder}
            style={style}
            isDisabled={isDisabled}
            dataCy={dataCy}
        />
    );
};

export default ReportTypeSelect;
