import onDrag from './onDrag';

declare global {
    interface HTMLElement {
        onDrag: typeof onDrag
    }
}

export const customEvents = { onDrag };

export const addCustomEvents = (evts?: Partial<typeof customEvents>) => {
    Object.assign(HTMLElement.prototype, evts ?? customEvents);
};
