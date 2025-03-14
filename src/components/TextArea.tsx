import styled from "styled-components";
import { Input } from "antd";
import colors from "../styles/colors";

const TextArea = styled(Input.TextArea)`
    background: ${(props) => (props.white ? colors.white : colors.lightNeutral)};
    box-shadow: 0px 2px 2px ${colors.shadow};
    border-radius: 4px;
    border: none;
    height: 40px;
    padding: 10px;

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
