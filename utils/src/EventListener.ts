/**
 * @title EventListener
 * @author wzdong
 * @description 事件监听器, 用于需要监听自定义事件的类继承或挂载其成员方法 on\off\emit , 或需要监听自定义事件的对象挂载 on\off\emit 方法
 */

/**
 * EventListener 事件监听器
 * @returns
 * @property {@link emit} 派发事件
 * @property {@link on} 添加事件
 * @property {@link off} 移除事件
 * @property {@link once} 单次事件
 * @property {@link clear} 清除事件
 */
export function EventListener<EvtName extends string | number | symbol, Evt extends any[] = any[]>() {
    const _evtHooksRecord = {} as Record<EvtName, Array<(...evt: Evt) => void>>;
    const _findEvtHooks = (evtName: EvtName) => {
        _evtHooksRecord[evtName] = _evtHooksRecord[evtName] || [];
        return _evtHooksRecord[evtName];
    };
    // 派发事件，类似于 dispatchEvent
    const emit = (evtName: EvtName, ...evt: Evt) => {
        for (const cbk of _findEvtHooks(evtName)) {
            cbk(...evt);
        }
    };
    // 添加事件，类似于 addEventListener
    const on = (evtName: EvtName, listener: (...evt: Evt) => void) => {
        _findEvtHooks(evtName).push(listener);
    };
    // 移除事件，类似于 removeEventListener
    const off = (evtName: EvtName, listener: (...evt: Evt) => void) => {
        const evtHooks = _findEvtHooks(evtName);
        evtHooks.splice(evtHooks.indexOf(listener), 1);
    };
    // 单次事件，类似于 addEventListener(,,{once: true})
    const once = (evtName: EvtName, listener: (...evt: Evt) => void) => {
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
    };
}
