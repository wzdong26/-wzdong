/**
 * @title deepCopy
 * @description 对象深拷贝
 * @author wzdong
 */

// 拷贝常规对象、数组(不包含Function、Map、Set)
const deepCopySimplify = (obj: unknown, visited = new WeakMap()) => {
    let copied = obj;

    // 不是引用型，直接返回
    if (!(obj instanceof Object)) return copied;

    // 循环引用, 则返回 weakmap 中映射的对象
    if (visited.has(obj)) return (copied = visited.get(obj));

    // 创建引用对象副本, 并存入 visited WeakMap 中
    copied = Object.create(Object.getPrototypeOf(obj));
    visited.set(obj, copied);

    // 核心
    const objDescriptors = Object.getOwnPropertyDescriptors(obj);
    for (const k of Reflect.ownKeys(objDescriptors)) {
        const kk = k as any;
        if (objDescriptors[kk].value instanceof Object) {
            objDescriptors[kk].value = deepCopy((obj as any)[kk], visited);
        }
    }
    Object.defineProperties(copied, objDescriptors);
    return copied;
};

const deepCopy = (obj: unknown, visited = new WeakMap()) => {
    // 函数
    if (obj instanceof Function) {
        let fnStr = obj.toString();
        if (fnStr.indexOf('(') > 0) {
            fnStr = 'function' + fnStr.slice(fnStr.indexOf('('));
        }
        return new Function('return ' + fnStr)();
    }

    // Map
    if (obj instanceof Map) return new Map(deepCopySimplify([...obj], visited));

    // Set
    if (obj instanceof Set) return new Set(deepCopySimplify([...obj], visited));

    // 常规对象、数组、非引用类型
    return deepCopySimplify(obj, visited);
};

export default deepCopy;
