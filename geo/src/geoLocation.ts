/**
 * @title geoLocation
 * @description 基于原生 geolocation 实现
 * @author wzdong
 * @export {@link watchGeolocation} 持续获取定位
 * @export {@link getGeolocation} 单次定位 Promise 封装
 * @export {@link getGeolocationSync} (同步方法)获取最新定位结果
 */
import { eventListener, getSingle } from '@wzdong/utils';

interface WatchLocationCb<T = any> {
    (this: T, data: GeolocationPosition | null, err?: GeolocationPositionError): void;
}

let watchId: number | undefined,
    isWatching = false;
/**
 * watchStatus 查看应用调用定位状态, 0: 未调用; -1: 调用了但还未成功返回定位结果; 1: 调用成功并已经成功返回定位结果
 */
export const watchStatus = () => (watchId ? (isWatching ? 1 : -1) : 0);

// 最新定位数据
let curData: { data: Parameters<WatchLocationCb>[0] } = { data: null };
const watchGeolocationInit = getSingle(() => {
    curData.data = null;

    const evt = (eventListener<symbol, Parameters<WatchLocationCb>, typeof curData>).apply(curData);
    const evtName = Symbol();
    // 添加处理函数
    const on = (cb: WatchLocationCb<typeof curData>) => evt.on(evtName, cb);
    const off = (cb: WatchLocationCb<typeof curData>) => {
        evt.off(evtName, cb);
        !evt.getCbsNum(evtName) && pause();
    };
    const once = (cb: WatchLocationCb<typeof curData>, timeout?: number) => {
        let timer: any;
        if (timeout) {
            timer = setTimeout(() => {
                emit(null, {
                    code: GeolocationPositionError.TIMEOUT,
                    message: 'Timeout!',
                } as any);
            }, timeout);
        }
        evt.once(evtName, function (data, err) {
            clearTimeout(timer);
            cb.apply(this, [data, err]);
            evt.getCbsNum(evtName) === 1 && pause();
        });
    };
    const clear = () => {
        evt.clear(evtName);
        pause();
    };
    const emit: WatchLocationCb = (data, err) => evt.emit(evtName, data, err);

    // `ngl` -> navigator.geolocation
    const ngl = navigator.geolocation;
    // 浏览器是否兼容 ngl
    const compatNgl = () => {
        if (!ngl) {
            emit(null, {
                message: 'The browser does not support `navigator.geolocation`!',
            } as any);
        }
        return !!ngl;
    };
    // 定位 api 持续报错次数
    let errNum = 0,
        maxErrNum = 5,
        resumeTimer: undefined | number | NodeJS.Timeout,
        resumeDelay = 1000;
    // 开始获取定位
    const resume = (opt?: Omit<PositionOptions, 'timeout'>) => {
        watchId ??= ngl.watchPosition(
            (data) => {
                isWatching = true;
                errNum = 0;
                // 记录下成功的data
                curData.data = data;
                emit(data);
            },
            (err) => {
                emit(null, err);
                pause();
                if (++errNum >= maxErrNum) {
                    resumeTimer = setTimeout(() => {
                        resume(opt);
                    }, Math.min(resumeDelay * maxErrNum, (errNum + 1 - maxErrNum) * resumeDelay));
                } else {
                    resume(opt);
                }
            },
            opt
        );
    };
    // 停止获取定位
    const pause = () => {
        watchId && ngl.clearWatch(watchId);
        resumeTimer && clearTimeout(resumeTimer);
        isWatching = false;
        watchId = undefined;
        evt.getCbsNum(evtName) && clear();
    };
    return { on, off, once, clear, emit, compatNgl, resume, pause };
});

/**
 * watchGeolocation 持续监听定位
 * @param cb {@link WatchLocationCb}
 * @param opt {@link PositionOptions}
 * ---
 * @returns
 * @property pause 停止获取定位
 * @property on 添加监听函数
 * @property off 移除监听函数
 * @property once 单次监听函数
 * @property clear 清除所有监听函数并停止调用定位
 * @property cleanup 清除 watchGeolocation 中传入的 cb 监听函数
 */
export const watchGeolocation = (
    cb?: WatchLocationCb | null,
    { enableHighAccuracy = true, maximumAge = 0 }: Omit<PositionOptions, 'timeout'> = {}
) => {
    const { compatNgl, resume, ...returnFn } = watchGeolocationInit();

    cb && returnFn.on(cb);
    const cleanup = () => {
        cb && returnFn.off(cb);
    };

    compatNgl() && resume({ enableHighAccuracy, maximumAge });

    return { ...returnFn, cleanup };
};

/**
 * getGeolocation 单次定位
 * @param param0
 * @property ...PositionOptions {@link PositionOptions}
 * @property maxAccuracy 容许最大精度, 返回结果精度超出该值则 reject
 * ---
 * @returns Promise<GeolocationPosition> {@link GeolocationPosition}
 */
export const getGeolocation = ({
    enableHighAccuracy = true,
    timeout = 3000,
    maximumAge = 0,
    enableCache = true,
}: PositionOptions & {
    enableCache?: boolean;
} = {}) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
        watchGeolocation(null, { enableHighAccuracy, maximumAge }).once(function (data, err) {
            enableCache && (data ??= this.data);
            if (data) {
                resolve(data);
            } else {
                reject(err);
            }
        }, timeout);
    });

/**
 * getGeolocationSync (同步方法)获取最新定位结果
 * ---
 * @returns GeolocationPosition | null {@link GeolocationPosition}
 */
export const getGeolocationSync = () => curData.data;
