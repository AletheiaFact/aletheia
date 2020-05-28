import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";

function AffixButton(props) {
    // const [bottom, setBottom] = useState(10);
    // @TODO use antd affix
    return (
        // <Affix offsetBottom={10}>
        <Button
            style={{
                position: "fixed",
                zInex: 9999,
                bottom: "3%",
                left: "85%"
            }}
            size="large"
            shape="circle"
            onClick={props.createClaim}
            type="primary"
            icon={<PlusOutlined />}
        ></Button>
        // </Affix>
    );
}

export default AffixButton;
