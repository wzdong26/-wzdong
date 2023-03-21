/**
 * @title draggable
 * @description 使元素可拖拽移动，支持PC、移动端设备(vue directive)
 * @author wzdong
 * @param el 目标元素，目标元素必须是支持 inset 布局，建议 position: fixed
 * @param binding 绑定对象 value {@link BindingValue}
 * @remark 在元素当前样式作用域 class 中添加 draggable[moving] / draggable[moved] 可设置移动时和移动完成时的样式
 */

import { DirectiveBinding } from 'vue';

export enum Origin {
    topLeft,
    bottomLeft,
    bottomRight,
    topRight,
}

enum Inset {
    top,
    right,
    bottom,
    left,
}

type InsetTurtle = [top?: number, right?: number, bottom?: number, left?: number];

interface BindingValue {
    // 设备，传参: 'mobile' | 'pc' | undefined, default: undefined, 两者都支持
    device?: 'mobile' | 'pc';
    // 触发拖拽光标长按时间, default 250. 与 click 事件区分
    ms?: number;
    // 移动时的相对原点，支持4种, 0: 左上角; 1: 左下角; 2: 右下角; 3: 右上角; 默认为 0: 左上角
    o?: Origin;
    // 移动轴，传参: 'x' | 'y' | undefined, 默认 undefined, 即光标位置; 可选择只沿 x 轴移动或只沿 y 轴移动
    axes?: 'x' | 'y';
    // 设置是否应用 pointermove、touchmove 的默认事件, 默认为 undefined, 即不应用默认事件而触发拖拽移动事件;
    // params evt: 指针坐标, flag: 标记是否移动开始; return setDefaultVal: 标记是否阻止拖拽，设为默认事件，设为 true, 则阻止拖拽移动, 保证默认事件的正常进行, 如页面滚动、文字拖拽选中等。
    setDefault?: (evt?: { clientX: number; clientY: number }, flag?: boolean) => boolean;
    // 移动时触发的回调, 返回值boolean标识其是否阻止移动, 即若返回为 true, 阻止此次移动。
    // params inset: 当前将要移动的样式属性inset, oldInset: 移动前的样式属性inset; return flag: 标记是否阻止此次移动
    onMoving?: (inset: InsetTurtle, oldInset: InsetTurtle) => boolean;
    // 移动开始前触发的回调。
    onBeforeMove?: (inset: InsetTurtle) => void;
    // 移动完成时触发的回调。
    onMoved?: (inset: InsetTurtle) => void;
}

