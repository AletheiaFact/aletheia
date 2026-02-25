import { Box } from "@mui/material";
import styled from "styled-components";
import colors from "../../../styles/colors";

const PieChartSVG = styled.svg`
  transform: rotate(-90deg);
`;

const LegendColor = styled(Box)(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: 2,
  backgroundColor: color,
}));

const Bar = styled(Box)<{ height: number; color: string }>`
  width: 80px;
  height: ${(props) => props.height}%;
  background-color: ${(props) => props.color};
  border-radius: 8px 8px 0 0;
  transition: height 0.3s ease;
  position: relative;

  &:hover {
    opacity: 0.8;
  }
`;

const Dashboard = styled(Box)`
  width: 90%;
  margin-top: 16px;
  padding: 24px;
  background-color: ${colors.lightNeutral};

  .title {
    font-size: 18px;
    color: ${colors.primary};
  }

  .subtitle {
    font-size: 14px;
    color: ${colors.neutralSecondary};
    margin-top: 4px;
  }

  .label {
    font-size: 12px;
    color: ${colors.neutralSecondary};
    text-align: center;
    margin-top: 12px;
  }

  .card {
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .stats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .stats-icon-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.neutralSecondary};
  }

  .value {
    font-size: 18px;
    color: ${colors.primary};
    margin-bottom: 8px;
  }

  .stats-label {
    font-size: 14px;
    color: ${colors.neutralSecondary};
  }

  .PieChart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    position: relative;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 24px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .legend-label {
    font-size: 14px;
    color: ${colors.neutral};
    flex: 1;
  }

  .text {
    font-size: 14px;
    color: ${colors.neutral};
    flex: 1;
  }

  .legend-percentage {
    font-size: 14px;
    color: ${colors.neutralSecondary};
    white-space: nowrap;
  }

  .BarChart-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 40px 20px;
    height: 300px;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 120px;
  }

  .item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.lightNeutralSecondary};

    &:last-child {
      border-bottom: none;
    }
  }

  .badge {
    padding: 2px 6px;
    border-radius: 4px;
    color: ${colors.white};
    text-transform: uppercase;
    background-color: ${(props) => props.color};
  }
`;

export { Dashboard, LegendColor, PieChartSVG, Bar };
