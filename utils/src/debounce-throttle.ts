/**
 * @title debounce & throttle
 * @author wzdong
 * @description
 * 1. 防抖{@link debounce}: 触发间隔小于设定时间将函数挂起不执行，一旦触发间隔大于设定时间将执行函数。
 * 2. 节流{@link throttle}: 触发间隔小于设定时间会在每设定时间间隔内只执行一次。
 * 
 * @export throttle
 * @param handler 执行函数
 * @param ms 执行间隔时间，若未指定则使用动画帧节流（即每帧执行一次）
 * @description 连续事件触发时，第一次是立即执行函数，往后每隔 ms 执行一次，最后一次事件触发若刚好卡在 ms 则立即执行，若没有则在此事件触发 ms 后执行。
 */

const INIT_MS = 800;

// 防抖
export const debounce = <T extends any[], R extends any>(
    handler: (...params: T) => R,
    ms: number = INIT_MS
) => {
    let timer: any;
    return (...params: T) => new Promise<R>((resolve) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => resolve(handler(...params)), ms);
    });
};

// 节流
export const throttle = <T extends any[]>(
    handler: (...params: T) => void,
    ms?: number
) => {
    let flag: boolean = true;
    // 1. animationFrameThrottle
    if (!ms) return (...params: T) => {
        if (flag) {
            flag = false;
            requestAnimationFrame(() => {
                flag = true;
                handler(...params)
            })
        }
    }
    // 2. setTimeoutThrottle
    const setToLastTime = debounce((params: T, flag: boolean) => {
        !flag && handler(...params)
    }, ms)
    return (...params: T) => {
        // 最后一次触发若没有立即执行则在 ms 后执行
        setToLastTime(params, flag)
        if (flag) {
            // 事件第一次触发立即执行，之后每隔 ms 执行
            handler(...params);
            let timer = setTimeout(() => {
                flag = true;
                clearTimeout(timer);
            }, ms);
            flag = false;
        }
    };
};


//  --------------------- test ------------------
(() => {
    const btn = document.createElement('button');
    btn.innerText = 'test';
    btn.style.position = 'fixed';
    btn.style.top = '0';
    btn.style.left = '0';
    btn.style.zIndex = '9999';
    const throttleFn = throttle(() => {
        console.log('1');
    }, 1000);
    btn.onclick = () => {
        throttleFn();
    };
    document.body.appendChild(btn);
    const ti = setInterval(() => {
        btn.click()
    }, 100)
    setTimeout(() => {
        clearInterval(ti)
    }, 2950);
});
