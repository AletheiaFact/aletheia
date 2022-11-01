import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { useTranslation } from "next-i18next";
import React from "react";
import { Controller } from "react-hook-form";

import colors from "../../styles/colors";
import DynamicInput from "./DynamicInput";

const DynamicForm = ({ currentForm, machineValues, control, errors }) => {
    const { t } = useTranslation();
    return (
        <div>
            {currentForm.map((fieldItem, index) => {
                const {
                    fieldName,
                    rules,
                    label,
                    placeholder,
                    type,
                    addInputLabel,
                    extraProps,
                } = fieldItem;

                const defaultValue = machineValues[fieldName];

                return (
                    <Row key={index}>
                        <Col span={24}>
                            <h4
                                style={{
                                    color: colors.blackSecondary,
                                    fontWeight: 600,
                                    paddingLeft: 10,
                                    marginBottom: 0,
                                }}
                            >
                                {t(label)}
                            </h4>
                        </Col>
                        <Col span={24} style={{ margin: "10px 0" }}>
                            <Controller
                                name={fieldName}
                                control={control}
                                rules={rules}
                                defaultValue={defaultValue}
                                render={({ field }) => (
                                    <DynamicInput
                                        fieldName={fieldName}
                                        type={type}
                                        placeholder={placeholder}
                                        onChange={field.onChange}
                                        value={field.value}
                                        addInputLabel={addInputLabel}
                                        defaultValue={defaultValue}
                                        data-cy={`testClaimReview${fieldName}`}
                                        extraProps={extraProps}
                                    />
                                )}
                            />
                            {errors[fieldName] && (
                                <Text type="danger" style={{ marginLeft: 20 }}>
                                    {t(errors[fieldName].message)}
                                </Text>
                            )}
                        </Col>
                    </Row>
                );
            })}
        </div>
    );
};

export default DynamicForm;
