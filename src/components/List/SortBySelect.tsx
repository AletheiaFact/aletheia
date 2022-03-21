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
              onOk={handleOk}
              onCancel={handleCancel}
              // footer={false}
              bodyStyle={{
                  backgroundColor: '#F5F5F5',
                  boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.25)',
                  borderRadius: '30px',
                  height: '300px',
              }}
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
                          value='asc'
                      >
                          <span
                              style={{
                                  fontSize: '18px',
                                  fontWeight: 700,
                                  color: '#515151',
                                  marginLeft: '10px',
                              }}
                          >
                            Newest
                        </span>
                      </Radio>
                      <Radio
                          value='desc'
                      >
                          <span
                              style={{
                                  fontSize: '18px',
                                  fontWeight: 700,
                                  color: '#515151',
                                  marginLeft: '10px',
                              }}
                          >
                              Oldest
                          </span>
                      </Radio>
                  </Space>
              </Radio.Group>
          </Modal>
      </>
  )
}
export default SortByButton