import { Grid } from "@mui/material"
import colors from "../styles/colors";
import { borderRadius, shadows, spacingRem } from "../styles";

const CardBase = ({ children, style = {} }) => {
    return (
        <Grid container style={{
            background: colors.white,
            border: `1px solid ${colors.lightNeutralSecondary}`,
            boxSizing: "border-box",
            boxShadow: shadows.md,
            borderRadius: borderRadius.lg,
            marginBottom: spacingRem[3], // 8px - using standardized spacing
            ...style
        }}>
            {children}
        </Grid>
    )
}

export default CardBase;
