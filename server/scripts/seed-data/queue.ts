// Work-queue scenarios for the MCP task queue tools
// (docs/superpowers/specs/2026-10-21-mcp-task-queue-design.md).
//
// Every claim sentence that has no published review is queued as `unassigned`.
// The scenarios below then move one sentence of a claim to another state.
// "me" is the queue owner: the account you log in with when using the MCP
// (SEED_QUEUE_EMAIL, defaults to the first user of the seed config).

export type QueueActor = "me" | "ana" | "bruno";

export const queueUsers = [
    {
        key: "ana" as const,
        name: "Ana Checadora",
        email: "ana.checadora@example.org",
        role: "fact-checker",
    },
    {
        key: "bruno" as const,
        name: "Bruno Revisor",
        email: "bruno.revisor@example.org",
        role: "reviewer",
    },
];

export interface QueueScenario {
    // Title of a claim in seed-data/claims.ts; its first sentence is used.
    claimTitle: string;
    state:
        | "assigned"
        | "reported"
        | "selectReviewer"
        | "cross-checking"
        | "submitted";
    assignees: QueueActor[];
    crossChecker?: QueueActor;
    reviewer?: QueueActor;
    // Report draft classification (unused for `assigned`).
    classification?: string;
    // The tool call this task is there to exercise.
    covers: string;
}

export const queueScenarios: QueueScenario[] = [
    // "Pegue a próxima tarefa": the unassigned tasks (everything not listed
    // here, oldest first) are handed out by next_review_task.
    {
        claimTitle: "Lula afirma ser o criador do SUS.",
        state: "assigned",
        assignees: ["ana"],
        covers: "join_review_task on an assigned task",
    },
    {
        claimTitle:
            "Flávio Bolsonaro afirma que reajuste do Bolsa Família é ilegal durante o período eleitoral",
        state: "reported",
        assignees: ["ana"],
        classification: "arguable",
        covers: "join_review_task on a reported task",
    },
    {
        claimTitle:
            "Flávio promete quatro indicações ao STF contra aborto e drogas, e que darão segurança jurídica para o país",
        state: "reported",
        assignees: ["me"],
        classification: "unverifiable",
        covers: "send_to_review (me as assignee)",
    },
    // Review backlog: claim_review_task (four-eyes: not assigned to me).
    {
        claimTitle:
            "Flávio Bolsonaro nega que viajou dos EUA para Brasília em jato ligado a Vorcaro",
        state: "selectReviewer",
        assignees: ["ana"],
        classification: "misleading",
        covers: "claim_review_task",
    },
    {
        claimTitle:
            "O negacionismo de Flávio Bolsonaro em relação ao aquecimento global",
        state: "selectReviewer",
        assignees: ["bruno"],
        classification: "false",
        covers: "claim_review_task",
    },
    // "Pegue o próximo Cross checking atribuído para mim"
    {
        claimTitle:
            "“Hoje, não coincidentemente, mais de 80% das famílias brasileiras estão endividadas.\"",
        state: "cross-checking",
        assignees: ["ana"],
        crossChecker: "me",
        classification: "trustworthy-but",
        covers: "next_cross_checking (mine, oldest)",
    },
    {
        claimTitle:
            "Lula afirma que a extrema pobreza caiu para o menor nível da história.",
        state: "cross-checking",
        assignees: ["bruno"],
        crossChecker: "me",
        classification: "exaggerated",
        covers: "next_cross_checking (mine, second)",
    },
    {
        claimTitle:
            "Lula afirma que mais de 13% do território brasileiro são áreas demarcadas para os povos indígenas",
        state: "cross-checking",
        assignees: ["ana"],
        crossChecker: "bruno",
        classification: "trustworthy",
        covers: "next_cross_checking must NOT return it (someone else's)",
    },
    // "Pegue as tarefas que preciso revisar para publicar"
    {
        claimTitle: "Pronunciamento sobre Combustíveis",
        state: "submitted",
        assignees: ["ana"],
        reviewer: "me",
        classification: "not-fact",
        covers: "list_my_review_tasks + publish_review_task",
    },
    {
        claimTitle: "Flávio diz que agro \"não é vilão\" e que é \"insanidade pisar no setor\"",
        state: "submitted",
        assignees: ["bruno"],
        reviewer: "me",
        classification: "unverifiable",
        covers: "list_my_review_tasks + publish_review_task",
    },
    {
        claimTitle:
            "'Brasil é o país que mais preserva seu meio ambiente', diz Bolsonaro",
        state: "submitted",
        assignees: ["ana"],
        reviewer: "bruno",
        classification: "misleading",
        covers: "list_my_review_tasks must NOT return it (someone else's)",
    },
];
