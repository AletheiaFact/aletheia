import React, { useContext, useState } from "react";
import VerificationRequestDisplayStyle from "./VerificationRequestDisplay.style";
import VerificationRequestAlert from "./VerificationRequestAlert";
import VerificationRequestRecommendations from "./VerificationRequestRecommendations";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import VerificationRequestDrawer from "./VerificationRequestDrawer";
import VerificationRequestMainContent from "./VerificationRequestMainContent";
import VerificationRequestSearch from "./VerificationRequestSearch";

const VerificationRequestDisplay = ({ content }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { group, onRemoveVerificationRequest } = useContext(
        VerificationRequestContext
    );
    const { content: contentText } = content;
    const verificationRequestGroup = group?.content?.filter(
        (c) => c._id !== content._id
    );

    const onRemove = (id) => {
        setIsLoading(true);
        onRemoveVerificationRequest(id).then(() => setIsLoading(false));
    };

    return (
        <VerificationRequestDisplayStyle>
            <VerificationRequestAlert
                targetId={content?.group?.targetId}
                verificationRequestId={content._id}
            />

            <VerificationRequestMainContent
                content={contentText}
                verificationRequestGroup={verificationRequestGroup}
                openDrawer={() => setOpen(true)}
            />

            <VerificationRequestSearch />

            <VerificationRequestRecommendations />

            <VerificationRequestDrawer
                groupContent={verificationRequestGroup}
                open={open}
                isLoading={isLoading}
                onCloseDrawer={() => setOpen(false)}
                onRemove={onRemove}
            />
        </VerificationRequestDisplayStyle>
    );
};

export default VerificationRequestDisplay;
