import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "./Button";
import { Col, Row } from "antd";
import AletheiaInput from "./AletheiaInput";

type FormValues = {
    fieldArray: { content: string }[];
};


export default function InputTextList({ placeholder, onChange, inputType, addInputLabel, defaultValue = []}) {
    let contents = []
    if(defaultValue) {
        contents = defaultValue.map((item) => {
            return { content: item }
        })
    }

    const { register, control, watch } = useForm<FormValues>({
        defaultValues: { fieldArray: contents.length ? contents : [{ content: ""}] }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fieldArray"
    });
    const watchFieldArray = watch("fieldArray");
    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index]
        };
    });

    React.useEffect(() => {
        const subscription = watch((value) => {
            const contentArray = value.fieldArray.flatMap(field => field.content)
            onChange(contentArray)
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <div>
            {controlledFields.map((_field, index) => {
                return (
                    <Row key={`fieldArray.${index}.content`} style={{ marginBottom: 20, justifyContent: 'space-between' }}>
                        <Col span={index > 0 ? 20 : 24}>
                            <AletheiaInput
                                {...register(`fieldArray.${index}.content` as const)}
                                placeholder={placeholder}
                                type={inputType}
                                required={true}
                            />
                        </Col>
                        {index > 0 && <Col span={3}>
                            <Button
                                style={{ height: "40px", margin: '0 auto' }}
                                onClick={() => remove(index)}
                            >
                                <DeleteOutlined />
                            </Button>
                        </Col>}
                    </Row>
                )
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
                        textDecoration: "underline"
                    }}
                    onClick={() =>
                        append({
                            content: ""
                        })
                    }
                >
                    <PlusOutlined /> {addInputLabel}
                </a>
            </div>
        </div>
    );
}
