const {
  calculateString,
  calculateUnknown,
  calculateSet,
  calculateNull,
  calculateBinary,
  calculateNumber,
  calculateBoolean,
  calculateObject,
  calculateArray,

} = require('./index');
describe('calculateString', () => {
  test('with empty string', () => expect(calculateString('')).toEqual(0));
  test('with plain string', () => expect(calculateString('abcdefgh1234')).toEqual(12));
  test('with emoji characters', () => expect(calculateString('ofc\u1f600')).toEqual(7));
});
