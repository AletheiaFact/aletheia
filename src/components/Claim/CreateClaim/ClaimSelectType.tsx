import { PlusOutlined } from "@ant-design/icons";
import { Col, Select } from "antd";
import { ActionTypes } from "../../../store/types";
import colors from "../../../styles/colors";
import AletheiaButton from "../../Button";
import { SelectInput } from "../../Form/ClaimReviewSelect";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import { useSelector } from "@xstate/react";
import { claimDataSelector } from "../../../machines/createClaim/selectors";

const { Option } = Select;
const ClaimSelectType = ({ setState }) => {
    const { machineService } = useContext(CreateClaimMachineContext);
    const claimData = useSelector(machineService, claimDataSelector);

    console.log("claimData", claimData);

    const dispatch = useDispatch();

    const handleClick = () => setState("personality");

    return (
        <>
            <Col style={{ marginTop: "24px" }}>
                <p
                    style={{
                        fontSize: "18px",
                        lineHeight: "24px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    Context
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    In what context did this speech happen? Ex. Was it on social
                    media or an official government speech?
                </p>
            </Col>
            <SelectInput
                placeholder={"Choose an option"}
                onChange={(type) => {
                    dispatch({
                        type: ActionTypes.SET_CLAIM_CREATE_TYPE,
                        claimType: type,
                    });
                }}
            >
                <Option value="speech">Speech</Option>
                <Option value="image">image</Option>
            </SelectInput>
            <Col
                style={{
                    margin: "24px 0",
                    display: "flex",
                    justifyContent: "right",
                }}
            >
                <AletheiaButton onClick={handleClick}>
                    <span>Add Type</span>
                    <PlusOutlined />
                </AletheiaButton>
            </Col>
        </>
    );
};

export default ClaimSelectType;
