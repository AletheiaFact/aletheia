import React from "react"
import { Button, Modal } from "antd";
import styled from  "styled-components";
import OrderRadio from "../Radio/orderRadio";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const AletheiaModal = styled(Modal)`
    background: none;
    box-shadow: none;
    padding: 0;

    .ant-modal-content {
      width: 300px;
      margin: 0 auto;
      border-radius: 30px;
      background-color: ${colors.lightGray};
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
      padding: 19px 34px 24px 34px;
      
    }

    .ant-modal-body {
      padding: 0;
    }

    svg[data-icon="close"] {
        margin-top: 24px;
        width: 20px;
        height: 20px;
        color: #353535;
        margin-right: 20px;
    }
`

const ModalCancelButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 120px;
`

const ModalOkButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2D77A3;
    width: 120px;
    height: 40px;
`


const OrderModal = ({ visible, value, setValue, handleOk, handleCancel }) => {
    const { t } = useTranslation();

    return (
        <AletheiaModal
            className="ant-modal-content"
            visible={visible}
            footer={false}
            onCancel={handleCancel}
        >
            <span
                style={{
                    color: '#111111', //doesn't has this color in ./colors
                    marginLeft: 10,
                    fontWeight: 700,
                    fontSize: '18px',
                    textAlign: 'center',
                    
                }}
            >
                {t("orderModal:title")}
            </span>
            
            <OrderRadio 
                value={value}
                setValue={setValue}
            />

            <div
                style={{
                    marginTop: 30,
                    display: "flex",
                }}
            >
                <ModalCancelButton
                    type="text"
                    onClick={handleCancel}
                >
                    <span
                        style={{
                            color: '#2D77A3', //doesn't has this color in ./colors
                            textDecorationLine: 'underline',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: 14,
                        }}
                    >
                        {/* {t("list:loadMoreButton")} */}
                        Cancel
                    </span>
                </ModalCancelButton>

                <ModalOkButton
                    onClick={handleOk}
                    shape='round'
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
                </ModalOkButton>
            </div>
        </AletheiaModal>
    )
};

export default OrderModal
