import styled from "styled-components";
import colors from "../styles/colors";
import { TextareaAutosize } from "@mui/material";

const AletheiaTextAreaAutoSize = styled(TextareaAutosize)`
    background: ${(props) => (props.white ? colors.white : colors.lightGray)};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    height: 40px;
    width: 100%;
    padding: 10px;

    ::placeholder {
        color: #515151;
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }

    :focus-visible {
        outline: none;
    }
`;

export default AletheiaTextAreaAutoSize;
