import {
    Component as ComponentInterface,
    NextProps,
    PrevProps,
    Props,
    RenderOptions,
    RestComponent,
    SetState,
    State,
} from '../types';
import { shallowEqual } from './shallow-equal';
import { ComponentFactory } from './component-factory';

export class Component implements ComponentInterface {
    private noop: Function = () => {};

    public isComponent = true;
    public element: HTMLElement;
    public readonly props: Props = {};
    public setState: SetState;
    public state: State = {};

    constructor() {
        this.attached = this.attached.bind(this);
        this.detached = this.detached.bind(this);
        this.render = this.render.bind(this);
        this.shouldUpdate = this.shouldUpdate.bind(this);
        this.updated = this.updated.bind(this);
    }

    public attached() {}
    public detached() {}
    public updated(nextProps: NextProps, prevProps: PrevProps) {}
    public render(nextProps: NextProps): Function {
        return this.noop();
    }

    public shouldUpdate(nextProps: NextProps, prevProps: PrevProps) {
        return !shallowEqual(nextProps, prevProps);
    }
}

const renderComponent = (newComponent: ComponentFactory) => (
    nextProps: NextProps,
    options: RenderOptions
) => newComponent.renderElement.call(newComponent, nextProps, options);

export function element(render: Function, rest: RestComponent = {}): Function {
    return renderComponent(
        new ComponentFactory({
            ...rest,
            render: (nextProps: NextProps) => render(nextProps),
        })
    );
}

export type CreateComponent<T = ComponentInterface> = new (...args: any[]) => T;

function applyMixin(derivedCtor: any, baseCtor: any) {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
}

// tslint:disable-next-line:variable-name
export function container<TBase extends CreateComponent>(NewComponent: TBase): Function {
    const newComponent = new NewComponent();
    const factory: any = new ComponentFactory(newComponent);

    applyMixin(ComponentFactory, NewComponent);
    ['props', 'state'].forEach((prop: string) => {
        Object.defineProperty(newComponent, prop, {
            get: () => factory[prop],
        });
    });

    newComponent.setState = factory.setState.bind(factory);

    return renderComponent(factory);
}
