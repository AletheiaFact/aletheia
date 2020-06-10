import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { Tooltip } from "antd";

function AffixButton(props) {
    // @TODO use antd affix
    return (
        <>
            <Tooltip
                placement="left"
                defaultVisible={true}
                title="Clique aqui para adicionar uma claim"
            >
                <Button
                    style={{
                        position: "fixed",
                        zIndex: 9999,
                        bottom: "3%",
                        left: "85%"
                    }}
                    size="large"
                    shape="circle"
                    onClick={props.onClick}
                    type="primary"
                    icon={<PlusOutlined />}
                ></Button>
            </Tooltip>
        </>
    );
}

export default AffixButton;
