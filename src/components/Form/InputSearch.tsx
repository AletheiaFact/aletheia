import React from "react";
import { Input } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";

const InputSearchStyled = styled(Input.Search)`
    span.ant-input-group-addon {
        display: none;
    }
    span.ant-input-affix-wrapper {
        background: ${colors.lightGray};
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        &:focus-within {
            border-color: #d9d9d9;
        }
    }
    input.ant-input {
        background: ${colors.lightGray};
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
        const searchText = e.target.value;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            loading = true;
            props.callback(searchText);
            loading = false;
        }, 1000);
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
            data-cy={props["data-cy"] || "testInputSearchPersonality"}
        />
    );
};

export default InputSearch;
