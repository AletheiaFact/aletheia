import { Radio } from "antd";
import styled from "styled-components"
import colors from "../styles/colors";

const RadioGroup = styled(Radio.Group)`
    .ant-radio-button-wrapper {
        &.ant-radio-button-wrapper-checked {
            background: ${colors.bluePrimary};
            border-color: ${colors.bluePrimary};
            color: ${colors.white};

            &:not([class*=" ant-radio-button-wrapper-disabled"]) {
                &.ant-radio-button-wrapper:first-child {
                    border-right-color: ${colors.bluePrimary};
                }
            }

            &:not(.ant-radio-button-wrapper-disabled)::before {
                background: ${colors.bluePrimary};
            }
        }
    }
`;

const RadioButton = styled(Radio.Button)`
    background: ${colors.grayTertiary};
    color: ${colors.bluePrimary};
`;

interface ToggleSectionProps {
    defaultValue: boolean
    onChange: (event: any) => void
    labelTrue: string
    labelFalse: string
}

const ToggleSection = (props: ToggleSectionProps) => {
    return (
        <RadioGroup
            defaultValue={props.defaultValue}
            buttonStyle="solid"
            onChange={props.onChange}
            style={{ width: "100%" }}
        >
            <RadioButton
                className="radio-button"
                value={true}
                style={{
                    borderRadius: "30px 0px 0px 30px"
                }}
            >
                {props.labelTrue}
            </RadioButton>
            <RadioButton
                value={false}
                style={{
                    borderRadius: "0px 30px 30px 0px"
                }}
            >
                {props.labelFalse}
            </RadioButton>
        </RadioGroup>
    );
}

export default ToggleSection;
