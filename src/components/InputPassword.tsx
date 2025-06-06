import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useState, forwardRef } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styled from "styled-components";
import colors from "../styles/colors";

const StyledTextField = styled(TextField)`
    background: ${(props) => (props.white ? colors.white : colors.lightNeutral)};
    box-shadow: 0px 2px 2px ${colors.shadow};
    border-radius: 4px;
    width: 100%;
    
    & .MuiOutlinedInput-root {
        border-radius: 4px;
        background: ${(props) => (props.white ? colors.white : colors.lightNeutral)};
        
        & fieldset {
            border: none !important;
        }

        &:hover fieldset,
        &:focus-within fieldset {
            border: none !important;
        }
    }

    & .MuiOutlinedInput-input {
        padding: 10px !important;
    }

    & .MuiInputBase-root {
        box-shadow: none !important;
    }

    & .MuiOutlinedInput-notchedOutline {
        display: none !important;
    }
`;

const InputPassword = forwardRef(({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <StyledTextField
            {...props}
            inputRef={ref}
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
});

export default InputPassword;
