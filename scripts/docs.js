/**
 * Helper script for README snippets.
 * Usage: node scripts/docs
 */

const { validate } = require('..');

const schema = {
  productId: {
    $type: 'number',
    $required: true
  },
  productName: {
    $type: 'string',
    $required: true,
    $maxLength: 255
  },
  tags: [{
    $type: 'string'
  }]
};

const validObject = {
  productId: 1,
  productName: 'iphone 11',
  tags: ['mobile', 'phone']
};

const invalidObject = {
  productId: '1',
  productName: null,
  tags: [42]
};

console.log(JSON.stringify(schema, null, 2));

const errors = validate(schema, invalidObject);

console.log(JSON.stringify(validObject, null, 2));
console.log(JSON.stringify(invalidObject, null, 2));
console.log(JSON.stringify(errors, null, 2));
