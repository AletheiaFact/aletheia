import { Grid, Typography } from "@mui/material";
import colors from "../../../styles/colors";

interface EventTitleProps {
    total: number;
    t: (key: string, options?: { total: number }) => string;
}

const EventTitle = ({ total, t }: EventTitleProps) => (
    <Grid container justifyContent="space-between" alignItems="center">
        {t("events:eventsList")}
        <Typography
            variant="body2"
            color={colors.blackSecondary}
            alignContent="flex-end"
        >
            {t("events:totalItems", {
                total: total,
            })}
        </Typography>
    </Grid>
)

export default EventTitle
