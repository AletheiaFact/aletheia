import { RightOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";
import colors from "../styles/colors";
import HighlightedText from "./HighlightedSearchText";
const SearchResult = ({ handleOnClick, avatar, name, searchName }) => {
    return (
        <Row
            style={{
                background: colors.white,
                padding: "10px 10%",
                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                width: "100%",
            }}
            onClick={handleOnClick}
            align="middle"
        >
            <Col span={4}>{avatar}</Col>
            <Col span={18}>
                <span
                    style={{
                        marginBottom: 0,
                        fontSize: "14px",
                    }}
                >
                    <HighlightedText text={name} highlight={searchName} />
                </span>
            </Col>
            <Col span={2}>
                <RightOutlined />
            </Col>
        </Row>
    );
};

export default SearchResult;
