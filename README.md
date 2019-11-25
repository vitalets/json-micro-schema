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
    + [primitive](#primitive)
    + [array](#array)
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
#### primitive
#### array

## Custom validators

## Implementations
* Javascript
  * [@vitalets/micro-schema](https://github.com/vitalets/micro-schema)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
