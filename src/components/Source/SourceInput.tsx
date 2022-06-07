import { Col, Form, Row } from "antd";
import React from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import Input from "../AletheiaInput";
import Button from "../Button";

const SourceInput = ({ onChange, addSource, removeSource, placeholder, name, label, sources }) => {
    const { t } = useTranslation();
    return (
        <>
            {sources && sources.map((source, index) => {
                const onSourceChange = (e) => {
                    onChange(e, index);
                }
                return (
                    <Form.Item
                        key={index}
                        name={`source-${index}`}
                        label={index === 0 ? label : null}
                        extra={index === (sources.length - 1) ? t("sourceForm:extra") : null}
                        rules={[
                            {
                                message: t("sourceForm:errorMessageValidURL"),
                                type: "url"
                            },
                            {
                                required: true,
                                message: t("common:requiredFieldError"),
                            },
                        ]}
                    >
                        <Row>
                            <Col span={index > 0 ? 20 : 24}>
                                <Input
                                    key={index}
                                    value={source || ""}
                                    onChange={onSourceChange}
                                    placeholder={placeholder}
                                />
                            </Col>
                            <Col span={4}>
                                {index > 0 && <Button style={{ width: "100%", height: "40px" }} onClick={() => removeSource(index)}><DeleteOutlined /></Button>}
                            </Col>
                        </Row>
                    </Form.Item>
                )
            })
            }
            <div
                style={{
                    width: "100%",
                    textAlign: "right",
                    paddingBottom: "15px"
                }}
            >
                <a
                    onClick={addSource}
                    style={{
                        textDecoration: "underline"
                    }}
                >
                    <PlusOutlined /> {t("sourceForm:addNewSourceButton")}
                </a>
            </div>
        </>
    );
}

export default SourceInput;
