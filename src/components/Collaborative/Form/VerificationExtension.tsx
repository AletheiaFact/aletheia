import React from "react";
import createNodeExtension from "./BaseNodeExtesion";

const VerificationExtension = createNodeExtension({
    name: "verification",
    componentName: React.lazy(() => import("./VerificationCard")),
    dataAttributeName: "verification-id",
});

export default VerificationExtension;
