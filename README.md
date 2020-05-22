# dynamodb-size

A DynamoDB size calculator, based on [this article](https://medium.com/@zaccharles/calculating-a-dynamodb-items-size-and-consumed-capacity-d1728942eb7c)

Works on your objects before DynamoDB object-structure conversion (i.e. those you'd pass to the `DocumentClient` interface, not the `DynamoDB` interface`).

*No guarantees that this is accurate, correct, complete or fully tested - it should only be used for estimations.*

## Installation

```sh
npm install dynamodb-size
```

## Usage

```javascript
const calculateDynamoDBSize = require('dynamodb-size');

const myObject = {
  aString: {
    value1: 134,
    test: false,
  },
};

const sizeOfMyObject = calculateDynamoDBSize(myObject);
```

## License

Copyright 2020 Chris Armstrong

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
