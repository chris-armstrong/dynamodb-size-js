const { calculateString } = require("./index");
const calculateDocumentSize = require("./index");

describe("calculateString", () => {
  test("with empty string", () => expect(calculateString("")).toEqual(0));
  test("with plain string", () =>
    expect(calculateString("abcdefgh1234")).toEqual(12));
  test("with emoji characters", () =>
    expect(calculateString("ofc\u1f600")).toEqual(7));
});

describe("calculateDocumentSize", () => {
  describe("calculates buffers", () => {
    it("with the expected size", () => {
      expect(
        calculateDocumentSize({
          data: Buffer.from("lorem ipsum dolor sit amet"),
        }),
      ).toEqual(30);
    });
  });
});
