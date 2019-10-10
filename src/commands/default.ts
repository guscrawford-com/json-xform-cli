import { readFile, writeFile } from 'fs';
import { Templater } from "@guscrawford.com/json-xform";
import { read, parseVars, stripComments } from '../util';
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
        'format':<StaticOption>{
            spinalCaseName:'format',
            flag:'F'
        },
        'comments':<StaticOption>{
            spinalCaseName:'comments',
            flag:'C'
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
    let fileArg:string, relPath:string[], workingDirectory:string;
    fileArg = join(process.cwd(),((app.commands.default as Command).args.template as any).value);
    relPath = fileArg.split(/\/|\\/);
    relPath.pop();
    if (!fileArg.match(/^\/|([a-zA-Z]\:)?\\/)) 
        workingDirectory = join(process.cwd(),relPath.join('/'));
    else workingDirectory = relPath.join('/');
    if (((app.commands.default as Command).args.template as any).value)
        readFile(
            join(process.cwd(),((app.commands.default as Command).args.template as any).value),
            {encoding:'utf8'},
            transform(app.commands.default as RegisteredCommand, workingDirectory)
        );
    else if (!((app.commands.default as Command).args.template as any).value)
        read(process.stdin, transform(app.commands.default as RegisteredCommand, workingDirectory));
}
const templateWithVars = (data:string, varOption:Option) => parseVars(
    JSON.parse(data),
    varOption.value as string
);
function transform(command:RegisteredCommand, workingDirectory:string) { return (err:any, data:string) => {
    if (err) throw err;
    let allowComments = !command.options.comments || command.options.comments && (command.options.comments as any).value !== 'false';
    if (allowComments) data = stripComments(data);
    try {
        let parsedData = parse(command, workingDirectory)(data);
        let yaml = command.options.format.value && (command.options.format as any).value.match(/ya?ml/i) || ((command.options.out as any).value && ((command.options.out as any).value as string).endsWith('.yml'));
        let xml = command.options.format.value && (command.options.format as any).value.match(/xml/i) || ((command.options.out as any).value && ((command.options.out as any).value as string).endsWith('.xml'));
        
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
function parse(command:RegisteredCommand, workingDirectory:string) {
    return (data:string)=> {
        var template = (command.options.extends as any).value
           ? Object.assign(templateWithVars(data, command.options.var as Option), {"@xform:extends":(command.options.extends as any).value})
           : templateWithVars(data, command.options.var as Option);
        var templater = new Templater(template,undefined,workingDirectory);
        var parsedTemplate = templater.parse();
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