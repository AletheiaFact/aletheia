import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { queries } from "../../styles/mediaQueries";

const VerificationRequestGrid = styled(Grid)`
    display: flex;
    justify-content: center;
    width: 100%;

    .filterGrid {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 18px;
        width: 100%;
        gap: 16px;
    }

    .filterToggleContainer {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .filterBarContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    @media ${queries.lg} {
        .filterGrid {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
        }
    }

    @media ${queries.xs} {
        padding: 0 10px;

        .filterBarContainer {
            gap: 16px;
        }
    }
`;

export default VerificationRequestGrid;
