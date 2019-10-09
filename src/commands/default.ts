import { readFile, writeFile } from 'fs';
import { Templater } from "@guscrawford.com/json-xform";
import { read, parseVars } from '../util';
import { RegisteredCommand, CliApp, StaticOption, Command, StaticArgument, StaticCommand, Option } from "@guscrawford.com/cleye";
import { join } from "path";
import { default as fromJson } from 'jsontoxml';
const jsonYml = require('json2yaml');
export class DefaultCommand implements StaticCommand {
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
        },
        'remove':<StaticOption>{
            spinalCaseName:'remove',
            flag:'R'
        },
        'xml':<StaticOption>{
            spinalCaseName:'xml',
            flag:'X'
        },
        'yml':<StaticOption>{
            spinalCaseName:'ynl',
            flag:'Y'
        }
    };
    args: {[key:string]:StaticArgument} = {
        'template':{
            name:'template'
        }
    };
    run = main_default;
}
function main_default(app:CliApp) {
    console.info(app);
    if (((app.commands.default as Command).args.template as any).value)
        readFile(join(process.cwd(),((app.commands.default as Command).args.template as any).value),{encoding:'utf8'},transform(app.commands.default as RegisteredCommand));
    else if (!((app.commands.default as Command).args.template as any).value)
        read(process.stdin, transform(app.commands.default as RegisteredCommand));
}
const templateWithVars = (data:string, varOption:Option) => parseVars(
    JSON.parse(data),
    varOption.value as string
);
function transform(command:RegisteredCommand) { return (err:any, data:string) => {
    if (err) throw err;
    try {
        let parsedData = parse(command)(data);
        let yaml = command.options.yml && typeof (command.options.yml as any).value !== null || ((command.options.out as any).value && ((command.options.out as any).value as string).endsWith('.yml'));
        let xml = command.options.xml && typeof (command.options.xml as any).value !== null || ((command.options.out as any).value && ((command.options.out as any).value as string).endsWith('.xml'));
        if (xml) parsedData = fromJson(parsedData, {removeIllegalNameCharacters:true});
        else if (yaml) parsedData = jsonYml.stringify(parsedData);
        else parsedData = asString(parsedData);
        if (!(command.options.out as any).value)
            process.stdout.write(Buffer.from(parsedData)+"\n");
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
function parse(command:RegisteredCommand) {
    return (data:string)=> {
        // console.error(new Templater({"@xform:extends":'example/sample.json'}).parse())
        var template = (command.options.extends as any).value
           ? Object.assign(templateWithVars(data, command.options.var as Option), {"@xform:extends":(command.options.extends as any).value})
           : templateWithVars(data, command.options.var as Option);
        // console.error(template);
        var templater = new Templater(template);
        var parsedTemplate = templater.parse();
        // console.error(templater);
        return parsedTemplate;
    }
}
function asString(parsedTemplate:any) {
    return JSON.stringify(
        parsedTemplate,
        null,
        "  "
    );
}