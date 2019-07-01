
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { Templater } from '@guscrawford.com/json-xform';
import { CliApp, StaticOption } from '@guscrawford.com/cleye';
import { Stream } from 'stream';
import { DefaultCommand } from './commands';
import { read, parseVars } from './util';
const open = require('open');
let app = new CliApp(process.argv);
let help = app.command({
    name:'help'
});
let command = new DefaultCommand(app).registeredCommand;
const parse = (data:string)=>JSON.stringify(
    new Templater(
        parseVars(
            JSON.parse(data),
            (command.options.var as any).value
        )
    ).parse(),
    null,
    "  "
);
const transform = (err:any, data:string)=>{
    if (err) throw err;
    try {
        let parsedData = parse(data);
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
}
if (help.index !== -1) {
    let helpPath = app.binRuntime.split(/\/|\\/);
        open(join(`${helpPath.slice(0, helpPath.length-2).join('/')}/docs/html/HELP.html`));
}
else if ((command.args.template as any).value)
    readFile(join(process.cwd(),(command.args.template as any).value),{encoding:'utf8'},transform);
else if (!(command.args.template as any).value)
    read(process.stdin, transform);