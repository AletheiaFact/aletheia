import { Typography } from "@mui/material";
import { MetricsBox } from "./EventCard.style";
interface MetricBoxProps {
    value: number;
    label: string;
    color: string;
    dataCy: string;
}

const MetricBox = ({ value, label, color, dataCy }: MetricBoxProps) => (
    <MetricsBox $metricsColor={color}>
        <Typography variant="h5" className="valueText" data-cy={dataCy}>
            {value}
        </Typography>
        <Typography variant="caption" className="labelText">
            {label}
        </Typography>
    </MetricsBox>
);

export default MetricBox;
