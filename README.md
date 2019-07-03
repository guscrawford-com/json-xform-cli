# 🔀 json-xform-cli 💻

## 📃 [Docs](./docs/html/index.html) | ❓ [Command Help](./HELP.md)

**@guscrawford.com/json-xform-cli** *JSON Transform*

Manipulate JSON files statically **on the command-line**

*See [json-xform](https://github.com/guscrawford-com/json-xform) node library*

----

## Off the Cuff Example

```
# Binary linked in %PATH%
$>yarn global add @guscrawford/json-xform-cli
```

*or*

```
# Binary referenceable by yarn or npm
$>yarn add @guscrawford/json-xform-cli -D
```

```
$>xform package.json --out dist/package.json
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
  "author": "Gus Crawford <crawford.gus@gmail.com>",
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
  "author": "Gus Crawford <crawford.gus@gmail.com>",
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

## Develop & Contribute

```
$>yarn install
$>yarn build
$>yarn test

$>yarn build:run default example/example2.json --out=example/example2b.json
```