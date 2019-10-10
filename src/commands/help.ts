import { Command, CliApp } from "@guscrawford.com/cleye";
import { join } from 'path';
const open = require('open');
export class HelpCommand implements Command {
    name = 'help';
    options = {};
    args = {};
    index = 0;
    run = help_main;
}
function help_main(app:CliApp) {
    let helpPath = app.binRuntime.split(/\/|\\/);
        open(join(`${helpPath.slice(0, helpPath.length-2).join('/')}/docs/html/HELP.html`));
}