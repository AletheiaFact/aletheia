import { Col } from "antd";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store/store";
import { ActionTypes } from "../../../store/types";
import AletheiaButton from "../../Button";
import PersonalityCreateSearch from "../../Personality/PersonalityCreateSearch";
import { useContext } from "react";
import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import { useSelector } from "@xstate/react";
import { claimDataSelector } from "../../../machines/createClaim/selectors";

const ClaimSelectPersonality = ({
    isCreatingClaim = false,
    setState = undefined,
}) => {
    const { machineService } = useContext(CreateClaimMachineContext);
    const claimData = useSelector(machineService, claimDataSelector);

    console.log("claimData", claimData);
    const dispatch = useDispatch();

    const { claimType } = useAppSelector((state) => ({
        claimType: state.claimType,
    }));

    return (
        <>
            <PersonalityCreateSearch
                setState={setState}
                isCreatingClaim={isCreatingClaim}
                withSuggestions={true}
            />
            {claimType === "image" && (
                <Col
                    style={{
                        margin: "24px 0",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <AletheiaButton
                        onClick={() => {
                            setState(claimType);
                            dispatch({
                                type: ActionTypes.SET_CLAIM_CREATE_PERSONALITY,
                                claimPersonality: undefined,
                            });
                        }}
                    >
                        <span>Criar sem uma personalidade</span>
                    </AletheiaButton>
                </Col>
            )}
        </>
    );
};

export default ClaimSelectPersonality;
