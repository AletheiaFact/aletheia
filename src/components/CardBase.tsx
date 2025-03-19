import { Grid } from "@mui/material"
import colors from "../styles/colors";

const CardBase = ({ children, style = {} }) => {
    return (
        <Grid container style={{
            background: colors.white,
            border: `1px solid ${colors.lightNeutralSecondary}`,
            boxSizing: "border-box",
            boxShadow: `0px 3px 3px ${colors.shadow}`,
            borderRadius: "10px",
            marginBottom: "10px",
            ...style
        }}>
            {children}
        </Grid>
    )
}

export default CardBase;
