import React from "react";
import { DeleteOutlined, AddOutlined, LinkOutlined } from "@mui/icons-material";
import { Box, FormControl, FormHelperText, Grid } from "@mui/material";
import { validateUrl } from "../../utils/ValidateUrl";
import { useTranslation } from "next-i18next";
import Input from "../AletheiaInput";
import AletheiaButton from "../AletheiaButton";
import colors from "../../styles/colors";

const SourceInput = ({
    onChange,
    addSource,
    removeSource,
    placeholder,
    label,
    sources,
    errors,
    clearError,
    helpText = undefined,
    addSourceLabel = undefined,
}) => {
    const { t } = useTranslation();
    return (
        <>
            {sources && sources.map((source, index) => (
                <FormControl
                    fullWidth
                    key={index}
                    style={{ marginTop: index > 0 ? "8px" : 0 }}
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
                            <Box sx={{ position: "relative" }}>
                                <LinkOutlined
                                    aria-hidden="true"
                                    sx={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: 18,
                                        color: colors.neutralSecondary,
                                        pointerEvents: "none",
                                    }}
                                />
                                <Input
                                    key={index}
                                    value={source || ""}
                                    onChange={(event) => {
                                        onChange(event, index)
                                        const errorMessage = validateUrl(event.target.value, t);

                                        if (!errorMessage) {
                                            clearError("sources");
                                        }
                                    }}
                                    placeholder={placeholder}
                                    data-cy={'testSource1'}
                                    style={{ paddingLeft: "38px" }}
                                />
                            </Box>
                            {errors?.sources?.[index] && (
                                <FormHelperText className="require-label">
                                    {errors.sources[index]}
                                </FormHelperText>
                            )}
                            <p className="extra-label">
                                {index === (sources.length - 1) ? (helpText ?? t("sourceForm:extra")) : null}
                            </p>
                        </Grid>
                        <Grid item xs={2} style={{ paddingLeft: "8px" }}>
                            {index > 0 &&
                                <AletheiaButton
                                    style={{
                                        width: "100%",
                                        height: "40px"
                                    }}
                                    onClick={() => removeSource(index)}
                                >
                                    <DeleteOutlined fontSize="small" />
                                </AletheiaButton>
                            }
                        </Grid>
                    </Grid>
                </FormControl >
            ))
            }
            <div
                style={{
                    width: "100%",
                    textAlign: "left",
                    paddingBottom: "15px",
                }}
            >
                <a
                    onClick={addSource}
                    style={{
                        display: "flex",
                        justifyContent: "start",
                        alignContent: "center",
                        textDecoration: "underline"
                    }}
                >
                    <AddOutlined fontSize="small" />{" "}
                    {addSourceLabel ?? t("sourceForm:addNewSourceButton")}
                </a>
            </div>
        </>
    );
};

export default SourceInput;
