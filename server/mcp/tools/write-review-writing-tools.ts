import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
    jsonResult,
    safeTool,
} from "./tool-helpers";
import {
    NextReviewTaskSchema,
    ReleaseReviewTaskSchema,
    ReviewTaskByHashSchema,
    SaveReviewLogSchema,
    StartReviewTaskSchema,
    SubmitReportSchema,
} from "./schemas";
import { describeClaimContext, describeTask } from "./review-task-view";
import {
    authorizeNamespaceWrite,
    authorizeStoredTask,
    describeWithLog,
} from "./write-review-helpers";
import type { McpToolDeps } from "../mcp.service";
import { CLASSIFICATION_LABELS_NOTE as LABELS_NOTE } from "./classification-labels";

/** Taking a task and writing it: start, next, join, save, submit, release. */
export function registerWriteReviewWritingTools(
    server: McpServer,
    deps: McpToolDeps
) {
    server.registerTool(
        "start_review_task",
        {
            description:
                "Claim a claim sentence for fact-checking: creates its review task already assigned to you (or takes its queued task). The task gets the requested classification methodology (default aletheia), fixed from then on; a task that already has another one is refused.",
            inputSchema: StartReviewTaskSchema.shape as any,
        },
        safeTool("start_review_task", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            assertCanWrite(
                deps.abilityFactory,
                deps.request.user,
                args.nameSpace
            );
            assertUserSession(deps.request.user);
            return jsonResult(
                await deps.reviewWorkflowService.startReviewTask(
                    deps.request.user as { _id: string },
                    args
                )
            );
        })
    );

    server.registerTool(
        "next_review_task",
        {
            description:
                "Get the next fact-checking task: takes the oldest unassigned task in the queue and assigns it to you. Two callers never receive the same task. Refused while you still have a task being written. The task gets the requested classification methodology (default aletheia), fixed from then on; only tasks without one, or with the same one, are handed out." +
                LABELS_NOTE,
            inputSchema: NextReviewTaskSchema.shape as any,
        },
        safeTool("next_review_task", async (args) => {
            await authorizeNamespaceWrite(deps, args.nameSpace);
            // Default, flag and id check, as for a task created on the web
            const methodology =
                deps.reviewTaskService.resolveMethodologyForNewTask(
                    args.classificationMethodology
                );
            const task = await deps.reviewQueueService.nextReviewTask(
                deps.request.user as any,
                args.nameSpace,
                methodology
            );
            return jsonResult(
                task
                    ? {
                          task: await describeTask(deps, task),
                          claim: await describeClaimContext(deps, task),
                      }
                    : { task: null, message: "No task available in the queue" }
            );
        })
    );

    server.registerTool(
        "join_review_task",
        {
            description:
                "Join a task someone is already working on (assigned or reported) as an extra assignee. Joining twice is a no-op." +
                LABELS_NOTE,
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("join_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.joinReviewTask(
                        deps.request.user as any,
                        task
                    )
                )
            );
        })
    );

    server.registerTool(
        "save_review_log",
        {
            description:
                "Save the review form of a task you are writing (partial saves allowed; only the fields you send change). summary = 'Resumo da conclusão', questions = guiding questions, report = 'Relatório da verificação' (paragraphs separated by \\n), verification = 'Como verificamos?', sources = links (quotedText must be copied exactly from its field), classification = label, which must be an option of the task's classificationMethodology (list_classification_methodologies). Returns the saved form and `missing`: what submit_report still needs." +
                LABELS_NOTE,
            inputSchema: SaveReviewLogSchema.shape as any,
        },
        safeTool("save_review_log", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            const { dataHash: _dataHash, ...input } = args;
            return jsonResult(
                await describeWithLog(
                    deps,
                    await deps.reviewWorkflowService.saveReviewLog(
                        deps.request.user as any,
                        task,
                        input
                    )
                )
            );
        })
    );

    server.registerTool(
        "submit_report",
        {
            description:
                "Finish the report of a task you are writing (assigned → reported). Refused, with the list of missing fields, unless classification, summary, sources and (except for not-fact) questions, report and verification are filled. With sendToCrossCheck: true it also sends the report to the cross-check backlog (reported → selectCrossChecker), saving a send_to_cross_check call. The classification must be an option of the task's classification methodology." +
                LABELS_NOTE,
            inputSchema: SubmitReportSchema.shape as any,
        },
        safeTool("submit_report", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            const user = deps.request.user as any;
            const reported = await deps.reviewWorkflowService.submitReport(
                user,
                task
            );
            return jsonResult(
                await describeTask(
                    deps,
                    args.sendToCrossCheck === true
                        ? await deps.reviewWorkflowService.sendToCrossCheck(
                              user,
                              reported
                          )
                        : reported
                )
            );
        })
    );

    server.registerTool(
        "release_review_task",
        {
            description:
                "Give back a task you are writing: you leave it and, if nobody else is on it, it returns to the queue. The queue will not hand it to you again. Use for sentences that cannot be checked (bylines, fragments), duplicates, or checks that need a person. The task keeps its classification methodology." +
                LABELS_NOTE,
            inputSchema: ReleaseReviewTaskSchema.shape as any,
        },
        safeTool("release_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.releaseTask(
                        deps.request.user as any,
                        task,
                        args.reason,
                        args.note
                    )
                )
            );
        })
    );
}
