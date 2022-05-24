const assignedForm = {
    summary: {
        label: "Conclusion summary",
        type: "textArea",
        placeholder: "Insert summary here",
        defaultValue: "",
        rules: {
            required: true,
        },
    },
    questions: {
        label: "Which questions must be answered",
        type: "textList",
        placeholder: "",
        defaultValue: "",
        rules: {
            required: true,
        },
    },
    report: {
        label: "Verify report",
        type: "textArea",
        placeholder: "Insert content report here",
        defaultValue: "",
        rules: {
            required: true,
        },
    },
    verification: {
        label: "How we verify",
        type: "textArea",
        placeholder: "Insert how we verify",
        defaultValue: "",
        rules: {
            required: true,
        },
    },
    source: {
        label: "Sources",
        type: "textList",
        placeholder: "Paste URL",
        defaultValue: "",
        rules: {
            required: true,
        },
    },
};

export default assignedForm