const draggable = (
    el: HTMLElement,
    {
        value: {
            device,
            ms = 300,
            o: origin = Origin['topLeft'],
            axes,
            setDefault,
            onMoving,
            onBeforeMove,
            onMoved,
        } = {} as any,
    }: DirectiveBinding<BindingValue>
) => {
    // margin 影响 inset 位置, 目标元素 margin 必须为 0
    el.style.margin = '0';

    // 设置移动时的样式
    const setStyle = (el: HTMLElement, status: 'moving' | 'moved', flag?: boolean) => {
        const { classList } = el;
        classList[flag ? 'remove' : 'add'](`draggable[${status}]`);
        classList[flag ? 'remove' : 'add'](`${classList[0]}[${status}]`);
    };

    // 根据 origin 和 axes 判断该改变 el.style.inset 的哪个值
    const changeInsetStyleIdx = (() => {
        switch (origin) {
            case Origin['topLeft']:
                switch (axes) {
                    case 'x':
                        return [3];
                    case 'y':
                        return [0];
                }
                return [0, 3];
            case Origin['bottomLeft']:
                switch (axes) {
                    case 'x':
                        return [3];
                    case 'y':
                        return [2];
                }
                return [2, 3];
            case Origin['bottomRight']:
                switch (axes) {
                    case 'x':
                        return [1];
                    case 'y':
                        return [2];
                }
                return [1, 2];
            case Origin['topRight']:
                switch (axes) {
                    case 'x':
                        return [1];
                    case 'y':
                        return [0];
                }
                return [0, 1];
        }
    })();

    let pointerRelativePos: { x: number; y: number },
        // 获取元素宽高以及视窗宽高
        widthHeight: {
            width: number;
            height: number;
            innerWidth: number;
            innerHeight: number;
        },
        timer: any;

    // 元素的 style.inset
    let insetStyle: InsetTurtle;
    // 记录指针相对元素位置
    // params clientX, clientY 指针绝对坐标
    const recordPointerPos = (clientX: number, clientY: number) => {
        const { top, left, width, height } = el.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        widthHeight = { width, height, innerWidth, innerHeight };
        insetStyle = [top, innerWidth - width - left, innerHeight - height - top, left];
        pointerRelativePos = {
            x: clientX - left,
            y: clientY - top,
        };
    };

    // 设置目标元素位置，以指针为基点
    // params clientX, clientY 指针绝对坐标
    const setElPos = (clientX: number, clientY: number) => {
        const { x, y } = pointerRelativePos;
        const left = clientX - x;
        const top = clientY - y;
        const { width, height, innerWidth, innerHeight } = widthHeight;
        const insetAllArr = [top, innerWidth - width - left, innerHeight - height - top, left];
        const oldInset = [...insetStyle] as InsetTurtle;
        insetStyle.fill(undefined);
        if (changeInsetStyleIdx.length === 1) {
            const idx = changeInsetStyleIdx[0],
                insetStr = Inset[idx];
            insetStyle[idx] = insetAllArr[idx];
            !onMoving?.(insetStyle, oldInset) && (el.style[insetStr as any] = `${insetAllArr[idx]}px`);
        } else {
            insetStyle.fill(NaN);
            changeInsetStyleIdx.forEach((i) => {
                insetStyle[i] = insetAllArr[i];
            });
            !onMoving?.(insetStyle, oldInset) &&
                (el.style.inset = insetStyle.map((e) => (Number.isNaN(e) ? 'auto' : `${e}px`)).join(' '));
        }
    };

    // 触发移动
    let enableMove = false;
    // 移动中
    const onMove = (evt: PointerEvent | TouchEvent) => {
        if (evt instanceof TouchEvent) {
            el.removeEventListener('pointermove', onMove);
            const { clientX, clientY } = evt.touches[0];
            (evt as any).clientX = clientX;
            (evt as any).clientY = clientY;
        }
        const { clientX, clientY } = evt as PointerEvent;
        if (!!setDefault?.({ clientX, clientY }, false)) {
            timer && clearTimeout(timer);
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        enableMove && setElPos(clientX, clientY);
    };

    // 开始移动
    const onPointerdown = (evt: PointerEvent) => {
        setStyle(el, 'moved', true);
        const { clientX, clientY } = evt;
        if (!!setDefault?.({ clientX, clientY }, true)) return;
        // 适用于移动设备
        device !== 'pc' &&
            document.addEventListener('touchmove', onMove, {
                passive: false,
                capture: true,
            });
        // 适用于PC, 移动设备 touch 会不定时触发 pointerleave, 无法用 onpointermove 监听
        device !== 'mobile' &&
            document.addEventListener('pointermove', onMove, {
                passive: false,
                capture: true,
            });
        document.addEventListener('pointerup', stopMove, { once: true });
        timer = setTimeout(() => {
            // 记录移动前光标位置
            recordPointerPos(clientX, clientY);
            onBeforeMove?.([...insetStyle]);
            setStyle(el, 'moving');
            // 开启移动
            enableMove = true;
            // pc端支持长按click事件，因此这里要判断超出 ms 时长即判定为拖拽而非 click
            // 捕获阶段阻止冒泡，中断之后的事件流
            if (device === 'pc' || !device) {
                el.removeEventListener('click', stopClickPropagation, true);
                el.addEventListener('click', stopClickPropagation, { capture: true, once: true });
            }
        }, ms);
    };
    el.addEventListener('pointerdown', onPointerdown);

    // 停止移动
    const stopMove = () => {
        timer && clearTimeout(timer);
        document.removeEventListener('pointermove', onMove, true);
        document.removeEventListener('touchmove', onMove, true);
        if (enableMove) {
            setStyle(el, 'moving', true);
            setStyle(el, 'moved');
            onMoved?.([...insetStyle]);
            enableMove = false;
        }
        enableMove = false;
    };

    // 阻止PC端点击事件冒泡
    const stopClickPropagation = (evt: MouseEvent) => {
        const { pointerType } = evt as PointerEvent;
        if (pointerType === 'mouse' || !pointerType) {
            evt.stopPropagation();
        }
    };
};

export default { mounted: draggable };
