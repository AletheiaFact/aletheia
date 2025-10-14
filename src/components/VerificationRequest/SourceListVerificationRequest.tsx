import React from 'react';
import Link from 'next/link';
import { VerificationRequestContent } from './VerificationRequestContent';

interface SourceListProps {
    sources: Array<{ href?: string }>;
    t: (key: string) => string;
    truncateUrl: (url: string) => string;
    id: string;
}

const SourceList: React.FC<SourceListProps> = ({ sources, t, truncateUrl, id }) => {
    if (!sources?.length) return null;

    const flatSources = sources.flat().filter((source) => !!source.href);

    if (flatSources.length === 0) return null;

    return (
        <>
            {flatSources.map((source, index) => (
                <VerificationRequestContent
                    key={`${id}-source-${index}`}
                    label={
                        index === 0
                            ? t("verificationRequest:verificationRequestTagSource")
                            : ""
                    }
                    value={
                        <Link href={source.href!} passHref>
                            {truncateUrl(source.href!)}
                        </Link>
                    }
                />
            ))}
        </>
    );
};

export default SourceList;