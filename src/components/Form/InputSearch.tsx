import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";

const InputSearchStyled = styled(TextField)`
    .MuiInputAdornment-root {
        color: ${colors.primary};
    }
    .MuiOutlinedInput-root {
        background: ${({ backgroundColor = colors.lightNeutral }) =>
        backgroundColor};
        box-shadow: 0px 2px 2px ${colors.shadow};
        border-radius: 4px;
        &:focus-within {
            border-color: ${colors.neutralTertiary};
        }
    }
    .MuiOutlinedInput-input {
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
            variant="outlined"
            placeholder={props.placeholder || ""}
            size="large"
            loading={loading}
            onChange={(e) => doSearch(e)}
            InputProps={{
                startAdornment: props.prefix ? (
                    <InputAdornment position="start">{props.prefix}</InputAdornment>
                ) : null,
                endAdornment: props.suffix ? (
                    <InputAdornment position="end">{props.suffix}</InputAdornment>
                ) : null,
            }}
            data-cy={props["data-cy"] || "testInputSearchPersonality"}
            {...props}
        />
    );
};

export default InputSearch;
