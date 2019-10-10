
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>@guscrawford.com/json-xform-cli</title>
<meta name="description" content="">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="assets/css/main.css">
</head>
<body style="margin:24pt;">

# xform

## NAME

*default* - Transform **JSON** data from `stdin`, or as specified by ```[<template-file>]```

## SYNOPSIS

*```xform [<template-file>] [--extends=<json-file>] [--var=<name:value[,...]>] [--out=<output-file>]```*

## DESCRIPTION

Transform **JSON** data as specified by [json-xform](https://github.com/guscrawford-com/json-xform-cli/blob/master/README.md):

*JSON data* is the contents of  ```<template-file>``` if provided or the contents of `stdin` if ```<template-file>``` otherwise.

If ```--out=<output-file>``` was not provided; writes the output to `stdout`, otherwise overwrites/creates without prompt the file specified with transformed contents.


## OPTIONS

### ```-E=<json-file>```
### ```--extends=<json-file>```

Override or create the root `@xform:extends` property, in memory, on the parsed result of ```[<template-file>]``` or `stdin`, extending that result with the templated contents referenced with extends

```
echo {"test":"${example}"} | xform --vars=example:"Mic Check"
```

### ```-V=<name:value[,...]>```
### ```--var=<name:value[,...]>```

Override or create the root `@xform:var` graph, in memory, on the parsed result of ```[<template-file>]``` or `stdin`.

```
echo {"test":"${example}"} | xform --vars=example:"Mic Check"
```

### ```-o=<output-file>```
### ```--out=<output-file>```

Specify the filename to write transformed output to; `<stdout>` otherwise

If a supported output format can be inferred from a file-extension on the `--out` flag it will be used

- *.yml
- *.xml
- JSON is the default for any other extension

### ```-X=<output-format>```
### ```--xml=<output-format>```

Specify the format to write transformed output in

Supported output formats:

- `--format=yaml`
- `--format=xml`

## Examples

```
$> xform package.json --out dist/package.json
```

*where **package.json** is formed as so:*

```
{
  "@xform:remove": {
    "scripts": "scripts",
    "devDependencies": "devDependencies"
  },
  "@xform:merge": {
    "bin.xform": "bin/xform"
  },
  "name": "@guscrawford.com/json-xform-cli",
  "version": "0.1.0-beta",
  "description": "A cli that transforms JSON",
  "main": "xform-cli.ts",
  "repository": "https://github.com/guscrawford-com/json-xform-cli",
  "author": "Gus Crawford {crawford.gus@gmail.com}",
  "license": "MIT",
  "bin": {
    "xform": "dist/bin/xform-cli.js"
  },
  "devDependencies": {
    "@types/jasmine": "^3.3.13",
    "cpy-cli": "^2.0.0",
    "jasmine": "^3.4.0",
    "renamer": "^1.1.2",
    "rimraf": "^2.6.3",
    "typedoc": "^0.14.2",
    "typescript": "^3.5.2"
  },
  "scripts": {
    "binary": "cpy config/bin/xform dist/bin",
    "package": "yarn build && yarn test:run package.json --out dist/package.json && cpy README.md dist && cpy CHANGELOG.md dist && yarn binary",
    "docs": "rimraf docs && typedoc --out docs ./src",
    "build": "rimraf dist && tsc",
    "test": "tsc -p tsconfig.jasmine.json && jasmine \"test/**/*[sS]pec.js\"",
    "build:run": "yarn build && yarn test:run",
    "test:run": "node dist/lib/xform-cli.js",
    "release": "yarn package && cd dist && yarn publish --access=public"
  },
  "dependencies": {
    "@guscrawford.com/cleye": "^0.0.2-alpha",
    "@guscrawford.com/json-xform": "^0.1.0-beta"
  }
}

```

*output:*

```
{
  "name": "@guscrawford.com/json-xform-cli",
  "version": "0.1.0-beta",
  "description": "A cli that transforms JSON",
  "main": "xform-cli.ts",
  "repository": "https://github.com/guscrawford-com/cleye.git",
  "author": "Gus Crawford {crawford.gus@gmail.com}",
  "license": "MIT",
  "bin": {
    "xform": "bin/xform"
  },
  "dependencies": {
    "@guscrawford.com/cleye": "^0.0.2-alpha",
    "@guscrawford.com/json-xform": "^0.1.0-beta"
  }
}

```

## Notes

## SEE ALSO

[json-xform](https://www.npmjs.com/package/@guscrawford.com/json-xform)

</body>
</html>