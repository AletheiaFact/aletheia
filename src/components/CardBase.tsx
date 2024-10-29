import { Row } from "antd";
import colors from "../styles/colors";

const CardBase = ({ children, style = {} }) => {
    return (
        <Row style={{
            background: colors.white,
            border: `1px solid ${colors.lightNeutralSecondary}`,
            boxSizing: "border-box",
            boxShadow: `0px 3px 3px ${colors.Shadow}`,
            borderRadius: "10px",
            marginBottom: "10px",
            ...style
        }}>
            {children}
        </Row>
    )
}

export default CardBase;
