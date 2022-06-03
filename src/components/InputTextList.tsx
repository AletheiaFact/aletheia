import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { Col, Row } from "antd";

type FormValues = {
    firstContent: string;
    fieldArray: { content: string }[];
};


export default function InputTextList(props) {

    const { register, control, watch } = useForm<FormValues>();
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
            const contentArray = [value.firstContent]
            value.fieldArray.forEach(field => {
                contentArray.push(field.content)
            })
            props.onChange(contentArray)
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <div>
            <Input {...register("firstContent")} placeholder={props.placeholder} type={props.type} />

            {controlledFields.map((_field, index) => {
                return (
                    <Row key={`fieldArray.${index}.content`} style={{ marginTop: 20 }}>
                        <Col span={20}>
                            <input
                                {...register(`fieldArray.${index}.content` as const)}
                                placeholder={props.placeholder}
                                type={props.type}
                                required={true}
                            />
                        </Col>
                        <Col span={4}>
                            <Button
                                style={{ width: "100%", height: "40px" }}
                                onClick={() => remove(index)}
                            >
                                <DeleteOutlined />
                            </Button>
                        </Col>
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
                    <PlusOutlined /> Add another input
                </a>
            </div>
        </div>
    );
}
