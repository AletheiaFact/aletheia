import styled from "styled-components";
import { TextField } from "@mui/material";
import colors from "../styles/colors";

const TextArea = styled(TextField)`
    background: ${(props) => (props.white ? colors.white : colors.lightNeutral)};
    box-shadow: 0px 2px 2px ${colors.shadow}; 
    border-radius: 4px;
    border: none;
    height: 100px;
    padding: 10px;
    overflow-y: auto;
    width: 100%;
    resize: vertical;  
    overflow: auto; 

    & .MuiOutlinedInput-notchedOutline {
        border: none;
        top: -20px;
    }

    ::placeholder {
        color: ${colors.blackSecondary};
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px ${colors.shadow};
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }
`;

export default TextArea;
