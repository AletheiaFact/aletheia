import React from "react";
import { DeleteOutlined, AddOutlined } from "@mui/icons-material";
import { FormControl, FormHelperText, Grid } from "@mui/material";
import { URL_PATTERN } from "../../utils/ValidateFloatingLink";
import { useTranslation } from "next-i18next";
import Input from "../AletheiaInput";
import Button from "../Button";

const SourceInput = ({ onChange, addSource, removeSource, placeholder, label, sources, errors, clearError }) => {
    const { t } = useTranslation();
    return (
        <>
            {sources && sources.map((source, index) => (
                <FormControl
                    fullWidth
                    key={index}
                >
                    <Grid container>
                        {index === 0 ?
                            <div className="root-label">
                                <span className="require-label">*</span>
                                <p className="form-label">{label}</p>
                            </div>
                            :
                            null
                        }
                        <Grid item xs={index > 0 ? 10 : 12}>
                            <Input
                                key={index}
                                value={source || ""}
                                onChange={(e) => {
                                    onChange(e, index)
                                    if (URL_PATTERN.test(e.target.value)) {
                                        clearError("sources");
                                    }
                                }}
                                placeholder={placeholder}
                                data-cy={'testSource1'}
                            />
                            {errors?.sources?.[index] && (
                                <FormHelperText className="require-label">
                                    {errors.sources[index]}
                                </FormHelperText>
                            )}
                            <p className="extra-label">
                                {index === (sources.length - 1) ? t("sourceForm:extra") : null}
                            </p>
                        </Grid>
                        <Grid item xs={2}>
                            {index > 0 &&
                                <Button
                                    style={{ width: "100%", height: "40px" }}
                                    onClick={() => removeSource(index)}
                                >
                                    <DeleteOutlined fontSize="small" />
                                </Button>
                            }
                        </Grid>
                    </Grid>
                </FormControl >
            ))
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