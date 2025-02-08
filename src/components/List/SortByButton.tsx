import React, { useState } from "react";
import { Button } from "@mui/material";
import { SortByAlphaOutlined } from "@mui/icons-material";
import OrderModal from "../Modal/OrderModal";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

const SortByButton = ({ refreshListItems }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("asc");

    return (
        <>
            <Button
                startIcon={
                    <SortByAlphaOutlined
                        fontSize="small"
                        style={{
                            color: colors.blackSecondary,
                        }}
                    />
                }
                onClick={() => setOpen(!open)}
                style={{
                    border: "1px solid",
                    borderWidth: "2px",
                    borderColor: colors.blackSecondary,
                    borderRadius:"20px",
                    height: "40px",
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginLeft: 10,
                }}
            >
                <span
                    style={{
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: "15px",
                        fontWeight: 700,
                        color: colors.blackSecondary,
                    }}
                >
                    {t("sortButton:title")}
                </span>
            </Button>

            <OrderModal
                open={open}
                value={value}
                setValue={setValue}
                handleOk={() => {
                    refreshListItems(value);
                    setOpen(!open);
                }}
                handleCancel={() => setOpen(false)}
            />
        </>
    );
};

export default SortByButton;
