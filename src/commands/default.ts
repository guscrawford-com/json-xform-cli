import { Templater } from "@guscrawford.com/json-xform";
import { parseVars } from "../util";
import { RegisteredCommand, CliApp, StaticOption, Command, StaticArgument } from "@guscrawford.com/cleye";
import { writeFile } from "fs";
import { join } from "path";
export class DefaultCommand implements Command {
    name = "default";
    options: {[key:string]:StaticOption} = {
        'out':<StaticOption>{
            spinalCaseName:'out',
            flag:'o'
        },
        'var':<StaticOption>{
            spinalCaseName:'var',
            flag:'V'
        }
    };
    args: {[key:string]:StaticArgument} = {
        'template':{
            name:'template'
        }
    };
    index:number = -1;
    registeredCommand:RegisteredCommand =  this.app.command(this);
    constructor(protected app:CliApp) {  }
}
export function parse(command:RegisteredCommand) { return  }
export function transform(command:RegisteredCommand) { return  };