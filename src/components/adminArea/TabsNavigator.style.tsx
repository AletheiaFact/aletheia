import { Tabs } from "@mui/material";
import styled from "styled-components";

const TabsNavigatorStyle = styled(Tabs)`
    display: flex;
    gap: 2rem;
    padding: 0 10px;

    .tab-label {
        display: flex;
        align-items: center;
        gap: 4px;
    }
`;

export default TabsNavigatorStyle;
