import React from "react";
import { Input } from "antd";
import styled from "styled-components";

const InputSearchStyled = styled(Input.Search)`
    span.ant-input-group-addon {
        display: none;
    }
    input.ant-input {
        background: #F5F5F5;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
        border-radius: 30px!important;
        color: #515151;
        &:focus {
            border-color: #d9d9d9 ;
        }
        &::placeholder {
            color: #515151;
        }
    }
`

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
        }, 300);
    }

    return (
        <InputSearchStyled
            placeholder={props.placeholder || ""}
            size="large"
            loading={loading}
            addonAfter={false}
            addonBefore={false}
            onChange={e => doSearch(e)}
        />
    );
}

export default InputSearch;
