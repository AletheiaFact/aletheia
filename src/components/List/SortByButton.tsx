import React, { useState } from "react";
import { SortByAlphaOutlined } from "@mui/icons-material";
import OrderModal from "../Modal/OrderModal";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../AletheiaButton";

const SortByButton = ({ refreshListItems }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("desc");

    return (
        <>
            <AletheiaButton
                type={ButtonType.whiteBlack}
                rounded
                fontWeight={700}
                startIcon={<SortByAlphaOutlined fontSize="small" />}
                onClick={() => setOpen(!open)}
            >
                {t("sortButton:title")}
            </AletheiaButton>

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
