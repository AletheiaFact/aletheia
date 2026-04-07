import styled from "styled-components";
import colors from "../../../styles/colors";
import { Box, Grid } from "@mui/material";
import { queries } from "../../../styles/mediaQueries";

type MetricsBoxProps = {
    $metricsColor: string;
};

const EventCardStyled = styled(Grid)`
  justify-content: center;
  padding: 24px;
  gap: 24px;

  .EventCardHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .EventCardBadge {
    background-color: ${colors.lightTertiary};
    color: ${colors.lightPrimary};
    font-size: 16px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 4px;
  }

  .EventCardTitle {
      color: ${colors.primary};
      font-size: 24px;
      font-weight: 600;
    }

    .EventCardBody1 {
      color: ${colors.secondary};
      font-size: 16px;
    }
`;

const MetricsBox = styled(Box) <MetricsBoxProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background-color: color-mix(in srgb, ${colors.lightNeutralSecondary}, transparent 60%);
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: color-mix(in srgb, ${colors.lightNeutralSecondary}, transparent 40%);
    transform: translateY(-1px);
  }

  .valueText {
    font-weight: 700;
    color: ${(props) => props.$metricsColor};
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .labelText {
    font-weight: 600;
    color: ${colors.neutralSecondary};
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }

  @media ${queries.md} {
    padding: 12px 6px;

    .valueText {
        font-size: 1.2rem;
    }

    .labelText {
        font-size: 0.6rem;
    }
  }
`;

export { EventCardStyled, MetricsBox };
