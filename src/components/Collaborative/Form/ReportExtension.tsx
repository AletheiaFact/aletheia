import React from "react";
import createNodeExtension from "./BaseNodeExtesion";

const ReportExtension = createNodeExtension({
    name: "report",
    componentName: React.lazy(() => import("./ReportCard")),
    dataAttributeName: "report-id",
});

export default ReportExtension;
