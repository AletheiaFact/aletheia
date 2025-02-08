import * as React from "react";

import { Grid } from "@mui/material"
import { DeleteOutlined, AddOutlined } from "@mui/icons-material";
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
                    <Grid container
                        key={`fieldArray.${index}.content`}
                        style={{
                            marginBottom: 20,
                            justifyContent: "space-between",
                        }}
                    >
                        <Grid item xs={index > 0 ? 10 : 12}>
                            <AletheiaInput
                                {...register(
                                    `fieldArray.${index}.content` as const
                                )}
                                placeholder={placeholder}
                                type="text"
                                data-cy={`${dataCy}${index}`}
                                white={white}
                            />
                        </Grid>
                        {index > 0 && (
                            <Grid item xs={1.5}>
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
                                    <DeleteOutlined fontSize="small" />
                                </Button>
                            </Grid>
                        )}
                    </Grid>
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
                    <AddOutlined fontSize="small" /> {addInputLabel}
                </a>
            </div>
        </div>
    );
}
