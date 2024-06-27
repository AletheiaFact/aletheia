import createNodeExtension from "./BaseNodeExtesion";
import ReportCard from "./ReportCard";

const ReportExtension = createNodeExtension({
    name: "report",
    componentName: ReportCard,
    dataAttributeName: "report-id",
});

export default ReportExtension;
