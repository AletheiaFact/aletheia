import React from "react";
import AletheiaInput from "../../../../AletheiaInput";
import AletheiaButton from "../../../../AletheiaButton";
import { DeleteOutlined, AddOutlined } from "@mui/icons-material";
import colors from "../../../../../styles/colors";

const InsertSourceForm = ({
    inputRef,
    handleClickButton,
    activeLink,
    onRemoveLink,
    error,
    isLoading,
    ...rest
}) => {
    return (
        <section>
            <div
                style={{
                    display: "flex",
                    margin: "10px 0",
                    borderRadius: "4px",
                }}
            >
                <AletheiaInput
                    style={{
                        height: "30px",
                        borderRadius: "4px 0 0 4px",
                    }}
                    white
                    ref={inputRef}
                    data-cy="testClaimReviewSourcesInput"
                    {...rest}
                />
                <AletheiaButton
                    onClick={handleClickButton}
                    loading={isLoading}
                    fontWeight="bold"
                    sx={{
                        height: "30px",
                        borderRadius: activeLink ? "0px" : "0 4px 4px 0",
                        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.4)",
                        marginRight: "2px",
                    }}
                    data-cy="testClaimReviewSourcesButton"
                >
                    <AddOutlined fontSize="small" />
                </AletheiaButton>
                {activeLink && (
                    <AletheiaButton
                        onClick={onRemoveLink}
                        loading={isLoading}
                        fontWeight="bold"
                        sx={{
                            height: "30px",
                            borderLeftWidth: "2px",
                            borderLeftStyle: "solid",
                            borderRadius: "0 4px 4px 0",
                            boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.4)",
                        }}
                    >
                        <DeleteOutlined fontSize="small" />
                    </AletheiaButton>
                )}
            </div>
            {error && (
                <span style={{ fontSize: 14, color: colors.error }}>
                    {error}
                </span>
            )}
        </section>
    );
};

export default InsertSourceForm;
