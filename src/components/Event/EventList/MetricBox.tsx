import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";

type StyledBoxProps = {
  $metricsColor: string;
};

const StyledBox = styled(Box)<StyledBoxProps>`
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

interface MetricBoxProps {
  value: number;
  label: string;
  color: string;
  dataCy: string;
}

const MetricBox = ({ value, label, color, dataCy }: MetricBoxProps) => (
  <StyledBox $metricsColor={color}>
    <Typography variant="h5" className="valueText" data-cy={dataCy}>
      {value}
    </Typography>
    <Typography variant="caption" className="labelText">
      {label}
    </Typography>
  </StyledBox>
);

export default MetricBox;
