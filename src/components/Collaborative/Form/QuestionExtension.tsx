import React from "react";
import createNodeExtension from "./BaseNodeExtesion";

const QuestionExtension = createNodeExtension({
    name: "question",
    componentName: React.lazy(() => import("./QuestionCard")),
    dataAttributeName: "question-id",
});

export default QuestionExtension;
