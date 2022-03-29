import React, { useState } from "react";
import { Button } from "antd";
import { SortAscendingOutlined } from "@ant-design/icons";
import OrderModal from '../Modal/OrderModal'
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

const SortByButton = ({ refreshListItems }) => {
    const { t } = useTranslation();
    const [ visible, setVisible ] = useState(false)
    const [ value, setValue ] = useState('asc')

    return (
        <>
            <Button
                shape="round"
                icon={
                    <SortAscendingOutlined style={{
                        fontSize: '16px',
                        color: colors.blackSecondary
                        }}
                    />
                }
                onClick={() => setVisible(!visible)}
                style={{
                    borderWidth: "2px",
                    borderColor: colors.blackSecondary,
                    height: '40px',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginLeft: 10,
                }}
            >
                <span 
                    style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 900,
                        color: colors.blackSecondary,
                    }}
                >
                    {t("sortButton:title")}
                </span>
            </Button>

            <OrderModal
                visible={visible}
                value={value}
                setValue={setValue}
                handleOk={() => {
                    refreshListItems(value)
                    setVisible(!visible)
                }}
                handleCancel={() => setVisible(false)}
            />
        </>
    )
}

export default SortByButton
