import Head from "next/head";
import React from "react";

const JsonLd = (props) => {
    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({ ...props }),
                }}
            />
        </Head>
    );
};

export default JsonLd;
