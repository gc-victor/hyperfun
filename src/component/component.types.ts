export interface Props {
    readonly [key: string]: any;
}
export interface Component {
    props?: Props;
    render?: Render;
}
export interface ComponentOptions {
    created: Created;
    deleted: Deleted;
    execute: Execute;
    key: string;
    update: Update;
    props?: Props;
}
export type Execute = (callback: () => void, dep: any[]) => void;
export type Created = (callback: (element: Element) => void) => void;
export type Render = (options: ComponentOptions) => (props: Props) => Element;
export type Deleted = (callback: (element: Element) => void) => void;
export type Update = <S>(initialState: S) => UpdateResponse<S>;
export type UpdateResponse<S> = [S, (initialValue: S) => void];
