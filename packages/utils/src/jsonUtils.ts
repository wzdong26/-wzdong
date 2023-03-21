/**
 * @title jsonUtils
 * @description 基于 JSON.stringify \ JSON.parse 实现的简易 jsonStringify \ jsonParse
 * @description 解决 NaN 、 Infinity 和 -Infinity 不支持的问题
 * @author wzdong
 */

// JSON.stringify 问题：
// 对象中有时间类型的时候，序列化之后会变成字符串类型。
// 对象中有 undefined 和 Function 类型以及 symbol 值数据的时候，序列化之后会直接丢失。
// 对象中有 NaN 、 Infinity 和 -Infinity 的时候，序列化之后会显示 null 。
// 对象循环引用的时候，会直接报错。

export const jsonStringify = (value: any): string =>
    JSON.stringify(value, (_, val) => {
        if (typeof val === 'number' && (Number.isNaN(val) || !Number.isFinite(val))) return `${val}`;
        return val;
    });

export const jsonParse = (text: string): any =>
    JSON.parse(text, (_, val) => {
        if (['NaN', '-Infinity', 'Infinity'].includes(val)) return parseFloat(val);
        return val;
    });
