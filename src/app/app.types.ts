export interface App {
    id?: string;
    view?: View;
    [key: string]: any;
}

export interface Props {
    [key: string]: any;
}

export type View = (data?: unknown) => any;
