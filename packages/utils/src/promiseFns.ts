/**
 * @title promiseFns
 * @description 基于 Promise 封装的一些函数，如: 限制 promise 并发、等
 * @author wzdong
 */

/**
 * promiseLimit
 * @param promiseFn promise 函数 (this: T, ...p: P) => Promise<R>
 * @param limit 限制并发数
 * @return function fn (...p: P) => Promise<R>
 */
export const promiseLimit = <P extends any[], R, T = unknown>(
    promiseFn: (...p: P) => Promise<R>,
    maxConcurrency: number,
    limit?: boolean
) => {
    const pendingQueue: Set<Promise<R>> = new Set();
    let needAbort = false;
    async function fn(...p: P): Promise<R> {
        if (pendingQueue.size >= maxConcurrency) {
            if (limit) throw Error(`Promise concurrency exceeds maximum limit ${maxConcurrency}`);
            try {
                await Promise.race(pendingQueue);
            } catch {}
            return fn(...p);
        }
        if (needAbort) throw Error('Aborted!');
        const pending = promiseFn(...p);
        pendingQueue.add(pending);
        try {
            const rst = await pending;
            pendingQueue.delete(pending);
            return rst;
        } catch (e) {
            pendingQueue.delete(pending);
            throw e;
        }
    }
    fn.abort = () => {
        needAbort = true;
    }
    return fn;
};
