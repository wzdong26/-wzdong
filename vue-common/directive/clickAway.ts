/**
 * @title click-away
 * @description 监听点击元素外部
 * @author wzdong
 * @param el 目标元素
 * @param binding value 事件处理函数
 */

import { ObjectDirective } from 'vue';

interface BindingValue {
    (evt: MouseEvent): void;
}

let onclickEl: (evt: MouseEvent) => void;
let onclick: (evt: MouseEvent) => void;

const clickAway: ObjectDirective<HTMLElement, BindingValue> = {
    mounted(el, { value: handler }) {
        let clickEl = false;
        const onclickEl = () => {
            clickEl = true;
        };
        onclick = (ev) => {
            if (clickEl) {
                clickEl = false;
                return;
            }
            handler(ev);
        };
        el.addEventListener('click', onclickEl);
        document.addEventListener('click', onclick);
    },
    beforeUnmount(el) {
        el.removeEventListener('click', onclickEl);
        document.removeEventListener('click', onclick);
    },
};

export default clickAway;
