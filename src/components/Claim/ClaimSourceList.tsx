import React from "react";
import SourceApi from "../../api/sourceApi";
import BaseList from "../List/BaseList";
import { useTranslation } from "next-i18next";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Link from "next/link";
import SourceSkeleton from "../Skeleton/SourceSkeleton";
import colors from "../../styles/colors";

const ClaimSourceList = ({ claimId }) => {
    const { i18n } = useTranslation();
    return (
        <BaseList
            apiCall={SourceApi.getByTargetId}
            filter={{ targetId: claimId, i18n }}
            style={{ fontSize: 14, padding: 5 }}
            renderItem={(source) =>
                source && (
                    <LinkPreview
                        key={source._id}
                        url={source.href}
                        borderRadius="10px"
                        borderColor="transparent"
                        imageHeight="156px"
                        secondaryTextColor={colors.blackSecondary}
                        width="100%"
                        fallback={<Link href={source.href}>{source.href}</Link>}
                        showLoader
                    />
                )
            }
            skeleton={<SourceSkeleton />}
        />
    );
};
export default ClaimSourceList;
