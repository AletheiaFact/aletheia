import React from "react";
import Link from "next/link";
import { VerificationRequestContent } from "./VerificationRequestContent";
import { truncateUrl } from "../../helpers/verificationRequestCardHelper";
import { useTranslations } from "next-intl";

interface SourceListProps {
    sources: Array<{ href?: string }>;
    id: string;
}

const SourceList: React.FC<SourceListProps> = ({ sources, id }) => {
    if (!sources?.length) return null;

    const tVerificationRequest = useTranslations("verificationRequest");

    const flatSources = sources.flat().filter((source) => !!source.href);

    if (flatSources.length === 0) return null;

    return (
        <>
            {flatSources.map((source, index) => (
                <VerificationRequestContent
                    key={`${id}-source-${index}`}
                    dataCy={`testVerificationRequestSource${index}`}
                    label={
                        index === 0
                            ? tVerificationRequest("tagSource")
                            : ""
                    }
                    value={
                        <Link href={source.href} passHref>
                            {truncateUrl(source.href)}
                        </Link>
                    }
                />
            ))}
        </>
    );
};

export default SourceList;
