import { Input } from "antd";
import styled from "styled-components";
import colors from "../styles/colors";

const InputPassword = styled(Input.Password)`
    background: ${(props) => (props.white ? colors.white : colors.lightNeutral)};
    box-shadow: 0px 2px 2px ${colors.Shadow};
    border-radius: 4px;
    border: none;
    height: 40px;

    input {
        background: ${colors.lightNeutral};
    }

    ::placeholder {
        color: ${colors.blackSecondary};
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px ${colors.Shadow};
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }
`;

export default InputPassword;
