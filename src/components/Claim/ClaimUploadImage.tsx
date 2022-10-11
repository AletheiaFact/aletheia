import ImageUpload from "../ImageUpload";
import PersonalityCard from "../Personality/PersonalityCard";

import { useContext } from "react";
import { CreateClaimMachineContext } from "../../Context/CreateClaimMachineProvider";
import { useSelector } from "@xstate/react";
import { claimDataSelector } from "../../machines/createClaim/selectors";
const ClaimUploadImage = () => {
    const { machineService } = useContext(CreateClaimMachineContext);
    const claimData = useSelector(machineService, claimDataSelector);
    const { personality } = claimData;
    return (
        <>
            {personality && (
                <PersonalityCard
                    personality={personality}
                    header={true}
                    mobile={true}
                />
            )}
            <ImageUpload personality={personality} />
        </>
    );
};

export default ClaimUploadImage;
