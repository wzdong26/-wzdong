/**
 * @title debounce & throttle
 * @description
 * 1. 防抖debounce: 触发间隔小于设定时间将函数挂起不执行，一旦触发间隔大于设定时间将执行函数。
 * 2. 节流throttle: 触发间隔小于设定时间会在每设定时间间隔内只执行一次。
 * @author wzdong
 */


const INIT_MS = 800;

// 防抖
export const debounce = <T extends any[], R extends any>(
    handler: (...params: T) => R,
    ms: number = INIT_MS
) => {
    let timer: any;
    return (...params: T) => new Promise((resolve, reject) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => resolve(handler(...params)), ms);
    });
};

// 节流
enum ThrottleMode {
    ignorePost = 1,
    ignorePre,
}

export const throttle = <T extends any[]>(
    handler: (...params: T) => void,
    ms: number = INIT_MS,
    mode: ThrottleMode = ThrottleMode.ignorePost
) => {
    let flag: boolean = true;
    switch (mode) {
        case ThrottleMode.ignorePost:
            return (...params: T) => {
                if (flag) {
                    handler(...params);
                    let timer: any = setTimeout(() => {
                        flag = true;
                        clearTimeout(timer);
                        timer = null;
                    }, ms);
                    flag = false;
                }
            };
        case ThrottleMode.ignorePre:
            return (...params: T) => {
                if (flag) {
                    let timer: any = setTimeout(() => {
                        handler(...params);
                        flag = true;
                        clearTimeout(timer);
                        timer = null;
                    }, ms);
                    flag = false;
                }
            };
    }
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
});
