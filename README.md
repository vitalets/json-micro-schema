# JSON micro schema

Minimal JSON schema validation format.

## Motivation
Although [JSON Schema](https://json-schema.org/) is old and mature project
it looks too complex for simple JSON validation purpose.
This spec is a very simple format for the most common cases.

## Contents

<!-- toc -->

- [Principles](#principles)
- [Example](#example)
- [Validators](#validators)
  * [$type](#type)
  * [$required](#required)
  * [$maxLength](#maxlength)
  * [$minLength](#minlength)
  * [$values](#values)
  * [$unknownKeys](#unknownkeys)
  * [$item](#item)
  * [$defaults](#defaults)
- [Shortcuts](#shortcuts)
  * [Primitives](#primitives)
  * [Arrays](#arrays)
- [Custom validators](#custom-validators)
- [Implementations](#implementations)
  * [JavaScript](#javascript)
- [License](#license)

<!-- tocstop -->

## Principles
* All keywords started with `$`.
* Built-in validators cover most common cases.
* Custom validators can be easily added.
* No code-generation.

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

Validation errors:
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

### $type
* `string` Validates type of value. Can be one of:
  * `"string"`
  * `"number"`
  * `"boolean"`
  * `"array"`

Example of schema:
```json
{
  "productName": {
    "$type": "string"
  }
}
```

Valid object:
```json
{
  "productName": "iphone 11"
}
```

Invalid object:
```json
{
  "productName": 42
}
```

Validation error:
```json
{
  "validator": "$type",
  "path": "productName",
  "expectedType": "string",
  "actualType": "number"
}
```

### $required
* `boolean` Validates that property exists and not `null|undefined`.

Example of schema:
```json
{
  "productName": {
    "$required": true
  }
}
```

Valid object:
```json
{
  "productName": "iphone 11"
}
```

Invalid object:
```json
{
  "productName": null
}
```

Validation error:
```json
{
  "validator": "$required",
  "path": "productName"
}
```

### $maxLength
* `number` Validates that property has length less or equal provided value.
  Applied to `string` or `array`.

Example of schema:
```json
{
  "productName": {
    "$type": "string",
    "$maxLength": 10
  }
}
```

Valid object:
```json
{
  "productName": "iphone 11"
}
```

Invalid object:
```json
{
  "productName": "very long product name"
}
```

Validation error:
```json
{
  "validator": "$maxLength",
  "path": "productName",
  "maxLength": 10,
  "length": 22
}
```

### $minLength
* `number` Validates that property has length more or equal provided value.
  Applied to `string` or `array`.

Example of schema:
```json
{
  "productName": {
    "$type": "string",
    "$minLength": 2
  }
}
```

Valid object:
```json
{
  "productName": "iphone 11"
}
```

Invalid object:
```json
{
  "productName": "a"
}
```

Validation error:
```json
{
  "validator": "$minLength",
  "path": "productName",
  "minLength": 2,
  "length": 1
}
```

### $values
* `array` Validates that property has one of provided values.

Example of schema:
```json
{
  "productName": {
    "$type": "string",
    "$values": ["iphone", "android"]
  }
}
```

Valid object:
```json
{
  "productName": "iphone"
}
```

Invalid object:
```json
{
  "productName": "ipad"
}
```

Validation error:
```json
{
  "validator": "$values",
  "path": "productName",
  "values": ["iphone", "android"],
  "value": "ipad"
}
```

### $unknownKeys
* `boolean` Allows object to have keys not declared in schema.

Example of schema:
```json
{
  "product": {
    "$unknownKeys": false,
    "name": {
      "$type": "string"
    }
  }
}
```

Valid object:
```json
{
  "product": {
     "name": "iphone"
  }
}
```

Invalid object:
```json
{
  "product": {
     "name": "iphone",
     "model": "iphone 11"
  }
}
```

Validation error:
```json
{
  "validator": "$unknownKeys",
  "path": "product.model"
}
```

### $item
* `object` Declares schema for array items. Applied only to `$type: "array"`.

Example of schema:
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

Valid object:
```json
{
  "tags": [ "mobile", "phone" ]
}
```

Invalid object:
```json
{
  "tags": [ 42 ]
}
```

Validation error:
```json
{
  "validator": "$type",
  "path": "tags.0",
  "expectedType": "string",
  "actualType": "number"
}
```

### $defaults
* `object` Declares schema that will be merged to current and all nested schemas.

Example of schema:
```json
{
  "$defaults": {
    "$required": true
  },
  "productId": {
    "$type": "number"
  },
  "productName": {
    "$type": "string"
  }
}
```

Valid object:
```json
{
  "productId": 1,
  "productName": "iphone 11"
}
```

Invalid object:
```json
{
  "foo": "bar"
}
```

Validation errors:
```json
[
  {
    "validator": "$required",
    "path": "productId"
  },
  {
    "validator": "$required",
    "path": "productName"
  }
]
```

## Shortcuts
### Primitives
You can declare any prop as just a value:
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
You can declare any custom validators for your needs.
The only rule is that it should start with `$` and don't conflict with built-in validators.
Example of custom `$myRegexpValidator`:
```json
{
  "productId": {
    "$type": "string",
    "$myRegexpValidator": "[a-z0-9]+"
  }
}
```
Technical implementation of custom validator depends on library and programming language you are using.

## Implementations

### JavaScript
  * [@vitalets/micro-schema](https://github.com/vitalets/micro-schema)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
