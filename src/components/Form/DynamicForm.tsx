import { Grid, Typography } from "@mui/material"
import { Controller } from "react-hook-form";
import DynamicInput from "./DynamicInput";
import React from "react";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const DynamicForm = ({
    currentForm,
    control,
    errors,
    machineValues = {},
    disabledDate = {},
}) => {
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
                    <Grid container key={fieldName + index}>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            style={{
                                margin: "10px 0",
                                wordBreak: "break-word",
                            }}
                        >
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
                                        disabledDate={disabledDate}
                                    />
                                )}
                            />
                            {errors[fieldName] && (
                                <Typography variant="body1" style={{ marginLeft: 20, color: colors.error, fontSize: 16 }}>
                                    {t(errors[fieldName].message)}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                );
            })}
        </div>
    );
};

export default DynamicForm;
