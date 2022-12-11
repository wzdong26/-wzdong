/**
 * @title draggable
 * @description 使元素可拖拽移动，支持PC、移动端设备(vue directive)
 * @author wzdong
 * @param el 目标元素，目标元素必须是支持 inset 布局，建议 position: fixed
 * @param binding 绑定对象
 * {
 *     device,      设备，传参: 'mobile' | 'pc' | undefined, default: undefined, 两者都支持
 *     ms,          延迟时间, default 250. 与 click 事件区分
 *     o,           移动时的相对原点，支持4种, 0: 左上角; 1: 左下角; 2: 右下角; 3: 右上角; 默认为 0: 左上角
 *     axes,        移动轴，传参: 'x' | 'y' | undefined, 默认 undefined, 即光标位置; 可选择只沿 x 轴移动或只沿 y 轴移动
 *     style,       移动过程中 el 的 style 样式, !important: 不要在移动过程中的样式中设置与位置有关的样式属性，如：position、inset、top、left、right、bottom
 *     className,   移动过程中 el 的 class 样式
 *     setDefault,  设置是否应用 pointermove、touchmove 的默认事件, 默认为 undefined, 即不应用默认事件而触发拖拽移动事件; 设为 true, 则关闭拖拽移动事件, 保证默认事件的正常进行, 如页面滚动、文字拖拽选中等。
 *     onMove,      移动时触发的回调, 返回值boolean标识其是否阻止移动, 即若返回为 true, 阻止此次移动。
 * }
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
    device?: 'mobile' | 'pc';
    ms?: number;
    o?: Origin;
    axes?: 'x' | 'y';
    style?: Partial<CSSStyleDeclaration>;
    className?: string;
    setDefault?: (pointer?: { clientX: number; clientY: number }) => boolean;
    onMove?: (inset: InsetTurtle, oldInset: InsetTurtle) => boolean;
}

const draggable = (
    el: HTMLElement,
    {
        value: { device, ms = 250, o: origin = Origin['topLeft'], axes, style, className, setDefault, onMove } = {} as any,
    }: DirectiveBinding<BindingValue>
) => {
    // margin 影响 inset 位置, 目标元素 margin 必须为 0
    el.style.margin = '0';
    // 移动时默认样式
    style =
        style ||
        (className
            ? undefined
            : {
                  transform: 'scale(1.5)',
                  filter: 'opacity(75 %)',
                  cursor: 'move',
              });

    // 设置移动时的样式
    const setStyle = (el: HTMLElement, flag?: boolean) => {
        style &&
            Object.entries(style).forEach(([attr, val]: any) => {
                el.style[attr] = flag ? '' : val;
            });
        className && el.classList[flag ? 'remove' : 'add'](className);
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
            !onMove?.(insetStyle, oldInset) && (el.style[insetStr as any] = `${insetAllArr[idx]}px`);
        } else {
            insetStyle.fill(NaN);
            changeInsetStyleIdx.forEach((i) => {
                insetStyle[i] = insetAllArr[i];
            });
            !onMove?.(insetStyle, oldInset) &&
                (el.style.inset = insetStyle.map((e) => (Number.isNaN(e) ? 'auto' : `${e}px`)).join(' '));
        }
    };

    // 移动中
    // 适用于PC, 移动设备 touch 会不定时触发 pointerleave, 无法用 onpointermove 监听
    const onPointermove = (evt: MouseEvent) => {
        const { clientX, clientY } = evt;
        if (!setDefault?.({ clientX, clientY })) {
            evt.preventDefault();
            evt.stopPropagation();
            setElPos(clientX, clientY);
        }
    };
    // 适用于移动设备
    const onTouchmove = (evt: TouchEvent) => {
        el.removeEventListener('pointermove', onPointermove);
        const { clientX, clientY } = evt.touches[0];
        if (!setDefault?.({ clientX, clientY })) {
            evt.preventDefault();
            evt.stopPropagation();
            setElPos(clientX, clientY);
        }
    };

    // 开始移动
    const onPointerdown = (evt: PointerEvent) => {
        const { clientX, clientY } = evt;
        recordPointerPos(clientX, clientY);
        device !== 'pc' &&
            document.addEventListener('touchmove', onTouchmove, {
                passive: !!setDefault?.(),
                capture: true,
            });
        device !== 'mobile' &&
            document.addEventListener('pointermove', onPointermove, {
                passive: !!setDefault?.(),
                capture: true,
            });
        timer = setTimeout(() => {
            setStyle(el);
            // pc端支持长按click事件，因此这里要判断超出 ms 时长即判定为拖拽而非 click
            // 捕获阶段阻止冒泡，中断之后的事件流
            el.addEventListener(
                'click',
                (evt: MouseEvent) => {
                    evt.stopPropagation();
                },
                { capture: true, once: true }
            );
        }, ms);
        document.addEventListener('pointerup', stopMove, { once: true });
    };
    el.addEventListener('pointerdown', onPointerdown, true);

    // 停止移动
    const stopMove = () => {
        clearTimeout(timer);
        document.removeEventListener('pointermove', onPointermove, true);
        document.removeEventListener('touchmove', onTouchmove, true);
        setStyle(el, true);
    };
};

export default { mounted: draggable };
