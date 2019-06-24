
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { Templater } from '@guscrawford.com/json-xform';
import { CliApp, StaticOption } from '@guscrawford.com/cleye';
let app = new CliApp(process.argv);
let command = app.command({
    name:'default'
});
command.option(<StaticOption>{
        spinalCaseName:'out',
        flag:'o'
    }
).argument({
    name:'template'
})
//console.info(command);
readFile(join(process.cwd(),(command.args.template as any).value),{encoding:'utf8'},(err, data)=>{
    if (err) throw err;
    try {
        writeFile(
            join(process.cwd(),(command.options.out as any).value||(command.args.template as any).value), 
            JSON.stringify(new Templater(JSON.parse(data)).parse(), null, "  "),
            (err:any)=>{if (err)throw err}
        );
    } catch (e) {
        throw e;
    }
});