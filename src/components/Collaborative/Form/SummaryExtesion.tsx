import createNodeExtension from "./BaseNodeExtesion";
import SummaryCard from "./SummaryCard";

const SummaryExtension = createNodeExtension({
    name: "summary",
    componentName: SummaryCard,
    dataAttributeName: "summary-id",
});

export default SummaryExtension;
