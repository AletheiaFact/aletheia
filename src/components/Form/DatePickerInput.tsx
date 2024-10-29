import { DatePicker } from "antd";
import colors from "../../styles/colors";
import styled from "styled-components";

const DatePickerInput = styled(DatePicker)`
    background: ${(props) => (props.white ? colors.white : colors.lightNeutral)};
    box-shadow: 0px 2px 2px ${colors.Shadow};
    border-radius: 4px;
    border: none;
    height: 40px;
    width: 100%;

    input::placeholder {
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

export default DatePickerInput;
