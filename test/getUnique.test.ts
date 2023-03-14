const { getUnique, getSingle } = require('@wzdong/utils');

test('getUnique', () => {
    let j = 0;
    const fn = (i) => {
        j++;
        return i;
    };
    const uniFn1 = getSingle(fn, 1);
    const uniFn2 = getSingle(fn);
    expect(uniFn1(1)).toBe(1);
    expect(uniFn1()).toBe(1);
    expect(uniFn1(2)).toBe(2);
    expect(uniFn2(3)).toBe(3);
    expect(uniFn2()).toBe(3);
    expect(uniFn2(4)).toBe(3);
});
