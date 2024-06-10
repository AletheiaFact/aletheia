import createNodeExtension from "./BaseNodeExtesion";
import QuestionCard from "./QuestionCard";

const QuestionExtension = createNodeExtension({
    name: "questions",
    componentName: QuestionCard,
    dataAttributeName: "question-id",
});

export default QuestionExtension;
