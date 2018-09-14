# hyperfun dom

Hyper Script Helpers and Incremental DOM/String mixed to create a template engine that can be rendered on the server and the client.

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
