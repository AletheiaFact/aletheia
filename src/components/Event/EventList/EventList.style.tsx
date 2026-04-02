import styled from "styled-components";
import colors from "../../../styles/colors";
import { Grid } from "@mui/material";

const EventListGrid = styled(Grid)`
  justify-content: center;
  margin-bottom: 24px;

  .heroSectionBox {
    text-align: center;
    margin: 2.5rem 0;
  }

  .heroTitle {
    color: ${colors.primary};
    font-weight: 700;
    font-size: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);
    margin-bottom: 12px;
  }

  .heroSubtitle {
    color: ${colors.secondary};
    font-size: clamp(0.95rem, 0.85rem + 0.5vw, 1.05rem);
    max-width: 720px;
    margin: 0 auto;
  }

  .EventFiltersBox {
    display: flex;
    background-color: ${colors.lightNeutral};
    border-radius: 24px;
    padding: 2px;
    box-shadow: 0px 4px 10px ${colors.shadow};
  }
`;

export default EventListGrid;
