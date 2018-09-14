const { existsSync, readFileSync } = require('fs');
const { join } = require('path');
const express = require('express');

const example = process.env.EXAMPLE;
const ssrFile = join(process.cwd(), `examples/src/${example}/ssr.js`);
const hasSsrFile = existsSync(ssrFile);
const view = () => (hasSsrFile ? require(ssrFile)() : '');
const app = express();
const hmr = process.env.HMR || false;
const addOns = [
    'https://unpkg.com/socket.io-client@2.0.1/dist/socket.io.slim.js',
    'http://localhost:8080/hmr-client.js',
];
const body = '</body>';
const scripts = list =>
    list.reduce((strList, item) => `${strList}<script src="${item}"></script>`, '');
const appScript = '<script id="js-hmr" src="app.js"></script>';
const html = readFileSync(join(`examples/src/${example}`, 'index.html'), 'utf8').replace(
    body,
    `
            ${view()}
            ${scripts(addOns)}
            ${appScript}
            ${body}
        `
);

app.use(express.static(join('examples/config')));
app.use(express.static(join(`examples/src/${example}/js`)));
app.use(express.static(join(`examples/src/${example}/styles`)));
app.use(express.static(join('dist')));
app.use(express.static(join('build')));
app.get('*', function(req, res) {
    console.log('Response HTML');
    res.send(html);
});

app.listen(8080, () => console.log('Server listening on port 8080'));

if (hmr) require('chokidar-socket-emitter')({ port: 5776 });
