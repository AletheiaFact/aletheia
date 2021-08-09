import * as shell from "shelljs";

shell.cp("-R", "./server/spec", "./dist/server/spec/");
shell.cp("-R", "./src/public", "./dist/public");
