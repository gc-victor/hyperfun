# hyperfun dom

Hyper Script Helpers and Incremental DOM/String mixed to create a template engine that can be rendered on the server and the client.

## Install

You can use npm or yarn to install it.

`$ npm install --save @hyperfun/dom`

`$ yarn add @hyperfun/dom`


## Tags

Can be used any HTML tag as a tagName to create an HTMLElement.

````
tagName(selector)
tagName(attrs)
tagName(children)
tagName(attrs, children)
tagName(selector, children)
tagName(selector, attrs, children)
````

- selector: is string, starting with "." or "#".
- attrs: is an object of attributes.
- children: is a hyperscript node, an array of hyperscript nodes, a string or an array of strings.

## How to use it?

### Define selectors

```
div('#id.class')
```

```
<div id="id" class="class"></div>
```

### Define attributes

```
div({id: 'id', className: 'class'})
```

```
<div id="id" class="class"></div>
```

### Define event attributes

```
p([
    button(
        {type: 'button', onClick: event => event.preventDefault},
        ['Click Me']
    )
])
```

```
<p>
    <button type="button">Click Me</button>
</p>
```

### Define text

```
p('HyperFunDOM')
```

```
<p>HyperFunDOM</p>
```

### Define children

```
ul(
    '#id.class',
    [
        li({ key: 'first' }, ['first']),
        li({ key: 'second' }, ['second']),
    ]
)
```

```
<ul id="id" class="class">
    <li>first</li>
    <li>second</li>
</ul>
```

### Render

```
patch(document.getElementById('app'), element)
```  

## References

- https://github.com/google/incremental-dom
- https://github.com/metal/incremental-dom-string
- https://github.com/ohanhi/hyperscript-helpers
- https://github.com/TylorS167/mostly-dom/
- https://github.com/rosston/incremental-hyperscript

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
