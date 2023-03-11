const { deepCopy } = require('@wzdong/utils');

test('deepCopy', () => {
    const proto = { prototypeP1: 1, val: 1 };
    const obj = Object.create(proto);
    const symbolKey = Symbol();
    Object.assign(obj, {
        val: 2,
        unEnumVal: 3,
        [symbolKey]: { a: 1, parent: obj },
        fn() {
            return this;
        },
        map: new Map([
            [1, 'a'],
            [2, obj],
        ]),
        nu: null,
    });
    Object.defineProperty(obj, 'unEnumVal', {
        enumerable: false,
    });

    const copied = deepCopy(obj);
    console.log(copied)

    const fn = (i) => i;
    const copiedFn = deepCopy(fn);

    const copiedNum = deepCopy('aa');

    expect(copied === obj).toBe(false);
    expect(Object.getPrototypeOf(copied)).toBe(proto);
    expect(copied[symbolKey] === obj[symbolKey]).toBe(false);
    expect(copied[symbolKey].parent).toBe(copied);
    expect(copied.fn === obj.fn).toBe(false);
    expect(copied.fn()).toBe(copied);
    expect(obj.map === copied.map).toBe(false);
    expect(copied.map.get(2)).toBe(copied);

    expect(copiedFn === fn).toBe(false);
    expect(copiedFn(1)).toBe(1);

    expect(copiedNum).toBe('aa');
});
