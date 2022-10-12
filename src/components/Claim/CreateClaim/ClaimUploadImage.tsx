import { useSelector } from "@xstate/react";
import { useContext } from "react";

import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import { claimDataSelector } from "../../../machines/createClaim/selectors";
import ImageUpload from "../../ImageUpload";

const ClaimUploadImage = () => {
    const { machineService } = useContext(CreateClaimMachineContext);
    const { personality } = useSelector(machineService, claimDataSelector);
    return (
        <>
            <ImageUpload personality={personality} />
        </>
    );
};

export default ClaimUploadImage;
