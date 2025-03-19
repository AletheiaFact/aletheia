import colors from "../styles/colors"
import Typography  from "@mui/material/Typography"

const AletheiaTitle = (props) => {
    return (
        <Typography
            variant={props.variant}
            style={{
                fontSize: 14,
                color: colors.white,
                fontWeight: 400,
                margin: 0,
                ...props.style
            }}
        >
            {props.children}
        </Typography>
    )
}

export default AletheiaTitle;