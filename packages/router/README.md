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

## Compatible Versioning

### Summary

Given a version number MAJOR.MINOR, increment the:

- MAJOR version when you make backwards-incompatible updates of any kind
- MINOR version when you make 100% backwards-compatible updates

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR format.

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone https://github.com/<your-username>/hyperfun`
-   Navigate to the newly cloned directory: `cd hyperfun`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/hyperfun/blob/master/LICENSE.md)
