import React from "react";
import createNodeExtension from "./BaseNodeExtesion";

const SourceExtension = createNodeExtension({
    name: "source",
    componentName: React.lazy(() => import("./SourceCard")),
    dataAttributeName: "source-id",
});

export default SourceExtension;
