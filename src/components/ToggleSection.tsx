import { Radio } from "antd";

const ToggleSection = (props) => {
    return (
        <Radio.Group
            defaultValue={props.defaultValue}
            buttonStyle="solid"
            onChange={props.onChange}
            style={{ width: "100%" }}
        >
            <Radio.Button value={true}>{props.labelTrue}</Radio.Button>
            <Radio.Button value={false}>{props.labelFalse}</Radio.Button>
        </Radio.Group>
    );
}

export default ToggleSection;
