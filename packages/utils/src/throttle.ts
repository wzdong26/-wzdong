/**
 * @title throttle
 * @author wzdong
 */

import { debounce } from './debounce';

/**
 * throttle: 节流 - 触发间隔小于设定时间会在每设定时间间隔内只执行一次
 * @description 连续事件触发时，第一次是立即执行函数，往后每隔 ms 执行一次，最后一次事件触发若刚好卡在 ms 则立即执行，若没有则在此事件触发 ms 后执行。
 * @param handler (...params: T) => void 需要执行的回调函数
 * @param ms 执行间隔时间，若未指定则使用动画帧节流（即每帧执行一次）
 * @returns (...params: T) => void
 */
export const throttle = <T extends any[]>(handler: (...params: T) => void, ms?: number) => {
    let flag: boolean = true;
    // 1. animationFrameThrottle
    if (!ms)
        return function <TT = any>(this: TT, ...params: T) {
            if (flag) {
                flag = false;
                requestAnimationFrame(() => {
                    flag = true;
                    handler.apply(this, params);
                });
            }
        };
    // 2. setTimeoutThrottle
    const setToLastTime = debounce(function (this: any, params: T, flag: boolean) {
        !flag && handler.apply(this, params);
    }, ms);
    return function <TT = any>(this: TT, ...params: T) {
        // 最后一次触发若没有立即执行则在 ms 后执行
        setToLastTime.apply(this, [params, flag]);
        if (flag) {
            // 事件第一次触发立即执行，之后每隔 ms 执行
            handler.apply(this, params);
            let timer = setTimeout(() => {
                flag = true;
                clearTimeout(timer);
            }, ms);
            flag = false;
        }
    };
};
