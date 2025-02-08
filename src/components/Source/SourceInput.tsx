import { Form } from "antd";
import React from "react";
import { DeleteOutlined, AddOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
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
                        <Grid container>
                            <Grid item xs={index > 0 ? 10 : 12}>
                                <Input
                                    key={index}
                                    value={source || ""}
                                    onChange={onSourceChange}
                                    placeholder={placeholder}
                                    data-cy={'testSource1'}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                {index > 0 && <Button style={{ width: "100%", height: "40px" }} onClick={() => removeSource(index)}><DeleteOutlined fontSize="small" /></Button>}
                            </Grid>
                        </Grid>
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
                        display:"flex",
                        justifyContent:"end",
                        alignContent:"center",
                        textDecoration: "underline"
                    }}
                >
                    <AddOutlined fontSize="small" /> {t("sourceForm:addNewSourceButton")}
                </a>
            </div>
        </>
    );
}

export default SourceInput;
