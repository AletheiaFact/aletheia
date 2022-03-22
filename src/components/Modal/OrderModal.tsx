import React from "react"
import { Button, Modal } from "antd";
import OrderRadio from "../Radio/orderRadio";

const OrderModal = ({ visible, value, setValue, handleOk, handleCancel }) => {
    return (
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
            
            <OrderRadio 
                value={value}
                setValue={setValue}
            />

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
    )
};

export default OrderModal
