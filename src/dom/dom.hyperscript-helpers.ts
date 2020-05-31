import { h } from './dom.hyperscript';
import { HTMLElements, HTMLElementsAttributes } from './dom.types';

export function hh<T extends HTMLElements>(
    tagName: T
): {
    (attributes?: HTMLElementsAttributes[T], children?: any[]): () => Node;
    (children: any[]): () => Node;
};
export function hh<T extends HTMLElements>(tagName: T) {
    return (attributes: HTMLElementsAttributes[T], children: any[]) => {
        const isArray = Array.isArray(attributes);

        return h(
            tagName,
            isArray ? {} : attributes,
            isArray ? ((attributes as unknown) as any[]) : children
        );
    };
}
