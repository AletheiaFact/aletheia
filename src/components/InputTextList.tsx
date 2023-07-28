import * as React from "react";

import { Col, Row } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useFieldArray, useForm } from "react-hook-form";

import AletheiaInput from "./AletheiaInput";
import Button from "./Button";
import { trackUmamiEvent } from "../lib/umami";

type FormValues = {
    fieldArray: { content: string }[];
};

export default function InputTextList({
    fieldName,
    placeholder,
    onChange,
    addInputLabel,
    defaultValue,
    dataCy,
    white = undefined,
}) {
    //TODO: Remove the ternary when migration is done
    const contents = defaultValue.map((item) => {
        return typeof item === "string"
            ? { content: item }
            : { content: item.link };
    });

    const { register, control, watch } = useForm<FormValues>({
        defaultValues: {
            fieldArray: contents.length ? contents : [{ content: "" }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fieldArray",
    });
    const watchFieldArray = watch("fieldArray");
    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index],
        };
    });

    React.useEffect(() => {
        const subscription = watch((value) => {
            const contentArray = value.fieldArray.flatMap(
                (field) => field.content
            );
            onChange(contentArray);
        });
        return () => subscription.unsubscribe();
    }, [onChange, watch]);

    return (
        <div>
            {controlledFields.map((_field, index) => {
                return (
                    <Row
                        key={`fieldArray.${index}.content`}
                        style={{
                            marginBottom: 20,
                            justifyContent: "space-between",
                        }}
                    >
                        <Col span={index > 0 ? 20 : 24}>
                            <AletheiaInput
                                {...register(
                                    `fieldArray.${index}.content` as const
                                )}
                                placeholder={placeholder}
                                type="text"
                                data-cy={`${dataCy}${index}`}
                                white={white}
                            />
                        </Col>
                        {index > 0 && (
                            <Col span={3}>
                                <Button
                                    style={{ height: "40px", margin: "0 auto" }}
                                    onClick={() => {
                                        remove(index);
                                        trackUmamiEvent(
                                            `Remove ${fieldName} input`,
                                            "Fact-checking workflow"
                                        );
                                    }}
                                    data-cy={`${dataCy}Remove${index}`}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Col>
                        )}
                    </Row>
                );
            })}

            <div
                style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 10,
                }}
            >
                <a
                    style={{
                        textDecoration: "underline",
                    }}
                    onClick={() => {
                        append({
                            content: "",
                        });
                        trackUmamiEvent(
                            `Add ${fieldName} input`,
                            "Fact-checking workflow"
                        );
                    }}
                    data-cy={`${dataCy}Add`}
                >
                    <PlusOutlined /> {addInputLabel}
                </a>
            </div>
        </div>
    );
}
