import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { Tooltip } from "antd";
import colors from "../../styles/colors";

const AffixButton = (props) => {
    // @TODO use antd affix
    return (
        <>
            <Tooltip
                placement="left"
                title={props.tooltipTitle}
            >
                <Button
                    style={{
                        position: "fixed",
                        background: colors.bluePrimary,
                        color: colors.white,
                        borderColor: colors.bluePrimary,
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        width: "70px",
                        height: "70px",
                        zIndex: 9999,
                        bottom: "3%",
                        right: "3%"
                    }}
                    size="large"
                    shape="circle"
                    href={props.href}
                    onClick={props.onClick}
                    type="primary"
                    icon={<PlusOutlined style={{
                        padding: "21px",
                        fontSize: "27px"
                    }} />}
                ></Button>
            </Tooltip>
        </>
    );
}

export default AffixButton;
