import { Radio } from "antd";
import React, { Component } from "react";

class ToggleSection extends Component {
    render() {
        return (
            <Radio.Group
                defaultValue={this.props.defaultValue}
                buttonStyle="solid"
                onChange={this.props.onChange}
                style={{ width: "100%" }}
            >
                <Radio.Button value={true}>{this.props.labelTrue}</Radio.Button>
                <Radio.Button value={false}>{this.props.labelFalse}</Radio.Button>
            </Radio.Group>
        );
    }
}

export default ToggleSection;
