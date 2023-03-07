/**
 * @title deepCopy
 * @description 对象深拷贝
 * @author wzdong
 */

const deepCopy = (obj: any) => {
    // 浅拷贝原型链
    const copiedObj = Object.create(Object.getPrototypeOf(obj));
    // 获取拷贝对象 obj 的 PropertyDescriptors
    const objDescriptors = Object.getOwnPropertyDescriptors(obj);
    // Reflect.ownKeys 获取 PropertyDescriptors 的键数组, Reflect.ownKeys 优势在于可获取对象自身的所有属性
    for (const k of Reflect.ownKeys(objDescriptors)) {
        if (objDescriptors[k].value instanceof Object) {
            objDescriptors[k].value = deepCopy(obj[k]);
        }
    }
    Object.defineProperties(copiedObj, objDescriptors);
    return copiedObj;
};

export default deepCopy;
