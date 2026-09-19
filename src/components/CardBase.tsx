import { Grid } from "@mui/material"
import colors from "../styles/colors";

const CardBase = ({ children, style = {} }) => {
    return (
        <Grid container sx={{
            background: colors.white,
            border: `1px solid ${colors.lightNeutralSecondary}`,
            boxSizing: "border-box",
            boxShadow: `0px 3px 3px ${colors.shadow}`,
            borderRadius: "10px",
            marginBottom: "10px",

            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            "&:hover": {
                border: `1px solid ${colors.neutralTertiary}`,
                boxShadow: `0px 4px 10px ${colors.shadow}`,
                transform: "translateY(-1px)",
            },
            ...style
        }}>
            {children}
        </Grid >
    )
}

export default CardBase;
