import React from "react";

const smoothScrollTo =
    (hash: string) => (event: React.MouseEvent<HTMLElement>) => {
        const target = document.getElementById(hash.replace(/^#/, ""));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

export default smoothScrollTo;
