import React from 'react'
import  Typography  from "@mui/material/Typography";

const Subtitle = (props) => {
    return(
        <Typography
            variant="h2"
            style={{
                fontWeight: 700,
                fontSize: 24,
                lineHeight: 1.35,
                ...props.style
            }}
        >
            {props.children}
        </Typography>
    )
}

export default Subtitle
