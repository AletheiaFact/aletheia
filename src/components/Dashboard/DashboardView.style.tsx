import { Row } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";

const DashboardViewStyle = styled(Row)`
    row-gap: 64px;

    .dashboard-item {
        padding: 20px;
        border: 1px solid ${colors.lightGray};
        box-shadow: 1px 4px 10px 3px rgba(0, 0, 0, 0.1);
        border-radius: 32px;
        max-height: 550px;
        overflow-y: auto;
    }
`;

export default DashboardViewStyle;
