/**
 * @title debounce & throttle
 * @author wzdong
 * @export debounce {@link debounce}
 * @export throttle {@link throttle}
 */

/**
 * debounce: 防抖 - 触发间隔小于设定时间将函数挂起不执行，一旦触发间隔大于设定时间将执行函数
 * @param handler (...params: T) => R 需要执行的回调函数
 * @param ms default 800 设定时间间隔，一旦触发间隔大于该值将执行函数
 * @returns (...params: T) => Promise<R>
 */
export const debounce = <T extends any[], R extends any>(handler: (...params: T) => R, ms: number = 800) => {
    let timer: any;
    return (...params: T) =>
        new Promise<R>((resolve) => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => resolve(handler(...params)), ms);
        });
};
