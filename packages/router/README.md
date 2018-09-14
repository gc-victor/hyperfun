# hyperfun router

hyperfun plugin to integrate a router in your hyperfun applications.

## Router

Middleware to initialize the router functionality

### Example

```
import { router } from '@hyperfun/router';
import { div, h1 } from '@hyperfun/dom';

const view = () => div('#app', [h1(['Bye, bey!'])]);

run({
   view,
   render,
   state,
   plugins: [router],
   router: {
       '/': {
           title: () => 'Hello!',
           view,
       },
       '/:slug': {
           title: params => params.slug,
           view,
       },
    },
});
```

## To

Used on an event click of an anchor to navigate through the application.

### Example

```
import { to } from '@hyperfun/router';
import { a } from '@hyperfun/dom';

const link = (props/* { href, className = ''} */, children) =>
    a({ ...props, onClick: to  }, children);
```

## Redirect

A redirection to a path

### Example

```
import { redicrect } from '@hyperfun/router';

redirect('/');
```




