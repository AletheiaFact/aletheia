import { Radio } from "antd";
import styled from "styled-components";
import colors from "../styles/colors";
import { NameSpaceEnum } from "../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const RadioGroup = styled(Radio.Group)`
    .ant-radio-button-wrapper {
        &.ant-radio-button-wrapper-checked {
            background: ${({ namespace }) =>
                namespace === NameSpaceEnum.Main
                    ? colors.bluePrimary
                    : colors.blueSecondary};
            border-color: ${({ namespace }) =>
                namespace === NameSpaceEnum.Main
                    ? colors.bluePrimary
                    : colors.blueSecondary};
            color: ${colors.white};

            &:not([class*=" ant-radio-button-wrapper-disabled"]) {
                &.ant-radio-button-wrapper:first-child {
                    border-right-color: ${({ namespace }) =>
                        namespace === NameSpaceEnum.Main
                            ? colors.bluePrimary
                            : colors.blueSecondary};
                }
            }

            &:not(.ant-radio-button-wrapper-disabled)::before {
                background: ${({ namespace }) =>
                    namespace === NameSpaceEnum.Main
                        ? colors.bluePrimary
                        : colors.blueSecondary};
            }
        }
    }
`;

const RadioButton = styled(Radio.Button)`
    background: ${colors.grayTertiary};
    color: ${({ nameSpace }) =>
        nameSpace === NameSpaceEnum.Main
            ? colors.bluePrimary
            : colors.blueSecondary};
`;

interface ToggleSectionProps {
    defaultValue: boolean;
    onChange: (event: any) => void;
    labelTrue: string;
    labelFalse: string;
}

const ToggleSection = (props: ToggleSectionProps) => {
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <RadioGroup
            defaultValue={props.defaultValue}
            buttonStyle="solid"
            namespace={nameSpace}
            onChange={props.onChange}
        >
            <RadioButton
                className="radio-button"
                value={true}
                style={{
                    borderRadius: "30px 0px 0px 30px",
                }}
            >
                {props.labelTrue}
            </RadioButton>
            <RadioButton
                value={false}
                style={{
                    borderRadius: "0px 30px 30px 0px",
                }}
            >
                {props.labelFalse}
            </RadioButton>
        </RadioGroup>
    );
};

export default ToggleSection;
