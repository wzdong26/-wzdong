/**
 * @title typeOf
 * @description 基于 Object.prototype.toString.call 实现的类型检查
 * @author wzdong
 */

const typeOf = (val: unknown) => Object.prototype.toString.call(val).slice(8, -1);

typeOf.isNull = (val: unknown): val is null => typeOf(val) === 'Null';
typeOf.isUndefined = (val: unknown): val is undefined => typeOf(val) === 'Undefined';
typeOf.isString = (val: unknown): val is string => typeOf(val) === 'String';
typeOf.isBoolean = (val: unknown): val is boolean => typeOf(val) === 'Boolean';
typeOf.isNumber = (val: unknown): val is number => typeOf(val) === 'Number';
typeOf.isBigInt = (val: unknown): val is bigint => typeOf(val) === 'BigInt';
typeOf.isSymbol = (val: unknown): val is symbol => typeOf(val) === 'Symbol';
typeOf.isObject = (val: unknown): val is Exclude<NonNullable<Object>, Array<unknown>> => typeOf(val) === 'Object';
typeOf.isArray = (val: unknown): val is Array<unknown> => typeOf(val) === 'Array';
typeOf.isFunction = (val: unknown): val is Function => typeOf(val) === 'Function';

export default typeOf;
