import createNodeExtension from "./BaseNodeExtesion";
import VerificationCard from "./VerificationCard";

const VerificationExtension = createNodeExtension({
    name: "verification",
    componentName: VerificationCard,
    dataAttributeName: "verification-id",
});

export default VerificationExtension;
