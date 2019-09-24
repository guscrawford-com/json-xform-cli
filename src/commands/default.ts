import { readFile, writeFile } from 'fs';
import { Templater } from "@guscrawford.com/json-xform";
import { read, parseVars } from '../util';
import { RegisteredCommand, CliApp, StaticOption, Command, StaticArgument } from "@guscrawford.com/cleye";
import { join } from "path";
import { CliAppInstance } from "../xform-cli";
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
        },
        'extends':<StaticOption>{
            spinalCaseName:'extends',
            flag:'E'
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
export const RegisteredDefaultCommand = new DefaultCommand(CliAppInstance).registeredCommand;

if ((RegisteredDefaultCommand.args.template as any).value)
    readFile(join(process.cwd(),(RegisteredDefaultCommand.args.template as any).value),{encoding:'utf8'},transform(RegisteredDefaultCommand));
else if (!(RegisteredDefaultCommand.args.template as any).value)
    read(process.stdin, transform(RegisteredDefaultCommand));

const templateWithVars = (data:string) => parseVars(
    JSON.parse(data),
    (RegisteredDefaultCommand.options.var as any).value
);
export function transform(command:RegisteredCommand) { return (err:any, data:string) => {
    if (err) throw err;
    try {
        let parsedData = parse(command)(data);
        if (!(command.options.out as any).value)
            process.stdout.write(Buffer.from(parsedData+"\n\r"));
        else
            writeFile(
                join(process.cwd(),(command.options.out as any).value||(command.args.template as any).value), 
                parsedData,
                (err:any)=>{if (err)throw err}
            );
    } catch (e) {
        throw e;
    }
}; }
export function parse(command:RegisteredCommand) {
    return (data:string)=> {
        // console.error(new Templater({"@xform:extends":'example/sample.json'}).parse())
        var template = (command.options.extends as any).value
           ? Object.assign(templateWithVars(data), {"@xform:extends":(command.options.extends as any).value})
           : templateWithVars(data);
        // console.error(template);
        var templater = new Templater(template);
        var parsedTemplate = templater.parse();
        // console.error(templater);
        return JSON.stringify(
            parsedTemplate,
            null,
            "  "
        );
    }
}