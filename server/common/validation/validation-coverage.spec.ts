import * as fs from "fs";
import * as path from "path";
import { PATH_METADATA, ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";

// Fails on any @Body/@Query/@Param with no pipe and no class DTO (invisible to
// the global ValidationPipe). Baseline may only shrink. Regenerate with:
//   UPDATE_VALIDATION_BASELINE=1 yarn test server/common/validation/validation-coverage.spec.ts

const BASELINE_FILE = path.join(__dirname, "validation-coverage.baseline.json");

// `editor.controler.ts` is misspelled on disk.
const controllerModules = import.meta.glob(
    ["../../**/*.controller.ts", "../../**/*.controler.ts"],
    { eager: true }
);

const SERVER_ROOT = path.resolve(__dirname, "../..");

function filesDeclaringControllers(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return entry.name === "node_modules" || entry.name === "dist"
                ? []
                : filesDeclaringControllers(full);
        }
        return entry.name.endsWith(".ts") &&
            !entry.name.endsWith(".spec.ts") &&
            fs.readFileSync(full, "utf8").includes("@Controller(")
            ? [full]
            : [];
    });
}

const CHECKED: Partial<Record<RouteParamtypes, string>> = {
    [RouteParamtypes.BODY]: "body",
    [RouteParamtypes.QUERY]: "query",
    [RouteParamtypes.PARAM]: "param",
};

// Metatypes the global class-validator pipe cannot validate.
const OPAQUE_METATYPES = new Set<unknown>([
    undefined,
    Object,
    Array,
    String,
    Number,
    Boolean,
]);

interface RouteArg {
    index: number;
    data?: string;
    pipes?: unknown[];
}

function findUnvalidatedArgs(): string[] {
    const offenders = new Set<string>();

    for (const moduleExports of Object.values(controllerModules)) {
        for (const exported of Object.values(moduleExports as object)) {
            if (
                typeof exported !== "function" ||
                Reflect.getMetadata(PATH_METADATA, exported) === undefined
            ) {
                continue;
            }
            const controller = exported as new (...args: never[]) => unknown;

            for (const method of Object.getOwnPropertyNames(
                controller.prototype
            )) {
                const args: Record<string, RouteArg> =
                    Reflect.getMetadata(
                        ROUTE_ARGS_METADATA,
                        controller,
                        method
                    ) ?? {};
                const paramTypes: unknown[] =
                    Reflect.getMetadata(
                        "design:paramtypes",
                        controller.prototype,
                        method
                    ) ?? [];

                for (const [key, arg] of Object.entries(args)) {
                    const type = Number(key.split(":")[0]) as RouteParamtypes;
                    const label = CHECKED[type];
                    if (!label) continue;

                    const hasPipe = (arg.pipes ?? []).length > 0;
                    const isDtoClass = !OPAQUE_METATYPES.has(
                        paramTypes[arg.index]
                    );
                    if (hasPipe || isDtoClass) continue;

                    const suffix = arg.data ? `:${arg.data}` : "";
                    offenders.add(
                        `${controller.name}.${method} ${label}${suffix}`
                    );
                }
            }
        }
    }

    return [...offenders].sort();
}

describe("validation coverage ratchet", () => {
    const current = findUnvalidatedArgs();

    it("scans every file that declares a @Controller", () => {
        const scanned = new Set(
            Object.keys(controllerModules).map((p) =>
                path.resolve(__dirname, p)
            )
        );
        const missed = filesDeclaringControllers(SERVER_ROOT).filter(
            (file) => !scanned.has(file)
        );
        expect(missed).toEqual([]);
    });

    if (process.env.UPDATE_VALIDATION_BASELINE) {
        it("rewrites the baseline", () => {
            fs.writeFileSync(
                BASELINE_FILE,
                JSON.stringify(current, null, 4) + "\n"
            );
        });
        return;
    }

    const baseline: string[] = JSON.parse(
        fs.readFileSync(BASELINE_FILE, "utf8")
    );

    it("has no NEW unvalidated @Body/@Query/@Param (use ZodBody/ZodQuery/ZodParam)", () => {
        const added = current.filter((entry) => !baseline.includes(entry));
        expect(added).toEqual([]);
    });

    it("baseline only lists offenders that still exist (delete fixed lines)", () => {
        const fixed = baseline.filter((entry) => !current.includes(entry));
        expect(fixed).toEqual([]);
    });
});
