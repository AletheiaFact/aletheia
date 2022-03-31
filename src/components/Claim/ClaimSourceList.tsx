import React from "react";
import SourceApi from "../../api/sourceApi";
import BaseList from "../List/BaseList";
import { useTranslation } from "next-i18next";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Link from "next/link";

const ClaimSourceList = ({ claimId }) => {
    const { i18n } = useTranslation();
    return (
        <BaseList
            apiCall={SourceApi.getByTargetId}
            filter={{ targetId: claimId, i18n }}
            renderItem={(source) =>
                source && (
                    <LinkPreview
                        key={source._id}
                        url={source.link}
                        borderRadius="10px"
                        borderColor="transparent"
                        imageHeight="156px"
                        secondaryTextColor="#515151"
                        width="100%"
                        fallback={<Link href={source.link}>{source.link}</Link>}
                    />
                )
            }
        />
    );
};
export default ClaimSourceList;
