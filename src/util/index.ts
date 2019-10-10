import { Stream } from "stream";

export const KEY = 0, VAL = 1;
export function parseVars(targetJson:any, vars:string, directive:string="@xform:var") {
    if (!vars) return targetJson;
    let varExtension:{[key:string]:any} = {};
    vars.split(',').forEach(variableDef=>{
        let kvp = variableDef.split(':');
        varExtension[kvp[KEY] as string] = infer(kvp[VAL]);
    });
    targetJson[directive] = {...targetJson[directive],...varExtension};
    return targetJson;
}

export function infer(value:string):any {
    if (isNaN(value as any) || isNaN(parseFloat(value))) {
        switch (value) {
            case "true":return true;
            case "false":return false;
            default: return value;
        }
    }
    else return parseFloat(value);
}

// https://stackoverflow.com/a/54565854
export async function read(stream:Stream, cb?:(err:Error|null, data:string)=>any) {
    try {
        let buffer = Buffer.alloc(0);
        stream.on('data', (chunk)=>
            buffer = Buffer.concat([buffer, chunk]));
        let result;
        stream.on('end', ()=>{
            
            if (typeof cb === 'function') result = cb(null, buffer.toString('utf8'));
            result = buffer.toString('utf8');
            return result;
        });
        stream.on('close', (x)=>
            x);
        stream.on('error', (e)=>
            result = Promise.reject(typeof cb === 'function'?cb(e,''):e));
        return result;
    }
    catch (e) {
        if (typeof cb === 'function') return Promise.reject(cb(e,''));
    }
}
// https://regex101.com/r/B8WkuX/1
export function stripComments(src:string) {
    return src.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,'');
}