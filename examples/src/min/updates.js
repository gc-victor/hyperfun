import { update } from '@hyperfun/run';

export const submit = ev => {
    ev.preventDefault();
    update({
        type: 'SUBMIT',
        payload: () => ({ submitText: ev.target.name.value }),
    });
};
export const reset = () =>
    update({
        type: 'RESET',
        payload: () => ({ submitText: '', text: '' }),
    });
export const typing = ev =>
    update({
        type: 'TYPING',
        payload: () => ({ text: ev.target.value }),
    });
