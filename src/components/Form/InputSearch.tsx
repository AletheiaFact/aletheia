import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";

const InputSearchStyled = styled(TextField).withConfig({
    shouldForwardProp: (prop) => prop !== 'backgroundColor',
})`
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

    // Extract non-TextField props
    const { callback, prefix, suffix, backgroundColor, ...textFieldProps } = props;

    return (
        <InputSearchStyled
            variant="outlined"
            placeholder={props.placeholder || ""}
            size="large"
            onChange={(e) => doSearch(e)}
            InputProps={{
                startAdornment: prefix ? (
                    <InputAdornment position="start">{prefix}</InputAdornment>
                ) : null,
                endAdornment: suffix ? (
                    <InputAdornment position="end">{suffix}</InputAdornment>
                ) : null,
            }}
            data-cy={props["data-cy"] || "testInputSearchPersonality"}
            backgroundColor={backgroundColor}
            {...textFieldProps}
        />
    );
};

export default InputSearch;
