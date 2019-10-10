# 🔀 json-xform-cli 💻

## 📃 [Docs](./docs/html/index.html) | ❓ [Command Hel:user-test](./HELP.md)

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

## Examples

### Variable Replacement

Use `@xform:var` to define blocks of variables you can scope; use interpolation syntax like `${<variable-reference>}`, and filters like `${filter(<variable-reference>)}` to manipulate data:

*`@{<ref>}` suppresses auto-inference (forcing the `number-a` example property to be a string interpretation), use `number` filter to force string values to numerics.*

🎯 ***Only** top-level `@xform:var` blocks are parsed or refered to

**Input**

```
{
  "@xform:var":{
    "something":"this",
    "number-lit":55,
    "number-str":"65"
  },
  "do": "${something}",
  "number-a":"@{number-lit}",
  "number-b":"${number(number-str)}"
}
```

**Output**

```
{
  "do": "this",
  "number-a":"55",
  "number-b":65
}
```

### Sorting

Sort your JSON

**Input**

```
{
  "@xform:sort":{
    "values":"desc",
    "moreValues":"id asc"
  },
  "values": [3,1,5],
  "moreValues":[
    { "id": 7, "name":"Crawford"},
    { "id": 3, "name":"Malcolm"},
    { "id": 2, "name":"Angus"}
  ]
}
```

**Output**

```
{
  "values": [5,3,1],
  "moreValues":[
    { "id": 2, "name":"Angus"},
    { "id": 3, "name":"Malcolm"},
    { "id": 7, "name":"Crawford"}
  ]
}
```

### Deep Merging

Merge deep; masking structures on to others.

**Input**

```
{
  "@xform:merge":{
    "compilerOptions":{
      "paths":{
        "@org/package":[
          "org-package/src"
        ]
      }
    }
  },
  "compilerOptions":{
    "target":"es5"
  }
}
```

**Output**

```
{
  "compilerOptions":{
    "target":"es5",
    "paths":{
      "@org/package":[
        "org-package/src"
      ]
    }
  }
}
```

### Removal

Remove items from JSON

**Input**

```
{
  "@xform:remove":{
    "scripts":{
      "this-script"
    },
    "scripts.this-also"
  },
  "scripts":{
    "this-script":"needs to go",
    "this-also":"needs to go"
  }
}
```

**Output**

```
{
  "scripts":{}
}
```

### Conditionals

Use inline "filters" like `if(<js-like-falsy-truthy-conditional>,<resolve-true>,<resolve-falsy>)` and `gt(<ref-a>,<ref-b>`) to produce conditionally built JSON.

*See other filters `lt`, `gte`, `lte`, `not`, `number` for further filtering references...*

**Input**

```
{
  "@xform:var":{
    "production":true,
    "development":false,
    "build-prod":"ng build --prod",
    "build-dev":"ng build"
  },
  "scripts":{
    "build":"${if(gt(production,development),build-prod,build-dev)}"
  }
}
```

**Output**

```
{
  "scripts":{"build":"ng build --prod"}
}
```


### Iterating

Use the `@xform:foreach(<iterable-var-reference>)` directive to repeat portions of JSON.

*Where the value of each item in the iterable is referencable by `item`; each numerical index if available is `index` and `key` is always the key or stringified index*

**Input**

```
{
  "@xform:var":{
    "sub-apps":["ui","backend","etc"]
  },
  "scripts":{
    "@xform:foreach(sub-apps)":{
      "test-${item}":"jasmine ${item}",
      "build-${item}":"tsc -p ${item}.tsconfig.json",
      "lint-${item}":"cd ${item} && npm run lint"
    }
  }
}
```

**Output**

```
{
  "scripts":{
    "test-ui":"jasmine ui",
    "build-ui":"tsc -p ui.tsconfig.json",
    "lint-ui":"cd ui && npm run lint",
    "test-backend":"jasmine backend",
    "build-backend":"tsc -p backend.tsconfig.json",
    "lint-backend":"cd backend && npm run lint",
    ...
  }
}
```

### Importing & Extending

Use `@xform:import` and `@xform:extends` to reference an external JSON file and deep-merge output on to it.

* Only `@xform:extends` has a *CLI* switch
*`@xform:extends` opens an external JSON file and parses it, which could include **json-xform** directives.*
*`@xform:import` does likewise; however with the added step of deep-merging top-level variable declarations (`@xform:var`) onto the imported document before parsing*

**Input**

```


  {
    "@xform:import":"./external.json",
    "@xform:var":{
      "needed-var":"some-value"
    },
    "scripts":{
      "run":"command"
    }
  }
```

**external.json**

```
{
  "value":"${needed-var}"
}
```

**Output**

```
{
  "value":"some-value",
  "scripts":{
    "run":"command"
  }
}

## Develop & Contribute

```
$>yarn install
$>yarn build
$>yarn test

$>yarn build:user-test default example/example2.json --out=example/example2b.json
```