import { Grid } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";

const DashboardViewStyle = styled(Grid)`
    gap: 64px;
    justify-content: center;

    .dashboard-item {
        padding: 20px;
        border: 1px solid ${colors.lightNeutral};
        box-shadow: 1px 4px 10px 3px rgba(0, 0, 0, 0.1);
        border-radius: 32px;
        max-height: 550px;
        overflow-y: auto;
    }
`;

export default DashboardViewStyle;
