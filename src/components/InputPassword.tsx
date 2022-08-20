import { Input } from "antd";
import styled from "styled-components";
import colors from "../styles/colors";

const InputPassword = styled(Input.Password)`
    background: ${(props) => (props.white ? colors.white : colors.lightGray)};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    height: 40px;

    input {
        background: #f5f5f5;
    }

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
`;

export default InputPassword;
