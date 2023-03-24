/**
 * @title onDrag
 * @description [Custom event] Listening on pointer drag, when pointerdown and pointermove is triggered, drag begins; when pointerup, drag ends.
 * @author wzdong
 */

interface PointerPosition {
    startClientX: number;
    startClientY: number;
    clientX: number;
    clientY: number;
    deltaX: number;
    deltaY: number;
}

/**
 * onDrag
 * @param this 目标元素，目标元素必须是支持 inset 布局，建议 position: fixed
 * @param cb 监听函数, dragging 时触发, 其 return 是在 dragEnd 时触发
 * @param opts (useCapture: boolean) | EventListenerOptions
 * @returns cleanup 清除监听
 */
function onDrag(
    this: HTMLElement,
    cb: (
        evt: (PointerEvent | TouchEvent) & { position: PointerPosition }
    ) => ((evt: PointerEvent & { position: PointerPosition }) => void) | void,
    opts: boolean | EventListenerOptions = true
) {
    // EventListenerOptions
    const options = typeof opts === 'boolean' ? { capture: opts } : opts;
    const { capture } = options;
    // The callback function that listens on the event `pointerup`
    let dragEndCb: ReturnType<typeof cb> | null = null;

    // Record pointer position
    const recordPosition = (evt: PointerEvent) => {
        const { clientX, clientY } = evt;
        const position = { startClientX: clientX, startClientY: clientY } as PointerPosition;

        return <T extends PointerEvent | TouchEvent>(evt: T) => {
            const { clientX, clientY } = (evt as TouchEvent).touches?.[0] ?? evt;
            const { startClientX, startClientY } = position;
            Object.assign(position, {
                clientX,
                clientY,
                deltaX: clientX - startClientX,
                deltaY: clientY - startClientY,
            });
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
        document.addEventListener(isTouch ? 'touchmove' : 'pointermove', onMove, options);
        document.addEventListener('pointerup', onPointerup, { ...options, once: true });
    };
    this.addEventListener('pointerdown', onPointerdown, options);

    // on `pointermove` or `touchmove`
    const onMove = (evt: PointerEvent | TouchEvent) => {
        recordPositionR && (dragEndCb = cb?.(recordPositionR(evt)));
    };

    // on `pointerup`
    const onPointerup = (evt: PointerEvent) => {
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
