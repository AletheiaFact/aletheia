import { Col, Row } from "antd";

import { Controller } from "react-hook-form";
import DynamicInput from "./DynamicInput";
import React from "react";
import Text from "antd/lib/typography/Text";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const DynamicForm = ({ currentForm, control, errors, machineValues = {} }) => {
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
                    <Row key={fieldName + index}>
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
