/**
 * @title promiseFns
 * @description 基于 Promise 封装的一些函数，如: 限制 promise 并发、等
 * @author wzdong
 */

/**
 * promiseLimit
 * @param promiseFn promise 函数 (this: T, ...p: P) => Promise<R>
 * @param limit 限制并发数
 * @return function fn (this: T, ...p: P) => Promise<R>
 */
export const promiseLimit = <P extends [], R, T = unknown>(
    promiseFn: (this: T, ...p: P) => Promise<R>,
    limit: number
) => {
    const pendingQueue: Promise<R>[] = [];
    return async function fn(this: T, ...p: P): Promise<R> {
        if (pendingQueue.length >= limit) {
            try {
                await Promise.race(pendingQueue);
            } catch {}
            return await fn.apply(this, p);
        }
        const pending = promiseFn.apply(this, p);
        pendingQueue.push(pending);
        try {
            const rst = await pending;
            pendingQueue.splice(pendingQueue.indexOf(pending), 1);
            return rst;
        } catch (e) {
            pendingQueue.splice(pendingQueue.indexOf(pending), 1);
            throw e;
        }
    };
};
