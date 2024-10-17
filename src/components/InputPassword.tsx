import { Input } from "antd";
import styled from "styled-components";
import colors from "../styles/colors";

const InputPassword = styled(Input.Password)`
    background: ${(props) => (props.white ? colors.white : colors.lightGray)};
    box-shadow: 0px 2px 2px ${colors.colorShadow};
    border-radius: 4px;
    border: none;
    height: 40px;

    input {
        background: ${colors.lightGray};
    }

    ::placeholder {
        color: ${colors.blackSecondary};
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px ${colors.colorShadow};
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }
`;

export default InputPassword;
