/**
 * @title onDrag
 * @description [Custom event] Listening on pointer drag, when pointerdown and pointermove is triggered, drag begins; when pointerup, drag ends.
 * @author wzdong
 */

interface PointerPosition {
    // dragStart 时的 pointer 坐标
    startClientX: number;
    startClientY: number;
    // dragging 时的 pointer 坐标
    clientX: number;
    clientY: number;
    // dragging 时此次回调相对前一次回调变化的坐标
    deltaX: number;
    deltaY: number;
}

type IDragEvent = (PointerEvent | TouchEvent) & { position: PointerPosition };

/**
 * onDrag 兼容 pc 和 mobile
 * @param this 目标元素，目标元素必须是支持 inset 布局，建议 position: fixed
 * @param cb 监听函数, dragging 时触发, 其 return 是在 dragEnd 时触发
 * @param opts (useCapture: boolean) | AddEventListenerOptions
 * @returns cleanup 清除监听
 */
function onDrag(
    this: HTMLElement,
    cb: (evt: IDragEvent) => ((evt: IDragEvent) => void) | void,
    opts: boolean | AddEventListenerOptions = false
) {
    // AddEventListenerOptions
    const options = typeof opts === 'boolean' ? { capture: opts } : opts;
    const { capture } = options;
    // The callback function that listens on the event `pointerup`
    let dragEndCb: ReturnType<typeof cb> | null = null;

    // Record pointer position
    const recordPosition = (evt: PointerEvent) => {
        let { clientX: lastClientX, clientY: lastClientY } = evt;
        const position = { startClientX: lastClientX, startClientY: lastClientY } as PointerPosition;

        return <T extends PointerEvent | TouchEvent>(evt: T) => {
            const { clientX, clientY } = (evt as TouchEvent).touches?.[0] ?? evt;
            Object.assign(position, {
                clientX,
                clientY,
                deltaX: clientX - lastClientX,
                deltaY: clientY - lastClientY,
            });
            [lastClientX, lastClientY] = [clientX, clientY];
            return Object.assign(evt, { position });
        };
    };
    let recordPositionR: ReturnType<typeof recordPosition> | null = null;

    // on `pointerdown`
    const onPointerdown = (evt: PointerEvent) => {
        const { pointerType } = evt;
        recordPositionR = recordPosition(evt);
        // Detects whether it is `touch` behavior
        const isTouch = pointerType === 'touch';
        // touch 行为在 move 过程中会不定时触发 pointerleave, 无法用 pointermove 监听, 只能采用 touchmove
        document.addEventListener(isTouch ? 'touchend' : 'pointerup', onPointerup, { ...options, once: true });
        document.addEventListener(isTouch ? 'touchmove' : 'pointermove', onMove, options);
    };
    this.addEventListener('pointerdown', onPointerdown, options);

    // on `pointermove` or `touchmove`
    const onMove = (evt: PointerEvent | TouchEvent) => {
        recordPositionR && (dragEndCb = cb?.(recordPositionR(evt)));
    };

    // on `pointerup`
    const onPointerup = (evt: PointerEvent | TouchEvent) => {
        recordPositionR && dragEndCb?.(recordPositionR(evt));
        cleanupThisDrag();
    };

    // cleanup event listener
    const cleanupThisDrag = () => {
        dragEndCb = null;
        recordPositionR = null;
        document.removeEventListener('pointermove', onMove, capture);
        document.removeEventListener('touchmove', onMove, capture);
        document.removeEventListener('pointerup', onPointerup, capture);
    };

    const cleanup = () => {
        this.removeEventListener('pointerdown', onPointerdown, capture);
        cleanupThisDrag();
    };
    return cleanup;
}

export default onDrag;
