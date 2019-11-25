# JSON micro schema

Minimal JSON schema validation format.

## Motivation
Although [JSON Schema](https://json-schema.org/) is old and mature project
This spec is a very simple format for the most common cases.

## Contents

<!-- toc -->

- [Principles](#principles)
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
  * [JavaScript](#javascript)
- [License](#license)

<!-- tocstop -->

## Principles
* JSON micro schema is a normal JSON object with validation keywords started with `$`.
* Built-in list of validators is minimal and covers the most common cases.
  For other tasks custom validators should be used.
* Validation process returns array of errors.
  Each error contains validator name and dot-path to invalid object property.
  Empty array means validation is ok.

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
You can define any prop as just a value:
```json
{
  "productType": "phone"
}
```
It is automatically expanded to the following schema:
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
Arrays can be declared in two ways:
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
Example of custom `$myRegexpValidator` validator:
```json
{
  "productId": {
    "$type": "string",
    "$myRegexpValidator": "[a-z0-9]+"
  }
}
```
Particular steps of adding validator depend on implementation library for your programming language.

## Implementations

### JavaScript
  * [@vitalets/micro-schema](https://github.com/vitalets/micro-schema)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
