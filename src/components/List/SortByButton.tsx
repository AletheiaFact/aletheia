import React, { useState } from "react";
import { Button } from "antd";
import { SortAscendingOutlined } from "@ant-design/icons";
import OrderModal from '../Modal/OrderModal'

const SortByButton = ({ refreshListItems }) => {
    const [visible, setVisible] = useState(false)
    const [ value, setValue ] = useState('asc')

    return (
        <>
            <Button
                shape="round"
                icon={
                    <SortAscendingOutlined style={{
                        fontSize: '16px',
                        fontWeight: 900,
                        }}
                    />
                }
                onClick={() => setVisible(!visible)}
                style={{
                    borderWidth: "2px",
                    borderColor: '#515151',
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
                        color: "#515151",
                    }}
                >
                    Sort By
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
