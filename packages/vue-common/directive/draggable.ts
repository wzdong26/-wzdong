/**
 * @title draggable
 * @description 使元素可拖拽移动，支持PC、移动端设备(vue directive)
 * @author wzdong
 * @param el 目标元素，目标元素必须是支持 inset 布局，建议 position: fixed
 * @param binding 绑定对象 value {@link BindingValue}
 * @remark 在元素当前样式作用域 class 中添加 draggable[moving] / draggable[moved] 可设置移动时和移动完成时的样式
 */

import { throttle, typeOf } from '@wzdong/utils';
import { DirectiveBinding } from 'vue';

enum Inset {
    top = 1,
    right = 1 << 2,
    bottom = 1 << 3,
    left = 1 << 4,
}

export enum DragDirection {
    top = Inset.top,
    right = Inset.right,
    bottom = Inset.bottom,
    left = Inset.left,
    top_left = Inset.top | Inset.left,
    top_right = Inset.top | Inset.right,
    bottom_left = Inset.bottom | Inset.left,
    bottom_right = Inset.bottom | Inset.right,
}

type InsetTurtle = [top?: number, right?: number, bottom?: number, left?: number];

export type OnMove = (curInset: InsetTurtle, inset: InsetTurtle, preventMove: () => true) => void | (() => void);

type BindingValue =
    | {
          // return direction: DragDirection: 指定拖拽方向，支持 8 种; 默认为 DragDirection.top_left 以左侧和顶侧为基准移动;
          direction?: DragDirection;
          // 触发拖拽光标长按时间, default 80. 与 click 事件区分
          ms?: number;
          // 事件阶段
          capture?: boolean;
          // dragging 时的样式名
          class?: string;
          // 移动时触发的回调, 返回值boolean标识其是否阻止移动, 即若返回为 true, 阻止此次移动。
          // param curInset: 当前的样式属性inset;
          // param inset: 当前将要移动的样式属性inset;
          // param preventMove: 是否阻止此次移动, 调用则阻止;
          // return onMoved: () => void: 移动完成时触发的回调。
          onMove?: OnMove;
      }
    | OnMove
    | undefined;

let cleanup: () => void;

// 计算 window 的 innerWidth, innerHeight
let { innerWidth, innerHeight } = window;
const computeWindowRect = () => {
    const onResize = () => {
        [innerWidth, innerHeight] = [window.innerWidth, window.innerHeight];
    };
    addEventListener('resize', onResize);
    return () => {
        removeEventListener('resize', onResize);
    };
};
const cleanComputeWindowRect = computeWindowRect();

const draggable = (el: HTMLElement, { value }: DirectiveBinding<BindingValue>) => {
    // 监听移动时的回调 / 移动结束时的回调
    const onMove = typeOf.isFunction(value) ? value : value?.onMove;
    let onMoved: null | (() => void) = null;

    // 触发拖拽光标长按时间
    const ms = (value as Exclude<BindingValue, OnMove>)?.ms ?? 80;
    const capture = (value as Exclude<BindingValue, OnMove>)?.capture ?? false;
    const direction = (value as Exclude<BindingValue, OnMove>)?.direction ?? DragDirection.top_left;
    const classNameOnDragging = (value as Exclude<BindingValue, OnMove>)?.class;

    // 设置移动时的 class 样式
    const setClass = () => {
        if (!classNameOnDragging) return null;
        const { classList } = el;
        const { margin, transform } = el.style;
        // margin \ transform 影响 inset 位置
        el.style.margin = '';
        el.style.transform = '';
        classList.add(classNameOnDragging);
        return () => {
            classList.remove(classNameOnDragging);
            el.style.margin = margin;
            el.style.transform = transform;
        };
    };
    let removeClass: null | (() => void) = null;

    // 目标元素开始 drag 时的位置 Rect
    let elRectOnStartDrag: DOMRect | null = null;
    // 是否冒泡标识，null则阻止冒泡，否则正常冒泡
    let propagationFlag: number | NodeJS.Timeout | null = null;

    // 根据 DOMRect 中的 'top' | 'left' | 'width' | 'height' 四个属性计算 inset
    const computeInset = ({ top, left, width, height }: Record<'top' | 'left' | 'width' | 'height', number>) => {
        const [right, bottom] = [innerWidth - width - left, innerHeight - height - top];
        return [top, right, bottom, left] as InsetTurtle;
    };

    // 根据 direction 判断该改变 el.style.inset 的哪个值(动画帧节流处理)
    const setInsetStyle = throttle(([top, right, bottom, left]: InsetTurtle) => {
        direction & Inset.top && (el.style.top = top + 'px');
        direction & Inset.right && (el.style.right = right + 'px');
        direction & Inset.bottom && (el.style.bottom = bottom + 'px');
        direction & Inset.left && (el.style.left = left + 'px');
    });

    let curInset: InsetTurtle;
    cleanup = el.onDrag(
        (evt) => {
            // 记录目标元素开始 drag 时的 Rect
            elRectOnStartDrag ??= (() => {
                // 开始 drag 时触发，之后 dragging 过程中不再触发
                if ((evt as PointerEvent).pointerType === 'mouse') {
                    // 设置定时器，若 dragEnd 时超时（即定时器为null了）则判定为长按，不冒泡
                    propagationFlag = setTimeout(() => {
                        clearTimeout(propagationFlag as number);
                        propagationFlag = null;
                    }, ms);
                } else {
                    propagationFlag = 1;
                }
                removeClass = setClass();
                const rect = el.getBoundingClientRect();
                // 计算开始时刻 el 的位置
                curInset = computeInset(rect);
                return rect;
            })();

            const { top: top_, left: left_, height, width } = elRectOnStartDrag;
            // pointer 移动的位移坐标
            const {
                position: { startClientY, clientY, clientX, startClientX },
            } = evt;
            const [deltaX, deltaY] = [clientX - startClientX, clientY - startClientY];
            // 若 direction 指定单一维度，指针移动方向为另一维度则直接 return; 如 指定 left, 当指针上下移动时不会反应
            let preventMove =
                !!((Inset.left | (Inset.right & direction)) === direction && Math.abs(deltaY) > Math.abs(deltaX)) ||
                !!((Inset.top | (Inset.bottom & direction)) === direction && Math.abs(deltaY) < Math.abs(deltaX));
            if (!preventMove) {
                const [top, left] = [top_ + deltaY, left_ + deltaX];
                // 计算 el 将要移动到的位置
                const inset = computeInset({ height, width, top, left });
                // 入参中传入一个 preventMove 函数，调用则停止此次移动
                onMoved = onMove?.call({ el, evt }, curInset, inset, () => (preventMove = true)) ?? null;
                if (!preventMove) {
                    // 如果此次移动，将阻止默认事件，避免造成冲突
                    evt.cancelable && evt.preventDefault();
                    setInsetStyle(inset);
                    curInset = inset;
                }
            }

            return (evt) => {
                propagationFlag ??
                    el.addEventListener('click', (e) => e.stopPropagation(), { once: true, capture: true });
                elRectOnStartDrag = null;
                removeClass?.();
                onMoved?.call({ el, evt });
                removeClass = null;
                onMoved = null;
            };
        },
        { capture, passive: false }
    );
};

export default {
    mounted: draggable,
    beforeUnmount: () => {
        cleanup?.();
        cleanComputeWindowRect();
    },
};
