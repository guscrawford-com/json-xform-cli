import { Command, CliApp } from "@guscrawford.com/cleye";
const pkg = require("../../package.json");
export class VersionCommand implements Command {
    name = 'version';
    options = {};
    args = {};
    index = 0;
}
function version_main (app:CliApp) {
    process.stdout.write(Buffer.from(pkg.version));
}