/**
 * @title eventListener
 * @author wzdong
 * @description 事件监听器, 用于需要监听自定义事件的类继承或挂载其成员方法 on\off\emit , 或需要监听自定义事件的对象挂载 on\off\emit 方法
 */

interface GetEventCb<EvtName, Evt extends any[]> {
    (evtName: EvtName, idx: number): undefined | ((...evt: Evt) => void);
    (evtName: EvtName, listener: (...evt: Evt) => void): number;
}

/**
 * eventListener 事件派发器
 * @returns
 * @property {@link emit} 派发事件
 * @property {@link on} 添加事件
 * @property {@link off} 移除事件
 * @property {@link once} 单次事件
 * @property {@link clear} 清除事件
 * @property {@link getCb} 获取指定事件绑定的函数索引或函数体本身
 * @property {@link getCbsNum} 获取事件绑定的 cb 个数
 */
export function eventListener<EvtName extends string | number | symbol, Evt extends any[] = any[], T = any>(this: T) {
    const _evtHooksRecord = {} as Record<EvtName, ((...evt: Evt) => Promise<void> | void)[]>;
    const _findEvtHooks = (evtName: EvtName) => {
        _evtHooksRecord[evtName] ||= [];
        return _evtHooksRecord[evtName];
    };
    // 获取事件处理函数索引或函数体本身，若传索引则返回函数体本身，反之返回索引
    const getCb = ((evtName, p) => {
        if (typeof p === 'number') {
            return _findEvtHooks(evtName)[p];
        } else {
            return _findEvtHooks(evtName).indexOf(p);
        }
    }) as GetEventCb<EvtName, Evt>;
    // 获取事件绑定的 cb 个数
    const getCbsNum = (evtName: EvtName) => _findEvtHooks(evtName).length;
    // 派发事件，类似于 dispatchEvent
    const emit = async (evtName: EvtName, ...evt: Evt) => {
        for (const cb of _findEvtHooks(evtName)) {
            await cb(...evt);
        }
    };
    // 添加事件，类似于 addEventListener
    const on = (evtName: EvtName, listener: (...evt: Evt) => Promise<void> | void) => {
        _findEvtHooks(evtName).push(listener);
    };
    // 移除事件，类似于 removeEventListener
    const off = (evtName: EvtName, listener: (...evt: Evt) => Promise<void> | void) => {
        const evtHooks = _findEvtHooks(evtName);
        evtHooks.splice(evtHooks.indexOf(listener), 1);
    };
    // 单次事件，类似于 addEventListener(,,{once: true})
    const once = (evtName: EvtName, listener: (...evt: Evt) => Promise<void> | void) => {
        const ls = (...evt: Evt) => {
            listener(...evt);
            off(evtName, ls);
        };
        on(evtName, ls);
    };
    // 清除事件
    const clear = (evtName: EvtName) => {
        _evtHooksRecord[evtName] = [];
    };
    return {
        on,
        off,
        once,
        emit,
        clear,
        getCb,
        getCbsNum,
    };
}
