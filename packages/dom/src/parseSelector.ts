const classIdSplit = /([.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;

export interface Attributes {
    id?: string;
    className?: string;
}

export function parseSelector(selector: string): Attributes {
    const attributesMap: Attributes = {};
    const tagParts = selector.split(classIdSplit);
    const tagPartsLength = tagParts.length;

    for (let i = 0; i < tagPartsLength; i++) {
        const part: string = tagParts[i];
        const name = part.substring(1, part.length).trim();

        if (!part) {
            continue;
        }

        const type = part.charAt(0);

        if (type === '.' && name.trim()) {
            const className = attributesMap.className || '';
            attributesMap.className = `${className ? className + ' ' : ''}${name}`;
        } else if (type === '#' && name.trim() && i === 1) {
            attributesMap.id = name;
        }
    }

    return attributesMap;
}
