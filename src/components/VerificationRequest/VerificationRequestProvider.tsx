import { createContext, useState } from "react";
import verificationRequestApi from "../../api/verificationRequestApi";

interface IVerificationRequestContext {
    recommendations?: any;
    addRecommendation?: any;
    group?: any;
    removeFromGroup?: any;
    onRemoveVerificationRequest?: any;
}

export const VerificationRequestContext =
    createContext<IVerificationRequestContext>({});

export const VerificationRequestProvider = ({
    verificationRequest,
    baseRecommendations,
    children,
}) => {
    const [recommendations, setRecommendations] = useState(baseRecommendations);
    const [group, setGroup] = useState(verificationRequest.group);

    const addRecommendation = (verificationRequestLiked) => {
        const groupContent = group.content.filter(
            (v) => v._id !== verificationRequest._id
        );

        verificationRequestApi.updateVerificationRequest(
            verificationRequest._id,
            {
                group: [...groupContent, verificationRequestLiked],
            }
        );
        setRecommendations((prev) =>
            prev.filter((v) => v._id !== verificationRequestLiked._id)
        );
        addInGroup(verificationRequestLiked);
    };

    const addInGroup = (newVerificationRequest) => {
        setGroup((prev) => ({
            ...prev,
            content: [...prev.content, newVerificationRequest],
        }));
    };

    const removeFromGroup = (verificationRequestId) => {
        const contentGroup = group.content.filter(
            (verificationRequest) =>
                verificationRequest?._id !== verificationRequestId
        );

        setGroup((prev) => ({
            ...prev,
            content: contentGroup,
        }));
    };

    const onRemoveVerificationRequest = async (id) => {
        try {
            await verificationRequestApi.removeVerificationRequestFromGroup(
                id,
                {
                    group: group._id,
                }
            );

            removeFromGroup(id);
        } catch (e) {
            console.error(
                "Error while removing verification request from group",
                e
            );
        }
    };

    return (
        <VerificationRequestContext.Provider
            value={{
                recommendations,
                group,
                addRecommendation,
                removeFromGroup,
                onRemoveVerificationRequest,
            }}
        >
            {children}
        </VerificationRequestContext.Provider>
    );
};
