import colors from "../styles/colors"
import { Typography } from "antd";

const { Title } = Typography
const AletheiaTitle = (props) => {
    return (
        <Title
            level={props.level}
            style={{
                fontSize: 14,
                color: colors.white,
                fontWeight: 400,
                margin: 0,
                ...props.style
            }}
        >
            {props.children}
        </Title>
    )
}

export default AletheiaTitle;