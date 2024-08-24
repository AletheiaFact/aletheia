import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import { execSync } from "child_process";

// Helper function to get changed lines
const getChangedLines = (file: string): number[] => {
    const diff = execSync(`git diff HEAD~1 ${file}`).toString();
    const lines = diff
        .split("\n")
        .filter((line) => line.startsWith("@@"))
        .flatMap((line) => {
            const match = line.match(/@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
            if (match) {
                const startLine = parseInt(match[1], 10);
                const lineCountMatch = line.match(
                    /@@ -\d+(?:,\d+)? \+\d+,(\d+) @@/
                );
                const lineCount = lineCountMatch
                    ? parseInt(lineCountMatch[1], 10)
                    : 1;
                return Array.from(
                    { length: lineCount },
                    (_, i) => startLine + i
                );
            }
            return [];
        });
    return lines;
};

// Helper function to determine if any line in a range is within changed lines
const isFunctionOrMethodChanged = (
    startLine: number,
    endLine: number,
    changedLines: number[]
): boolean => {
    return changedLines.some((line) => line >= startLine && line <= endLine);
};

// Function to analyze the codebase or changed files
const analyzeFiles = (files: string[]) => {
    const project = new Project();
    project.addSourceFilesAtPaths(files);

    const coverageData: { name: string; coverage: string[] }[] = [];

    project.getSourceFiles().forEach((sourceFile) => {
        const fileName = sourceFile.getFilePath();
        const changedLines = getChangedLines(fileName);

        // Analyze functions
        sourceFile.forEachChild((node: any) => {
            if (node.getKind() === SyntaxKind.FunctionDeclaration) {
                const name = (node as any).getName();
                if (name) {
                    const startLine = node.getStartLineNumber();
                    const endLine = node.getEndLineNumber();
                    if (
                        isFunctionOrMethodChanged(
                            startLine,
                            endLine,
                            changedLines
                        )
                    ) {
                        const jsDocTags = node
                            .getJsDocs()
                            .flatMap((doc) => doc.getTags());
                        const coverageTags = jsDocTags.filter(
                            (tag) => tag.getTagName() === "coverage"
                        );
                        console.log(
                            `Function: ${name}, Coverage Tags: ${coverageTags.length}`
                        );
                        coverageData.push({
                            name: name,
                            coverage: coverageTags.map(
                                (tag) => tag.getComment() || ""
                            ),
                        });
                    }
                }
            }

            if (node.getKind() === SyntaxKind.ClassDeclaration) {
                const className = (node as any).getName();
                if (className) {
                    const classJsDocTags = node
                        .getJsDocs()
                        .flatMap((doc) => doc.getTags());
                    const classCoverageTags = classJsDocTags.filter(
                        (tag) => tag.getTagName() === "coverage"
                    );
                    console.log(
                        `Class: ${className}, Coverage Tags: ${classCoverageTags.length}`
                    );
                    // coverageData.push({
                    //   name: className,
                    //   coverage: classCoverageTags.map(tag => tag.getComment() || '')
                    // });

                    const methods = node
                        .getMembers()
                        .filter(
                            (member) =>
                                member.getKind() ===
                                SyntaxKind.MethodDeclaration
                        );
                    methods.forEach((method: any) => {
                        const methodName = `${className}.${(
                            method as any
                        ).getName()}`;
                        const startLine = method.getStartLineNumber();
                        const endLine = method.getEndLineNumber();
                        if (
                            isFunctionOrMethodChanged(
                                startLine,
                                endLine,
                                changedLines
                            )
                        ) {
                            const methodJsDocTags = (method as any)
                                .getJsDocs()
                                .flatMap((doc) => doc.getTags());
                            const methodCoverageTags = methodJsDocTags.filter(
                                (tag) => tag.getTagName() === "coverage"
                            );
                            console.log(
                                `Method: ${methodName}, Coverage Tags: ${methodCoverageTags.length}`
                            );
                            coverageData.push({
                                name: methodName,
                                coverage: methodCoverageTags.map(
                                    (tag) => tag.getComment() || ""
                                ),
                            });
                        }
                    });
                }
            }
        });
    });

    return coverageData;
};

// Function to calculate coverage
const calculateCoverage = (
    coverageData: { name: string; coverage: string[] }[],
    expectedCoverage: number
) => {
    const totalElements = coverageData.length;
    const documentedElements = coverageData.filter(
        (item) => item.coverage.length > 0
    ).length;
    const coverage = (documentedElements / totalElements) * 100;

    console.log(`Total Elements: ${totalElements}`);
    console.log(`Documented Elements: ${documentedElements}`);
    console.log(`Coverage: ${coverage.toFixed(2)}%`);

    if (coverage < expectedCoverage) {
        console.error(
            `Coverage is below expected threshold of ${expectedCoverage}%`
        );
        process.exit(1);
    } else {
        console.log("Coverage meets the expected threshold");
    }
};

// Main function to run the script
const main = () => {
    const args = process.argv.slice(2);
    const mode = args[0]; // 'global' or 'changes'
    const expectedCoverage = parseInt(args[1], 10) || 80;

    if (mode === "global") {
        const files = ["src/**/*.ts"]; // Adjust the path to your codebase
        const coverageData = analyzeFiles(files);
        calculateCoverage(coverageData, expectedCoverage);
    } else if (mode === "changes") {
        const changedFiles = execSync("git diff --name-only HEAD~1")
            .toString()
            .split("\n")
            .filter((f) => f.endsWith(".ts"));
        if (changedFiles.length > 0) {
            const coverageData = analyzeFiles(changedFiles);
            calculateCoverage(coverageData, expectedCoverage);
        } else {
            console.log("No TypeScript files have changed.");
        }
    } else {
        console.error('Invalid mode. Use "global" or "changes".');
        process.exit(1);
    }
};

main();
