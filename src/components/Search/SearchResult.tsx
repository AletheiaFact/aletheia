import { RightOutlined } from "@ant-design/icons";
import { Row, Col, Typography } from "antd";
import { useAppSelector } from "../../store/store";
import HighlightedText from "../HighlightedSearchText";

const { Paragraph } = Typography;

const SearchResult = ({
    handleOnClick,
    name,
    searchName,
    description,
    avatar = undefined,
}) => {
    const { vw } = useAppSelector((state) => ({
        vw: state.vw,
    }));

    const getTextSpan = () => {
        if (!avatar) {
            return 22;
        }
        return vw?.xs ? 18 : 20;
    };

    return (
        <Row
            style={{
                padding: "10px 5%",
                cursor: "pointer",
                width: "100%",
            }}
            onClick={handleOnClick}
            align="middle"
        >
            {avatar && <Col span={vw?.xs ? 4 : 2}>{avatar}</Col>}
            <Col span={getTextSpan()}>
                <Paragraph
                    ellipsis={{
                        rows: 1,
                        expandable: false,
                    }}
                    style={{
                        marginBottom: 0,
                        fontSize: "14px",
                    }}
                >
                    <HighlightedText text={name} highlight={searchName} />
                </Paragraph>
                <Col style={{ fontSize: 10 }}>{description}</Col>
            </Col>
            <Col span={2}>
                <RightOutlined />
            </Col>
        </Row>
    );
};

export default SearchResult;
