import onDrag from './onDrag';

const customEvents = { onDrag };

declare global {
    interface HTMLElement {
        prototype: HTMLElement & typeof customEvents;
    }
}

Object.assign(HTMLElement.prototype, customEvents);

export default customEvents;
