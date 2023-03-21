const { typeOf } = require('@wzdong/utils');

test('typeOf', () => {
    expect(typeOf(null)).toBe('Null');
    expect(typeOf(undefined)).toBe('Undefined');
    expect(typeOf(new String())).toBe('String');
    expect(typeOf(!!'')).toBe('Boolean');
    expect(typeOf(1)).toBe('Number');
    expect(typeOf(1n)).toBe('BigInt');
    expect(typeOf(Symbol())).toBe('Symbol');
    expect(typeOf({})).toBe('Object');
    expect(typeOf([])).toBe('Array');
    expect(typeOf(() => {})).toBe('Function');

    expect(typeOf.isNull(null)).toBe(true);
    expect(typeOf.isUndefined(undefined)).toBe(true);
    expect(typeOf.isString('null')).toBe(true);
    expect(typeOf.isBoolean(!!'')).toBe(true);
    expect(typeOf.isNumber(NaN)).toBe(true);
    expect(typeOf.isBigInt(1n)).toBe(true);
    expect(typeOf.isSymbol(Symbol())).toBe(true);
    expect(typeOf.isObject({})).toBe(true);
    expect(typeOf.isArray(new Array())).toBe(true);
    expect(typeOf.isFunction(() => {})).toBe(true);
});
