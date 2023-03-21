const { jsonParse, jsonStringify } = require('@wzdong/utils')

test('jsonUtils', () => {
    const obj = { a: 1, b: NaN, c: -Infinity, d: Infinity };
    expect(jsonParse(jsonStringify(NaN))).toBe(NaN);
    expect(jsonParse(jsonStringify(Infinity))).toBe(Infinity);
    expect(jsonStringify(jsonParse(jsonStringify(obj)))).toBe(jsonStringify(obj));
});
