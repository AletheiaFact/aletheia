import React from "react";
// import { Radio, Space } from "antd";
import { Radio, RadioGroup, FormControlLabel, Stack } from "@mui/material"
import styled from "styled-components";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const RadioInput = styled(Radio)`
    margin: 10px 0 0 0;

    &.Mui-checked {
    border: 2px solid
        color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
    }

    &.MuiRadio-root {
    color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
        width: 25px;
        height: 25px;
    }

    &.Mui-checked::after {
        background-color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
        position: relative;
        top: 3px;
        left: 3px;
        width: 31px;
        height: 31px;
    }

    &.MuiRadio-root::before {
        box-shadow: 0px 0px 6px ${colors.shadow};
    }
`;
//TODO: order by checked input label isn't bold

interface OrderRadioProps {
    value: "asc" | "desc";
    setValue: (value: string) => void;
}

const OrderRadio = ({ value, setValue }: OrderRadioProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const onChangeRadio = (e) => {
        setValue(e.target.value);
    };

    return (
        <RadioGroup
            onChange={onChangeRadio}
            value={value}
        >
            <Stack sx={{ marginTop: "30px" }} spacing={2}>
                <FormControlLabel
                    value="asc"
                    control={<RadioInput namespace={nameSpace} />}
                    label={
                        <span style={{ fontSize: 18, color: colors.blackSecondary, padding: "0 10px" }}>
                            {t("orderModal:radioAsc")}
                        </span>
                    }
                />
                <FormControlLabel
                    value="desc"
                    control={<RadioInput namespace={nameSpace} />}
                    label={
                        <span style={{ fontSize: 18, color: colors.blackSecondary, padding: "0 10px" }}>
                            {t("orderModal:radioDesc")}
                        </span>
                    }
                />
            </Stack>
        </RadioGroup>
    );
};

export default OrderRadio;
