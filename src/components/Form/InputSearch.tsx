import React from "react";
import { Input } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";

const InputSearchStyled = styled(Input.Search)`
    span.ant-input-group-addon {
        display: none;
    }
    span.ant-input-affix-wrapper {
        background: ${({ backgroundColor = colors.lightNeutral }) =>
        backgroundColor};
        box-shadow: 0px 2px 2px ${colors.shadow};
        border-radius: 4px;
        &:focus-within {
            border-color: ${colors.neutralTertiary};
        }
    }
    input.ant-input {
        background: ${({ backgroundColor = colors.lightNeutral }) =>
        backgroundColor};
        color: ${colors.blackSecondary};
        &::placeholder {
            color: ${colors.blackSecondary};
        }
    }
`;

const InputSearch = (props) => {
    let timeout: NodeJS.Timeout;
    let loading = false;

    const doSearch = (e) => {
        if (props.callback) {
            const searchText = e.target.value;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                loading = true;
                props?.callback(searchText);
                loading = false;
            }, 1000);
        }
    };

    return (
        <InputSearchStyled
            placeholder={props.placeholder || ""}
            size="large"
            loading={loading}
            addonAfter={false}
            addonBefore={false}
            onChange={(e) => doSearch(e)}
            suffix={props.suffix || <></>}
            prefix={props.prefix || <></>}
            data-cy={props["data-cy"] || "testInputSearchPersonality"}
            {...props}
        />
    );
};

export default InputSearch;
