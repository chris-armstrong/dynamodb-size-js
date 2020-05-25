const globalVar = new Function('return this')(); // eslint-disable-line no-new-func
const HAS_BUFFER = typeof globalVar.Buffer === 'function';
const HAS_BLOB = typeof globalVar.Blob === 'function';
const HAS_ARRAY_BUFFER = typeof globalVar.ArrayBuffer === 'function';
const HAS_DATA_VIEW = typeof globalVar.DataView === 'function';
const HAS_TYPED_ARRAY = typeof globalVar.Int8Array === 'function';

// Overhead of an list item or map key-value pair (undocumented)
const NESTED_ITEM_OVERHEAD = 1;
// Overhead of a map or list object
const COMPOSITE_ITEM_OVERHEAD = 3;

const TypedArrayTypes = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
];

const isObject = x => typeof x === 'object' && x !== null && !Array.isArray(x) && x.wrapperName !== 'Set';
const isArray = x => Array.isArray(x);
const isNumber = x => typeof x === 'number';
const isString = x => typeof x === 'string';
const isBoolean = x => typeof x === 'boolean';
const isNull = x => x === null;
const isSet = x => typeof x === 'object' && x !== null && x.wrapperName === 'Set';
const isBinary = x => {
  if (typeof x === 'object' && x !== null) {
    if (HAS_BUFFER && Buffer.isBuffer(x)) return true;
    if (HAS_BLOB && x.constructor.name === 'Blob') return true;
    if (HAS_ARRAY_BUFFER && x.constructor.name === 'ArrayBuffer') return true;
    if (HAS_DATA_VIEW && x.constructor.name === 'DataView') return true;
    if (HAS_TYPED_ARRAY && TypedArrayTypes.includes(x.constructor.name)) return true;
  }
  return false;
};

const calculateObject = x => {
  let size = COMPOSITE_ITEM_OVERHEAD;
  for (const key in x) {
    if (!Object.hasOwnProperty(x, key)) continue;
    const val = x[key];
    const keySize = calculateString(key);
    const valSize = calculateUnknown(val);
    size += keySize + valSize + NESTED_ITEM_OVERHEAD;
  }
  return size;
};

const calculateArray = x => {
  return x.reduce((size, nextItem) => size + calculateUnknown(nextItem) + NESTED_ITEM_OVERHEAD, COMPOSITE_ITEM_OVERHEAD);
};

const calculateString = x => {
  if (HAS_BUFFER) {
    return Buffer.byteLength(x, 'utf8');
  } else {
    return new Blob([x]).size;
  }
};

const calculateBoolean = () => 1;
const log10 = Math.log(10);
const calculateSignificantDigits = x => {
  let n = Math.abs(String(x).replace('.', ''));
  if (n === 0) return 0;
  while (n !== 0 && n % 10 === 0) {
    n /= 10;
  }
  return Math.floor(Math.log(n) / log10) + 1;
};
const calculateNumber = x => Math.ceil(calculateSignificantDigits(x) / 2) + (x >= 0 ? 1 : 2);
const calculateNull = () => 1;
const calculateSet = x => {
  let calculator;
  switch (x.type) {
    case 'String':
      calculator = calculateString;
      break;
    case 'Number':
    case 'NumberValue':
      calculator = calculateNumber;
      break;
    case 'Binary':
      calculator = calculateBinary;
      break;
    default: throw new Error('unknown set type ' + x.type);
  }

  return x.values.reduce((total, nextItem) => total + calculator(nextItem), 0);
};

const calculateBinary = x => {
  if (HAS_BUFFER && Buffer.isBuffer(x)) return x.length;
  if (HAS_BLOB && (x.constructor.name === 'Blob' || x.constructor.name === 'File')) return x.size;
  if (HAS_ARRAY_BUFFER && x.constructor.name === 'ArrayBuffer') return x.byteLength;
  if (HAS_DATA_VIEW && x.constructor.name === 'DataView') return x.byteLength;
  if (HAS_TYPED_ARRAY && TypedArrayTypes.includes(x.constructor.name)) return x.byteLength;
  return 0;
};

const calculateUnknown = x => {
  if (isArray(x)) {
    return calculateArray(x);
  } else if (isObject(x)) {
    return calculateObject(x);
  } else if (isString(x)) {
    return calculateString(x);
  } else if (isNumber(x)) {
    return calculateNumber(x);
  } else if (isBoolean(x)) {
    return calculateBoolean(x);
  } else if (isBinary(x)) {
    return calculateBinary(x);
  } else if (isNull(x)) {
    return calculateNull(x);
  } else if (isSet(x)) {
    return calculateSet(x);
  }
  return 0;
};

module.exports = function calculateDocumentSize (doc) {
  if (!isObject(doc)) {
    throw new Error('Expected an object for document');
  }

  let size = 0;
  for (const key in doc) {
    const val = doc[key];
    const keySize = calculateUnknown(key);
    const valSize = calculateUnknown(val);
    size += keySize + valSize;
  }
  return size;
};

Object.assign(module.exports, {
  calculateString,
  calculateUnknown,
  calculateSet,
  calculateNull,
  calculateBinary,
  calculateNumber,
  calculateBoolean,
  calculateObject,
  calculateArray,
});
