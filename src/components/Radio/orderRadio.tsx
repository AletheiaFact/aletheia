import React from "react"
import { Radio, Space } from "antd";
import styled from  "styled-components";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const RadioInput = styled(Radio)`
    margin: 10px 0 0 0;

    .ant-radio-checked .ant-radio-inner{
        border: 2px solid ${colors.blueSecondary};
        width: 25px;
        height: 25px;
    }

    .ant-radio-checked .ant-radio-inner:after{
        background-color: ${colors.blueSecondary};
        position: relative;
        top: 3px;
        left: 3px;
        width: 31px;
        height: 31px;
    }

    span .ant-radio-inner{
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
        width: 25px;
        height: 25px;
    }

    .ant-radio-wrapper-checked > span:nth-child(2) { //TODO: order by checked input label isn't bold
        font-weight: 700;
    }
`


const OrderRadio = ({ value, setValue }) => {
    const { t } = useTranslation();

    const onChangeRadio = e => {
        setValue(e.target.value);
    }

    return(
        <RadioInput.Group
            onChange={onChangeRadio}
            value={value}
        >
            <Space style={{marginTop: 10}} direction="vertical">
                <RadioInput
                    value='asc'
                >
                    <span
                        style={{
                            fontSize: 18,
                            marginLeft: 10,
                            color: colors.blackSecondary,
                        }}
                    >
                        {t("orderModal:radioAsc")}
                    </span>
                </RadioInput>
                <RadioInput
                    value='desc'
                >
                    <span
                        style={{
                            fontSize: 18,
                            marginLeft:10,
                            color: colors.blackSecondary,
                        }}
                    >
                        {t("orderModal:radioDesc")}
                    </span>
                </RadioInput>
            </Space>
        </RadioInput.Group>
    )
}

export default OrderRadio