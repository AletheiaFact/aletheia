const review = {
    username: "User",
    summary: "Conclusion summary content",
    question1: "Question 1 content",
    question2: "Question 2 content",
    report: "Verification Report content",
    process: "Verification process content",
    source1: "https://wikidata.org",
    source2: "https://google.com",
    classification: "arguable",
    editorContent: {
        type: "doc",
        content: [
            {
                type: "summary",
                content: [
                    {
                        type: "paragraph",
                    },
                ],
            },
            {
                type: "questions",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: "test",
                                marks: [
                                    {
                                        type: "link",
                                        attrs: {
                                            href: "https://wikidata.org",
                                            target: null,
                                            auto: false,
                                            id: "lovjnfw8",
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "report",
                content: [
                    {
                        type: "paragraph",
                    },
                ],
            },
            {
                type: "verification",
                content: [
                    {
                        type: "paragraph",
                    },
                ],
            },
        ],
    },
};

export default review;
