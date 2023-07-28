import React from "react";
import AletheiaInput from "../../../AletheiaInput";
import AletheiaButton from "../../../Button";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import colors from "../../../../styles/colors";

const InsertSourceForm = ({
    inputRef,
    handleClickButton,
    activeLink,
    onRemoveLink,
    error,
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
                    {...rest}
                />
                <AletheiaButton
                    onClick={handleClickButton}
                    style={{
                        fontWeight: "bold",
                        height: "auto",
                        borderRadius: activeLink ? "0px" : "0 4px 4px 0",
                        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.4)",
                        marginRight: 2,
                    }}
                >
                    <PlusOutlined />
                </AletheiaButton>
                {activeLink && (
                    <AletheiaButton
                        onClick={onRemoveLink}
                        style={{
                            fontWeight: "bold",
                            height: "auto",
                            borderLeftWidth: "2px",
                            borderLeftStyle: "solid",
                            borderRadius: "0 4px 4px 0",
                            boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.4)",
                        }}
                    >
                        <DeleteOutlined />
                    </AletheiaButton>
                )}
            </div>
            {error && (
                <span style={{ fontSize: 14, color: colors.redText }}>
                    {error}
                </span>
            )}
        </section>
    );
};

export default InsertSourceForm;
