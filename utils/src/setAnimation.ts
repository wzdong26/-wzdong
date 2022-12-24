/**
 * @title setAnimation
 * @author wzdong
 * @exports animate {@link animate}
 */

/**
 * setAnimation 利用 {@link requestAnimationFrame} 创建动画
 * @param animation 动画函数
 * @param duration 动画时长, 不设置则是永久动画
 * @param final 动画结束时的状态设置函数
 */
const setAnimation = (
    animation: (opt: { delta: number; time: number }) => void,
    duration?: number,
    final?: (opt: { time: number }) => void
) => {
    let lastTime: number | undefined;
    let firstTime: number | undefined;
    const raf = (time: number) => {
        const delta = time - (lastTime ?? time);
        if (duration && time - (firstTime = firstTime ?? time) > duration)
            return final?.({ time });
        lastTime = time;
        animation({ delta, time });
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
};

/**
 * animate 基于 {@link setAnimation} 的 promise 实现
 * @param animation 动画函数
 * @param duration 动画时长, 不设置则是永久动画
 * @returns Promise<{ time: number }>
 */
export const animate = (
    animation: (opt: { delta: number; time: number }) => void,
    duration?: number
) =>
    new Promise<{ time: number }>((resolve) => {
        setAnimation(animation, duration, resolve);
    });
