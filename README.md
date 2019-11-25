# JSON micro schema

Minimal JSON schema validation format.

## Contents

<!-- toc -->

- [Motivation](#motivation)
- [Example](#example)
- [Validators](#validators)
    + [$type](#type)
    + [$required](#required)
    + [$maxLength](#maxlength)
    + [$minLength](#minlength)
    + [$values](#values)
    + [$unknownKeys](#unknownkeys)
    + [$item](#item)
- [Shortcuts](#shortcuts)
  * [Primitives](#primitives)
  * [Arrays](#arrays)
- [Custom validators](#custom-validators)
- [Implementations](#implementations)
- [License](#license)

<!-- tocstop -->

## Motivation
Although [JSON Schema](https://json-schema.org/) is old and mature project
I found it too complex and verbose for simple JSON validation. 
Instead, I tried to create a very simple format for the most common cases.

## Example
Schema:
```json
{
  "productId": {
    "$type": "number",
    "$required": true
  },
  "productName": {
    "$type": "string",
    "$required": true,
    "$maxLength": 255
  },
  "tags": [{
      "$type": "string"
  }]
}
```
Valid object:
```json
{
  "productId": 1,
  "productName": "iphone 11",
  "tags": [ "mobile", "phone" ]
}
```

Invalid object:
```json
{
  "productId": "1",
  "productName": null,
  "tags": [ 42 ]
}
```

Validation output:
```json
[
  {
    "validator": "$type",
    "path": "productId",
    "expectedType": "number",
    "actualType": "string"
  },
  {
    "validator": "$required",
    "path": "productName"
  },
  {
    "validator": "$type",
    "path": "tags.0",
    "expectedType": "string",
    "actualType": "number"
  }
]
```

## Validators
tbd.

#### $type
#### $required
#### $maxLength
#### $minLength
#### $values
#### $unknownKeys
#### $item

## Shortcuts
### Primitives
You can define any prop as just value:
```json
{
  "productType": "phone"
}
```
It is automatically expanded to following schema:
```json
{
  "productType": {
    "$type": "string",
    "$required": true,
    "$values": ["phone"]
  }
}
```

### Arrays
Two ways to define array props:
1. full syntax using `$item` validator:
    ```json
    {
      "tags": {
        "$type": "array",
        "$item": {
          "$type": "string"
        }
      }
    }
    ```
2. shortcut syntax using `[]` with single element:
    ```json
    {
      "tags": [{
        "$type": "string"
      }]
    }
    ```

Both variants are identical.

## Custom validators
You can define any custom validators for your needs.
The only rule is that it should start with `$` and don't conflict with built-in validators.
Example of custom `$regexp` validator:
```json
{
  "productId": {
    "$type": "string",
    "$regexp": "[a-z0-9]+"
  }
}
```

## Implementations
* Javascript
  * [@vitalets/micro-schema](https://github.com/vitalets/micro-schema)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
