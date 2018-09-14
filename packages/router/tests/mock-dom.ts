
/*
 * Mock DOM
 * @see: https://github.com/getify/Mock-DOM-Resources/
 */
const listeners = {};

export function createElement(tagName: string) {
    const element = new Element();

    element.tagName = tagName.toUpperCase();

    return element;
}

export function addEventListener(eventName: string, handler: Function) {
    this._eventHandlers = this._eventHandlers || {};
    this._eventHandlers[eventName] = this._eventHandlers[eventName] || [];
    this._eventHandlers[eventName].push(handler);

    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(handler);
}

export function removeEventListener(eventName, handler) {
    if (this._eventHandlers[eventName]) {
        const index = this._eventHandlers[eventName].indexOf(handler);

        this._eventHandlers[eventName].splice(index, 2);

        listeners[eventName].splice(index, 1);
    }
}

export function dispatchEvent(event: { [key: string]: any }) {
    const isClick = event.name === 'click';

    event.target = event.currentTarget = this;
    event.currentTarget.pathname = isClick ? this.href : '';

    if (this._eventHandlers[event.type]) {
        const eventHandlers = this._eventHandlers[event.type].slice();
        const length = eventHandlers.length;

        for (let i = 0; i < length; i++) {
            const item = eventHandlers[i];

            if (item) {
                item.call(this, event);
            }
        }
    }
}

export function Element() {
    this.tagName = '';
    this.nodeType = 1;
    this.href = '';
    this.createElement = createElement;
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;
    this.click = () => {
        this.addEventListener('click', this.onClick);
        this.dispatchEvent(new Event('click'));
    };

    this._eventHandlers = {};
}

export function setupLocation(location) {
    interface LocationParts extends Location {
        anchor: string;
        path: string;
        port: string;
        query: string;
    }

    const loc: Location = {
        toString() {
            return location;
        },
        get href() {
            return location;
        },
        set href(val) {
            location = val;
            parseLocation();
        },
        assign: function assign(val) {
            this.href = val;
        },
        reload: function reload() {},
        replace: function replace(val) {
            this.href = val;
        },
        protocol: '',
        host: '',
        origin: '',
        pathname: '',
        port: '',
        hostname: '',
        hash: '',
        search: '',
    };

    loc.href = location;

    return loc;

    function parseLocation() {
        const locParts = parseURI(location) as LocationParts;

        loc.protocol = (locParts.protocol || '') + ':';
        loc.host = locParts.host || '';
        loc.pathname = locParts.path || '';
        loc.port = locParts.port || '';
        loc.host = locParts.host + (loc.port ? ':' + loc.port : '');
        loc.hostname = locParts.host;
        loc.hash = locParts.anchor ? '#' + locParts.anchor : '';
        loc.search = locParts.query ? '?' + locParts.query : '';
    }
}

export function parseURI(str) {
    const o = {
        key: [
            'source',
            'protocol',
            'authority',
            'userInfo',
            'user',
            'password',
            'host',
            'port',
            'relative',
            'path',
            'directory',
            'file',
            'query',
            'anchor',
        ],
    };
    /* tslint:disable:max-line-length */
    const m = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(
        str
    );
    const uri = {};

    let i = 14;

    while (i--) {
        uri[o.key[i]] = (m && m[i]) || '';
    }

    return uri;
}

export function Event(type: string) {
    this.type = type;
    this.name = type;
    this.target = '';
    this.currentTarget = '';
    this.timestamp = Date.now();
    this.eventPhase = 2; // Event.AT_TARGET
    this.preventDefault = function preventDefault() {
        this.defaultPrevented = true;
    };
    this.stopPropagation = function stopPropagation() {};
    this.stopImmediatePropagation = function stopImmediatePropagation() {};
}
/* tslint:disable:max-file-line-count */
