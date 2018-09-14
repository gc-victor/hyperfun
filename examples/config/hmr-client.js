(function (io) {
    'use strict';

    io = 'default' in io ? io['default'] : io;

    // @see https://github.com/alexisvincent/systemjs-hot-reloader
    const isBrowser = typeof window !== 'undefined';
    const isWorker = typeof WorkerGlobalScope !== 'undefined';
    const hotModuleReplace = new Event('hotModuleReplace');
    const hmrClient = (opts = {}) => {
        const injectFile = (fileName) => {
            const injectable = /\.js$/.test(fileName) ?
                loadJs(fileName.replace('dist', '')) :
                false;

            if (injectable) {
                const hmr = document.getElementById('js-hmr');
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    document.dispatchEvent(hotModuleReplace);
                }, 500);

                hmr.parentNode.replaceChild(loadJs('http://localhost:8080/app.js'), hmr);
            }
        };

        const loadJs = (file) => {
            const script = document.createElement('script');

            script.id = 'js-hmr';
            script.src = file;
            script.dataset.hmr = Date.now();

            return script;
        };

        const options = Object.assign({
            entries: [],
            baseURL: 'http//:localhost:8080/',
            host: `//${location.hostname}:5776`
        }, opts);

        const {host} = options;

        const socket = io(host);

        const reloadPage = () => {
            console.log('whole page reload requested');
            if (isBrowser) {
                location.reload(true);
            }
        };

        const fileChanged = ({url}) => {
            console.log('reloading', url);
            injectFile(`${options.baseURL}${url}`);

        };

        socket.on('connect', () => {
            console.log('connected to ', host);
            socket.emit('identification', navigator.userAgent);
        });

        socket.on('disconnect', () => {
            console.log('disconnected from', host);
        });

        socket.on('reload', reloadPage);
        socket.on('change', (event) => {
            if (event.path === 'index.html') reloadPage();
            else fileChanged({url: event.path});
        });

        // emitting errors for jspm-dev-buddy
        if (isBrowser) {
            window.onerror = (err) => {
                socket.emit('error', err);
            };
        } else if (isWorker) {
            self.onerror = (err) => {
                socket.emit('error', err);
            };
        }
    };

    hmrClient();

}(io));
