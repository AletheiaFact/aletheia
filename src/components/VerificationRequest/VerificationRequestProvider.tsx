import { createContext, useMemo, useState } from "react";
import verificationRequestApi from "../../api/verificationRequestApi";
import { VerificationRequest } from "../../types/VerificationRequest";
import { Group } from "../../types/Group";
import { useTranslation } from "next-i18next";

interface IVerificationRequestContext {
    recommendations?: VerificationRequest[];
    addRecommendation?: (verificationRequest: VerificationRequest) => void;
    group?: Group;
    removeFromGroup?: (id: string) => void;
    onRemoveVerificationRequest?: (id: string) => void;
}

interface IVerificationRequestProvider {
    verificationRequest: VerificationRequest;
    baseRecommendations: VerificationRequest[];
    children: React.ReactNode;
}

export const VerificationRequestContext =
    createContext<IVerificationRequestContext>({});

export const VerificationRequestProvider = ({
    verificationRequest,
    baseRecommendations,
    children,
}: IVerificationRequestProvider) => {
    const { t } = useTranslation();
    const [recommendations, setRecommendations] =
        useState<VerificationRequest[]>(baseRecommendations);
    const [group, setGroup] = useState<Group>(verificationRequest.group);

    const addRecommendation = async (
        newVerificationRequest: VerificationRequest
    ): Promise<void> => {
        const groupContent =
            group?.content?.filter((v) => v._id !== verificationRequest._id) ||
            [];

        await verificationRequestApi.updateVerificationRequest(
            verificationRequest._id,
            {
                group: [...groupContent, newVerificationRequest],
            },
            t,
            'updateGroup'
        );
        setRecommendations((prev) =>
            prev.filter((v) => v._id !== newVerificationRequest._id)
        );
        addInGroup(newVerificationRequest);
    };

    const addInGroup = (newVerificationRequest: VerificationRequest): void => {
        setGroup((prev) => {
            if (!prev) {
                return { content: [newVerificationRequest] };
            }
            return {
                ...prev,
                content: [...prev.content, newVerificationRequest],
            };
        });
    };

    const removeFromGroup = (verificationRequestId: string): void => {
        const contentGroup = group.content.filter(
            (verificationRequest) =>
                verificationRequest?._id !== verificationRequestId
        );

        setGroup((prev) => ({
            ...prev,
            content: contentGroup,
        }));
    };

    const onRemoveVerificationRequest = async (
        verificationRequestId: string
    ): Promise<void> => {
        try {
            await verificationRequestApi.removeVerificationRequestFromGroup(
                verificationRequestId,
                {
                    group: group._id,
                },
                t
            );

            removeFromGroup(verificationRequestId);
        } catch (e) {
            console.error(
                "Error while removing verification request from group",
                e
            );
        }
    };

    const value = useMemo(
        () => ({
            recommendations,
            group,
            addRecommendation,
            removeFromGroup,
            onRemoveVerificationRequest,
        }),
        [
            recommendations,
            group,
            addRecommendation,
            removeFromGroup,
            onRemoveVerificationRequest,
        ]
    );

    return (
        <VerificationRequestContext.Provider value={value}>
            {children}
        </VerificationRequestContext.Provider>
    );
};
