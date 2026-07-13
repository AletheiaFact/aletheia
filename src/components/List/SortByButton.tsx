import React, { useState } from "react";
import { SortByAlphaOutlined } from "@mui/icons-material";
import OrderModal from "../Modal/OrderModal";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { useTranslations } from "next-intl";

const SortByButton = ({ refreshListItems }) => {
    const tSortButton = useTranslations("sortButton");
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
                {tSortButton("title")}
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
