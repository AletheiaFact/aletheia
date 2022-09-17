import PersonalityCreateSearch from "../Personality/PersonalityCreateSearch";

const ClaimSelectPersonality = ({
    isCreatingClaim = false,
    setState = undefined,
    setPersonalityClaim = undefined,
}) => {
    return (
        <PersonalityCreateSearch
            setState={setState}
            setPersonalityClaim={setPersonalityClaim}
            isCreatingClaim={isCreatingClaim}
            withSuggestions={true}
        />
    );
};

export default ClaimSelectPersonality;
