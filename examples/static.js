import { promises as fsp } from 'fs';
import { join as joinPath } from 'path';
import { h, renderToStringIDom } from '../dist/hyperfun.cjs.development';
import { menu } from './components/menu';
import { footer } from './components/footer';
import { clockComponentInit } from './components/clock';

const clockComponent = clockComponentInit();

const indexHtml = h('html', { lang: 'en' }, [
    h('head', {}, [
        h('meta', { charset: 'UTF-8' }),
        h('title', {}, ['Next']),
        h('link', { rel: 'stylesheet', href: 'https://unpkg.com/tachyons' }),
    ]),
    h('body', {}, [
        h('div', { class: 'sans-serif mh5 mt5 mw7' }, [
            h('div', { id: 'menu' }, [menu()]),
            h('div', { id: 'app' }, [clockComponent()]),
            h('div', { id: 'footer', 'data-skip': 'true' }, [footer()]),
        ]),
    ]),
]);

writeFiles('index.html', indexHtml).then((fullPath) => console.log('Success: ' + fullPath + '\n'));

// @see: https://github.com/jakearchibald/jakearchibald.com/blob/master/static-build/utils.tsx#L27
async function writeFiles(path, content) {
    const pathParts = ['examples', path];
    const fullPath = joinPath(...pathParts);

    await fsp.mkdir(joinPath(...pathParts.slice(0, -1)), { recursive: true });

    try {
        await fsp.writeFile(fullPath, '<!DOCTYPE html>' + renderToStringIDom(content), {
            encoding: 'utf8',
        });

        return fullPath;
    } catch (err) {
        console.error('Failed to write ' + fullPath);
        throw err;
    }
}
