import ImageUpload from "../ImageUpload";
import PersonalityCard from "../Personality/PersonalityCard";

const ClaimUploadImage = ({ personality }) => {
    return (
        <>
            {personality && (
                <PersonalityCard
                    personality={personality}
                    header={true}
                    mobile={true}
                    isCreatingClaim={false}
                    setState={undefined}
                    setPersonalityClaim={undefined}
                />
            )}
            <ImageUpload />
        </>
    );
};

export default ClaimUploadImage;
