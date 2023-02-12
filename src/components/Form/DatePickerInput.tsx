import { DatePicker } from "antd";
import colors from "../../styles/colors";
import styled from "styled-components";

const DatePickerInput = styled(DatePicker)`
    background: ${(props) => (props.white ? colors.white : colors.lightGray)};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    height: 40px;
    width: 100%;

    input::placeholder {
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

export default DatePickerInput;
