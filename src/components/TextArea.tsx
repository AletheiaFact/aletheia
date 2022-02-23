import styled from "styled-components"
import { Input } from "antd";
import colors from "../styles/colors";

const TextArea = styled(Input.TextArea)`
    background: ${colors.lightGray};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    border: none;
    height: 40px;
    padding: 10px;

    ::placeholder {
        color: ${colors.black};
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
`;

export default TextArea;
