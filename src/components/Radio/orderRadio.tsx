import React from "react"
import { Radio, Space } from "antd";

const OrderRadio = ({value, setValue}) => {
    const onChangeRadio = e => {
        setValue(e.target.value);
    }

    return(
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
    )
}

export default OrderRadio
