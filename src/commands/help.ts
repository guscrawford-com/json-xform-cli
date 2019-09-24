import { Command } from "@guscrawford.com/cleye";
import { CliAppInstance } from "../xform-cli";
import { join } from 'path';
const open = require('open');
export class HelpCommand implements Command {
    name = 'help';
    options = {};
    args = {};
    index = 0;
}
const RegisteredHelpCommand = CliAppInstance.command(new HelpCommand());
if (RegisteredHelpCommand.index !== -1) {
    // console.info(CliAppInstance.binRuntime)
    let helpPath = CliAppInstance.binRuntime.split(/\/|\\/);
        open(join(`${helpPath.slice(0, helpPath.length-2).join('/')}/docs/html/HELP.html`));
}