import createNodeExtension from "./BaseNodeExtesion";
import SourceCard from "./SourceCard";

const SourceExtension = createNodeExtension({
    name: "source",
    componentName: SourceCard,
    dataAttributeName: "source-id",
});

export default SourceExtension;
