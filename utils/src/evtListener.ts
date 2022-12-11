/**
 * @title evtListener
 * @author wzdong
 * @description 事件监听器, 用于需要监听自定义事件的类继承或挂载其成员方法 on\off\emit , 或需要监听自定义事件的对象挂载 on\off\emit 方法
 */

/**
 * @eg
 * class ChildClass extends EvtListener<EvtName, Evt> {
 *     constructor() {
 *         super(evtNameList?: EvtName[])
 *     }
 * }
 */
export default class EvtListener<EvtName extends string, Evt = any> {
    private _evtNameList?: EvtName[];
    private _evtHooksRecord: Record<EvtName, Array<(evt: Evt) => void>> = {} as any;

    constructor(evtNameList?: EvtName[]) {
        this._evtNameList = evtNameList;
    }
    private _findEvtHooks(evtName: keyof typeof this._evtHooksRecord): Record<EvtName, ((evt: Evt) => void)[]>[EvtName] | never {
        if (this._evtNameList && !this._evtNameList.includes(evtName)) throw new Error(`There is no event called ${evtName}!`);
        this._evtHooksRecord[evtName] = this._evtHooksRecord[evtName] ?? [];
        return this._evtHooksRecord[evtName];
    }
    emit(evtName: keyof typeof this._evtHooksRecord, evt: Evt, self?: object) {
        const evtHooks = this._findEvtHooks(evtName);
        evtHooks.forEach((cbk) => cbk.bind(self)(evt));
    }
    // 添加事件，类似于HtmlElement.addEventListener
    on(evtName: keyof typeof this._evtHooksRecord, listener: (evt: Evt) => void) {
        const evtHooks = this._findEvtHooks(evtName);
        evtHooks.push(listener);
    }
    // 注销事件，类似于HtmlElement.removeEventListener
    off(evtName: keyof typeof this._evtHooksRecord, listener: (evt: Evt) => void) {
        const evtHooks = this._findEvtHooks(evtName);
        evtHooks.splice(evtHooks.indexOf(listener), 1);
    }
    // 清除事件
    clear(evtName: keyof typeof this._evtHooksRecord) {
        this._evtHooksRecord[evtName] = [];
    }
}

/**
 * @eg1
 * class SomeClass {
 *     constructor() {
 *         useEventListener.bind(this)<EvtName, Evt>(evtNameList?: EvtName[])
 *     }
 * }
 * @eg2
 * const someObj = {}
 * useEventListener.bind(someObj)<EvtName, Evt>(evtNameList?: EvtName[])
 */
export function useEventListener<EvtName extends string, Evt = any>(this: any, evtNameList?: EvtName[]) {
    const evtListener = new EvtListener<EvtName, Evt>(evtNameList);
    this.on = evtListener.on.bind(evtListener);
    this.off = evtListener.off.bind(evtListener);
    this.emit = (evtName: EvtName, evt: Evt) => evtListener.emit.bind(evtListener)(evtName, evt, this);
    this.clear = (evtName: EvtName, evt: Evt) => evtListener.clear.bind(evtListener)(evtName);
    return this;
}

// 函数式实现
export function useEvtListener<EvtName extends string, Evt = any>(evtNameList?: EvtName[]) {
    const _evtNameList: EvtName[] | undefined = evtNameList;
    const _evtHooksRecord: Record<EvtName, Array<(evt: Evt) => void>> = {} as any;
    function _findEvtHooks(evtName: keyof typeof _evtHooksRecord): Record<EvtName, ((evt: Evt) => void)[]>[EvtName] | never {
        if (_evtNameList && !_evtNameList.includes(evtName)) throw new Error(`There is no event called ${evtName}!`);
        _evtHooksRecord[evtName] = _evtHooksRecord[evtName] ?? [];
        return _evtHooksRecord[evtName];
    }
    function emit(evtName: keyof typeof _evtHooksRecord, evt: Evt, self?: object) {
        const evtHooks = _findEvtHooks(evtName);
        evtHooks.forEach((cbk) => cbk.apply(self, [evt]));
    }
    // 添加事件，类似于HtmlElement.addEventListener
    function on(evtName: keyof typeof _evtHooksRecord, listener: (evt: Evt) => void) {
        const evtHooks = _findEvtHooks(evtName);
        evtHooks.push(listener);
    }
    // 注销事件，类似于HtmlElement.removeEventListener
    function off(evtName: keyof typeof _evtHooksRecord, listener: (evt: Evt) => void) {
        const evtHooks = _findEvtHooks(evtName);
        evtHooks.splice(evtHooks.indexOf(listener), 1);
    }
    // 清除事件
    function clear(evtName: keyof typeof _evtHooksRecord) {
        _evtHooksRecord[evtName] = [];
    }
    return {
        on,
        off,
        emit,
        clear,
    };
}
