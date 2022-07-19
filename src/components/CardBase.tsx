import { Row } from "antd";

const CardBase = ({ children, style = {} }) => {
    return (
        <Row style={{
            background: "#FFFFFF",
            border: "1px solid #EEEEEE",
            boxSizing: "border-box",
            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            marginBottom: "10px",
            ...style
        }}>
            {children}
        </Row>
    )
}

export default CardBase;
