import { PlusOutlined } from "@ant-design/icons";
import { Col, Select } from "antd";
import { useState } from "react";
import colors from "../../styles/colors";
import AletheiaButton from "../Button";
import { SelectInput } from "../Form/ClaimReviewSelect";

const { Option } = Select;
const ClaimSelectType = ({ setState, setType }) => {
    const handleClick = () => setState("personality");

    return (
        <>
            <Col style={{ marginTop: "24px" }}>
                <p
                    style={{
                        fontSize: "18px",
                        lineHeight: "24px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    Context
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    In what context did this speech happen? Ex. Was it on social
                    media or an official government speech?
                </p>
            </Col>
            <SelectInput
                placeholder={"Choose an option"}
                onChange={(e) => setType(e)}
            >
                <Option value="speech">Speech</Option>
                <Option value="image">image</Option>
            </SelectInput>
            <Col
                style={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "right",
                }}
            >
                <AletheiaButton onClick={handleClick}>
                    <span>Add Type</span>
                    <PlusOutlined />
                </AletheiaButton>
            </Col>
        </>
    );
};

export default ClaimSelectType;
