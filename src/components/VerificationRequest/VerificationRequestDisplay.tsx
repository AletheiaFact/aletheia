import React, { useContext, useState } from "react";
import VerificationRequestDisplayStyle from "./VerificationRequestDisplay.style";
import VerificationRequestAlert from "./VerificationRequestAlert";
import VerificationRequestRecommendations from "./VerificationRequestRecommendations";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import VerificationRequestDrawer from "./VerificationRequestDrawer";
import VerificationRequestMainContent from "./VerificationRequestMainContent";
import VerificationRequestSearch from "./VerificationRequestSearch";
import { Roles } from "../../types/enums";
import { currentUserRole } from "../../atoms/currentUser";
import { useAtom } from "jotai";

const VerificationRequestDisplay = ({ content }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [role] = useAtom(currentUserRole);
    const { group, onRemoveVerificationRequest } = useContext(
        VerificationRequestContext
    );
    const verificationRequestGroup = group?.content?.filter(
        (c) => c._id !== content._id
    );

    const onRemove = async (id: string) => {
        setIsLoading(true);
        await onRemoveVerificationRequest(id);
        setIsLoading(false);
    };

    return (
        <VerificationRequestDisplayStyle container>
            <VerificationRequestAlert
                targetId={content?.group?.targetId}
                verificationRequestId={content._id}
            />

            <VerificationRequestMainContent
                content={content}
                verificationRequestGroup={verificationRequestGroup}
                openDrawer={() => setOpen(true)}
            />

            {role !== Roles.Regular && (
                <>
                    <VerificationRequestSearch />

                    <VerificationRequestRecommendations />

                    <VerificationRequestDrawer
                        groupContent={verificationRequestGroup}
                        open={open}
                        isLoading={isLoading}
                        onCloseDrawer={() => setOpen(false)}
                        onRemove={onRemove}
                    />
                </>
            )}
        </VerificationRequestDisplayStyle>
    );
};

export default VerificationRequestDisplay;
