import { CliApp } from '@guscrawford.com/cleye';
import './commands';
import { DefaultCommand, HelpCommand, VersionCommand } from './commands';

export const CliAppInstance = new CliApp({
    commands:{
        default:new DefaultCommand(),
        help: new HelpCommand(),
        version: new VersionCommand()
    }
});