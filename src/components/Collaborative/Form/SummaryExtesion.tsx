import React from "react";
import createNodeExtension from "./BaseNodeExtesion";

const SummaryExtension = createNodeExtension({
    name: "summary",
    componentName: React.lazy(() => import("./SummaryCard")),
    dataAttributeName: "summary-id",
});

export default SummaryExtension;
