import React, { useState } from "react";
import { Button, Modal, Radio, Space } from "antd";
import { SortAscendingOutlined } from "@ant-design/icons";
interface ISortByButton {
    sortBy: string
    refreshListItems: (sortBy: string) => void
}
const SortByButton = ({sortBy, refreshListItems}: ISortByButton) => {
    const [visible, setVisible] = useState(false)
    const [ value, setValue ] = useState('asc')

    const antModalHeader = {
        borderRadius: '20px 20px 0 0',
        background: 'green'
    }

    const handleOk = () => {
        refreshListItems(value)
        setVisible(!visible)
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onChangeRadio = e => {
        setValue(e.target.value);
    };

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

            <Modal
                visible={visible}
                footer={false}
            >
                <p
                    style={{
                    color: '#111111',
                    fontWeight: 700,
                    fontSize: '18px',
                    textAlign: 'center',
                    
                    }}
                >
                    Sort speeches by
                </p>
                <Radio.Group
                    onChange={onChangeRadio}
                    value={value}
                    style={{
                        fontSize: '30px',
                    }}
                >
                    <Space direction="vertical">
                        <Radio 
                            value='recent'
                        >
                            <span style={{marginLeft:10}}>
                                Recently added
                            </span>
                        </Radio>
                        <Radio
                            value='asc'
                        >
                            <span style={{marginLeft:10}}>
                                Newest
                            </span>
                        </Radio>
                        <Radio
                            value='desc'
                        >
                            <span style={{marginLeft:10}}>
                                Oldest
                            </span>
                        </Radio>
                        <Radio
                            value='most'
                        >
                            <span style={{marginLeft:10}}>
                                Most reliable
                            </span>
                        </Radio>
                        <Radio
                            value='less'
                        >
                            <span style={{marginLeft:10}}>
                                Less reliable
                            </span>
                        </Radio>
                    </Space>
                </Radio.Group>
                <div style={{
                    position: 'absolute',
                    left: 30,
                    bottom: 24,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button
                        type="text"
                        onClick={handleCancel}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 40,
                            width: 120,
                            justifyContent: 'center'
                        }}
                    >
                        <span
                            style={{
                                color: '#2D77A3',
                                textDecorationLine: 'underline',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: 14,
                            }}
                        >
                            Cancel
                        </span>
                    </Button>

                    <Button
                        onClick={handleOk}
                        shape='round'
                        style={{
                            background: '#2D77A3',
                            width: 120,
                            height: 40,
                        }}
                    >
                        <span
                            style={{
                                color: '#fff',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: 14,
                            }}
                        >
                            Done
                        </span>
                    </Button>
                </div>
            </Modal>
        </>
    )
}
export default SortByButton