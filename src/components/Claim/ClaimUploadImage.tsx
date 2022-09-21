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
                />
            )}
            <ImageUpload personality={personality} />
        </>
    );
};

export default ClaimUploadImage;
